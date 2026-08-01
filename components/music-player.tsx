"use client"

import { useEffect, useRef, useState } from "react"
import { SkipBack, SkipForward, Pause, Play } from "lucide-react"

const TRACK = {
  title: "party n get high",
  src: "https://r2.guns.lol/3b58e56a-20a3-4b0e-a261-b36e91dd963d.mp3",
  cover: "https://r2.guns.lol/382e6d88-a9c5-4fab-87ea-850da25efb1c.webp",
}


export function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(1)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) return

    const audio = document.createElement("audio")
    audio.src = TRACK.src
    audio.preload = "auto"
    audio.autoplay = true
    document.body.appendChild(audio)
    audioRef.current = audio

    audio.addEventListener("play", () => setPlaying(true))
    audio.addEventListener("pause", () => setPlaying(false))
    audio.addEventListener("timeupdate", () => setCurrent(audio.currentTime))
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration))

    // Tenta autoplay imediato; se bloqueado pelo browser, toca no primeiro gesto
    audio.play().catch(() => {})

    const tryPlay = () => { if (audio.paused) audio.play().catch(() => {}) }
    window.addEventListener("pointerdown", tryPlay, { once: true })
    window.addEventListener("keydown", tryPlay, { once: true })

    return () => {
      window.removeEventListener("pointerdown", tryPlay)
      window.removeEventListener("keydown", tryPlay)
      audio.remove()
    }
  }, [])

  function togglePlay() {
    const a = audioRef.current
    if (!a) return
    a.paused ? a.play() : a.pause()
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = audioRef.current
    if (!a || !a.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    a.currentTime = ((e.clientX - rect.left) / rect.width) * a.duration
  }

  function skip(delta: number) {
    const a = audioRef.current
    if (!a) return
    a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + delta))
  }

  const progress = duration ? current / duration : 0

  return (
    <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-card/60 px-3 py-2.5 backdrop-blur-md w-full">
      {/* Album cover */}
      <img
        src={TRACK.cover}
        alt="album cover"
        className="size-10 rounded-md object-cover shrink-0"
      />

      {/* Middle: title + progress */}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <span className="text-[13px] font-medium text-foreground/90 truncate leading-none">
          {TRACK.title}
        </span>

        {/* Progress bar */}
        <div
          className="relative h-[3px] w-full rounded-full bg-primary/15 cursor-pointer group"
          onClick={seek}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-primary/70 group-hover:bg-primary transition-colors"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => skip(-10)}
          aria-label="Voltar 10s"
          className="flex size-7 items-center justify-center text-primary/50 hover:text-primary transition-colors"
        >
          <SkipBack className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pausar" : "Reproduzir"}
          className="flex size-7 items-center justify-center text-primary hover:text-primary/80 transition-colors"
        >
          {playing
            ? <Pause className="size-3.5 fill-current" />
            : <Play className="size-3.5 fill-current translate-x-px" />
          }
        </button>

        <button
          type="button"
          onClick={() => skip(10)}
          aria-label="Avançar 10s"
          className="flex size-7 items-center justify-center text-primary/50 hover:text-primary transition-colors"
        >
          <SkipForward className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
