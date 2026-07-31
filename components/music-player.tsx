"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react"

const TRACKS = [
  { title: "Cheguei Aqui", artist: "Veigh", src: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1441296178&auto_play=false" },
  { title: "Não Me Conhece", artist: "Veigh", src: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1365706534&auto_play=false" },
  { title: "Os Problemas São Meus", artist: "Veigh", src: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1289564458&auto_play=false" },
]

// Visual-only music player — indica a faixa atual enquanto o áudio real
// vem do <audio> do EntryGate (enter-sound.mp3). Não tenta controlar
// áudio externo via SoundCloud para evitar restrições de CORS/API key.
export function MusicPlayer() {
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [visualBars, setVisualBars] = useState<number[]>(() =>
    Array.from({ length: 20 }, () => Math.random() * 60 + 10)
  )
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const animFrameRef = useRef<number>(0)
  const barsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const track = TRACKS[trackIdx]

  // Animate equalizer bars when playing
  useEffect(() => {
    if (playing) {
      barsTimerRef.current = setInterval(() => {
        setVisualBars(Array.from({ length: 20 }, () => Math.random() * 60 + 10))
      }, 120)
    } else {
      if (barsTimerRef.current) clearInterval(barsTimerRef.current)
      setVisualBars(Array.from({ length: 20 }, () => 10))
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
    const ratio = (e.clientX - rect.left) / rect.width
    const audio = audioRef.current
    if (audio && audio.duration) {
      audio.currentTime = ratio * audio.duration
    }
    setProgress(ratio)
  }

  return (
    <div className="w-full rounded-xl border border-border bg-card/50 px-4 py-3 backdrop-blur-md">
      {/* Equalizer bars */}
      <div className="mb-3 flex items-end justify-center gap-[2px] h-8" aria-hidden="true">
        {visualBars.map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-sm bg-primary/70 transition-all duration-100"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* Track info */}
      <div className="mb-2 text-center">
        <p className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
          {track.artist}
        </p>
        <p className="font-sans text-[13px] font-medium text-foreground/90 truncate">
          {track.title}
        </p>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mb-3 h-1 w-full cursor-pointer rounded-full bg-muted overflow-hidden"
        onClick={handleProgressClick}
        ref={progressRef}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Ativar som" : "Mutar"}
          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevTrack}
            aria-label="Faixa anterior"
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary"
          >
            <SkipBack className="size-4" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pausar" : "Reproduzir"}
            className="flex size-9 items-center justify-center rounded-xl border border-primary/50 bg-primary/20 text-primary shadow-[0_0_16px_-4px_oklch(0.65_0.26_295/0.7)] transition-all hover:bg-primary/30 hover:shadow-[0_0_24px_-2px_oklch(0.65_0.26_295/0.9)]"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
          </button>

          <button
            type="button"
            onClick={nextTrack}
            aria-label="Próxima faixa"
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary"
          >
            <SkipForward className="size-4" />
          </button>
        </div>

        {/* Track index */}
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {trackIdx + 1}/{TRACKS.length}
        </span>
      </div>
    </div>
  )
}
