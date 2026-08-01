"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from "lucide-react"

// Playlist do Veigh "Dos Prédios Deluxe" com Spotify IDs
const TRACKS = [
  { id: 1, title: "Novo Balanço", artist: "Veigh", duration: "3:49", youtube: "uGMQbSy_JTM", spotifyId: "1a2b3c4d5e6f7g8h" },
  { id: 2, title: "Cheguei Aqui", artist: "Veigh", duration: "2:51", youtube: "v3d4F5K9M2L1Q7W", spotifyId: "2b3c4d5e6f7g8h9i" },
  { id: 3, title: "Não Me Conhece", artist: "Veigh", duration: "3:21", youtube: "X8Y9Z0a1B2C3D4E", spotifyId: "3c4d5e6f7g8h9i0j" },
  { id: 4, title: "Os Problemas São Meus", artist: "Veigh", duration: "4:03", youtube: "F5G6H7I8J9K0L1M", spotifyId: "4d5e6f7g8h9i0j1k" },
  { id: 5, title: "Bora Lá", artist: "Veigh", duration: "2:45", youtube: "N2O3P4Q5R6S7T8U", spotifyId: "5e6f7g8h9i0j1k2l" },
  { id: 6, title: "Dos Prédios", artist: "Veigh", duration: "3:35", youtube: "V9W0X1Y2Z3a4B5C", spotifyId: "6f7g8h9i0j1k2l3m" },
]

export function MusicPlayer() {
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [duration, setDuration] = useState(0)
  const [visualBars, setVisualBars] = useState<number[]>(() =>
    Array.from({ length: 32 }, () => Math.random() * 80 + 5)
  )
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const barsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const track = TRACKS[trackIdx]

  // Create a dedicated <audio> element for the player (NOT the entry gate audio)
  useEffect(() => {
    if (!audioRef.current) {
      const audio = document.createElement("audio")
      audio.crossOrigin = "anonymous"
      audio.style.display = "none"
      document.body.appendChild(audio)
      audioRef.current = audio

      const onPlay = () => setPlaying(true)
      const onPause = () => setPlaying(false)
      const onTimeUpdate = () => {
        if (audio.duration) setProgress(audio.currentTime / audio.duration)
      }
      const onLoadedMetadata = () => {
        setDuration(audio.duration)
      }
      const onEnded = () => {
        // Auto-play next track when current finishes
        setTrackIdx((i) => (i + 1) % TRACKS.length)
      }

      audio.addEventListener("play", onPlay)
      audio.addEventListener("pause", onPause)
      audio.addEventListener("timeupdate", onTimeUpdate)
      audio.addEventListener("loadedmetadata", onLoadedMetadata)
      audio.addEventListener("ended", onEnded)

      return () => {
        audio.removeEventListener("play", onPlay)
        audio.removeEventListener("pause", onPause)
        audio.removeEventListener("timeupdate", onTimeUpdate)
        audio.removeEventListener("loadedmetadata", onLoadedMetadata)
        audio.removeEventListener("ended", onEnded)
      }
    }
  }, [])

  // Update audio source when track changes
  useEffect(() => {
    if (!audioRef.current) return
    const audio = audioRef.current
    
    // Note: Full track streaming requires Spotify Premium API or YouTube authentication.
    // For now, we're using a simulated player that controls playback UI.
    // To add real playback:
    // 1. Backend proxy: Create API endpoint that streams from YouTube using ytdl-core
    // 2. OR use Spotify Web API with user auth for preview clips (30sec)
    // 3. OR redirect to streaming service when user clicks YouTube button
    
    // Simulate audio metadata for UI purposes
    setDuration(0) // Will be set when play is clicked
    setProgress(0)
  }, [trackIdx])

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

  function togglePlay() {
    setPlaying(!playing)
    // Simulated play - in production, would control real audio or open player
    if (!playing) {
      // Optionally open YouTube video in new tab when clicked
      // window.open(`https://www.youtube.com/watch?v=${track.youtube}`, '_blank')
    }
  }

  function toggleMute() {
    setMuted(!muted)
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
    setProgress(ratio)
  }

  function openYouTube() {
    window.open(`https://www.youtube.com/watch?v=${track.youtube}`, '_blank')
  }

  function openSpotify() {
    window.open(`https://open.spotify.com/search/${encodeURIComponent(track.title + ' ' + track.artist)}`, '_blank')
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

          <button
            type="button"
            onClick={openYouTube}
            aria-label="Abrir no YouTube"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-secondary/40 transition-all duration-200"
            title="Abrir no YouTube"
          >
            <span className="text-xs font-bold">▶</span>
          </button>

          <button
            type="button"
            onClick={openSpotify}
            aria-label="Abrir no Spotify"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-green-500 hover:bg-secondary/40 transition-all duration-200"
            title="Abrir no Spotify"
          >
            <Music className="size-4" />
          </button>
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
