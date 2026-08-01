"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, ExternalLink } from "lucide-react"

// Playlist do Veigh "Dos Prédios Deluxe"
const TRACKS = [
  { id: 1, title: "Novo Balanço", artist: "Veigh", duration: "3:49", youtube: "uGMQbSy_JTM", spotify: "0" },
  { id: 2, title: "Cheguei Aqui", artist: "Veigh", duration: "2:51", youtube: "video2", spotify: "1" },
  { id: 3, title: "Não Me Conhece", artist: "Veigh", duration: "3:21", youtube: "video3", spotify: "2" },
  { id: 4, title: "Os Problemas São Meus", artist: "Veigh", duration: "4:03", youtube: "video4", spotify: "3" },
  { id: 5, title: "Bora Lá", artist: "Veigh", duration: "2:45", youtube: "video5", spotify: "4" },
  { id: 6, title: "Dos Prédios", artist: "Veigh", duration: "3:35", youtube: "video6", spotify: "5" },
]

export function MusicPlayer() {
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [visualBars, setVisualBars] = useState<number[]>(() =>
    Array.from({ length: 32 }, () => Math.random() * 80 + 5)
  )
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const barsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const track = TRACKS[trackIdx]

  // Animate equalizer bars when playing
  useEffect(() => {
    if (playing) {
      barsTimerRef.current = setInterval(() => {
        setVisualBars(Array.from({ length: 32 }, () => Math.random() * 80 + 5))
      }, 100)
    } else {
      if (barsTimerRef.current) clearInterval(barsTimerRef.current)
      setVisualBars(Array.from({ length: 32 }, () => 5))
    }
    return () => {
      if (barsTimerRef.current) clearInterval(barsTimerRef.current)
    }
  }, [playing])

  // Hook into the global enter-sound audio (played by EntryGate)
  useEffect(() => {
    const audio = document.querySelector<HTMLAudioElement>("audio")
    if (audio) {
      audioRef.current = audio
      setPlaying(!audio.paused)
      setMuted(audio.muted)

      const onPlay = () => setPlaying(true)
      const onPause = () => setPlaying(false)
      const onTimeUpdate = () => {
        if (audio.duration) setProgress(audio.currentTime / audio.duration)
      }

      audio.addEventListener("play", onPlay)
      audio.addEventListener("pause", onPause)
      audio.addEventListener("timeupdate", onTimeUpdate)
      return () => {
        audio.removeEventListener("play", onPlay)
        audio.removeEventListener("pause", onPause)
        audio.removeEventListener("timeupdate", onTimeUpdate)
      }
    }
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }

  function toggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  function prevTrack() {
    setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length)
  }

  function nextTrack() {
    setTrackIdx((i) => (i + 1) % TRACKS.length)
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const audio = audioRef.current
    if (audio && audio.duration) {
      audio.currentTime = ratio * audio.duration
    }
    setProgress(ratio)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main player card */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Album art area with animated equalizer overlay */}
        <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-primary/5 border-b border-border/50 overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.62_0.24_295/0.2),transparent_70%)]" />
          
          {/* Large music icon as album placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className="size-24 text-primary/30" strokeWidth={1} />
          </div>

          {/* Equalizer bars as overlay */}
          <div className="absolute inset-0 flex items-end justify-center gap-1 p-6" aria-hidden="true">
            {visualBars.map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-primary to-primary/40 transition-all duration-75"
                style={{ 
                  height: `${h}%`,
                  opacity: playing ? 0.8 : 0.3
                }}
              />
            ))}
          </div>

          {/* Track artist label - top */}
          <div className="absolute top-4 left-4 right-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/20 border border-primary/30 text-primary">
              {track.artist}
            </span>
          </div>

          {/* Playing indicator - top right */}
          {playing && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/30">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">Now</span>
              <div className="flex gap-[2px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1 h-3 bg-primary/70 rounded-sm animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Track info */}
        <div className="px-6 py-4 border-b border-border/30">
          <p className="font-mono text-[11px] font-semibold tracking-widest text-primary/60 uppercase mb-1">
            Faixa {trackIdx + 1} de {TRACKS.length}
          </p>
          <h2 className="text-lg font-bold text-foreground mb-1 line-clamp-2">
            {track.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {track.artist} • {track.duration}
          </p>
        </div>

        {/* Progress bar - larger */}
        <div className="px-6 pt-4">
          <div
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 w-full cursor-pointer rounded-full bg-muted/30 overflow-hidden mb-1"
            onClick={handleProgressClick}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary/60 transition-all duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono px-1">
            <span>0:00</span>
            <span>{track.duration}</span>
          </div>
        </div>

        {/* Main controls */}
        <div className="px-6 py-6 border-b border-border/30 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prevTrack}
            aria-label="Faixa anterior"
            className="flex size-10 items-center justify-center rounded-lg bg-secondary/40 text-muted-foreground hover:text-primary hover:bg-secondary/60 transition-all duration-200"
          >
            <SkipBack className="size-5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pausar" : "Reproduzir"}
            className="flex size-16 items-center justify-center rounded-full border-2 border-primary bg-primary/20 text-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:bg-primary/30 transition-all duration-200 active:scale-95"
          >
            {playing ? (
              <Pause className="size-6 fill-primary" />
            ) : (
              <Play className="size-6 fill-primary translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={nextTrack}
            aria-label="Próxima faixa"
            className="flex size-10 items-center justify-center rounded-lg bg-secondary/40 text-muted-foreground hover:text-primary hover:bg-secondary/60 transition-all duration-200"
          >
            <SkipForward className="size-5" />
          </button>
        </div>

        {/* Secondary controls */}
        <div className="px-6 py-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Ativar som" : "Mutar"}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/40 transition-all duration-200"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary/40 text-sm font-medium text-foreground hover:bg-secondary/60 transition-all duration-200"
          >
            <Music className="size-4" />
            Playlist ({TRACKS.length})
          </button>

          <a
            href={`https://www.youtube.com/watch?v=${track.youtube}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir no YouTube"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/40 transition-all duration-200"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>

      {/* Expandable playlist */}
      {showPlaylist && (
        <div className="mt-3 rounded-xl border border-border bg-card/50 backdrop-blur-md overflow-hidden max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-border/30 sticky top-0 bg-card/80 backdrop-blur">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary">Todas as faixas</p>
          </div>
          <div className="divide-y divide-border/20">
            {TRACKS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  setTrackIdx(idx)
                  setShowPlaylist(false)
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all hover:bg-primary/10 ${
                  idx === trackIdx ? "bg-primary/15 border-l-2 border-primary" : ""
                }`}
              >
                <span className={`text-xs font-mono font-semibold w-6 ${
                  idx === trackIdx ? "text-primary" : "text-muted-foreground"
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    idx === trackIdx ? "text-primary" : "text-foreground"
                  }`}>
                    {t.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.duration}</p>
                </div>
                {idx === trackIdx && playing && (
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1 h-2 bg-primary rounded-sm animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Credits */}
      <p className="text-center text-xs text-muted-foreground/60 mt-4">
        Playlist: Veigh - Dos Prédios Deluxe
      </p>
    </div>
  )
}
