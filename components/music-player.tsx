"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

const TRACKS = [
  { id: 1, title: "Clickbait FT Niink", artist: "Veigh", duration: "1:45", url: "https://jumpshare.com/s/QlDFZG8ylx9ObSD7cniB" },
]

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const track = TRACKS[0] // Only one track

  useEffect(() => {
    if (!audioRef.current) {
      const audio = document.createElement("audio")
      audio.crossOrigin = "anonymous"
      audio.style.display = "none"
      // Use our backend endpoint to proxy the audio
      audio.src = "/api/audio"
      audio.volume = volume / 100
      audio.autoplay = true
      audio.preload = "auto"
      document.body.appendChild(audio)
      audioRef.current = audio

      const onPlay = () => setPlaying(true)
      const onPause = () => setPlaying(false)
      const onEnded = () => setPlaying(false)

      audio.addEventListener("play", onPlay)
      audio.addEventListener("pause", onPause)
      audio.addEventListener("ended", onEnded)

      // Trigger autoplay
      audio.play().catch(err => console.error("[v0] Autoplay failed:", err))

      return () => {
        audio.removeEventListener("play", onPlay)
        audio.removeEventListener("pause", onPause)
        audio.removeEventListener("ended", onEnded)
      }
    }
  }, [])

  // Update volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  function togglePlay() {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play().catch(err => console.error("[v0] Play failed:", err))
    } else {
      audioRef.current.pause()
    }
  }

  function toggleMute() {
    setIsMuted(!isMuted)
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVolume(parseInt(e.target.value))
    if (isMuted) setIsMuted(false)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden shadow-lg">
        {/* Album art + controls (compact row) */}
        <div className="flex items-center gap-3 p-3">
          {/* Album cover - small square */}
          <div className="relative shrink-0 size-16 rounded-lg border-2 border-primary/30 overflow-hidden bg-black/40">
            <img
              src="/album-dos-predios.png"
              alt="Dos Prédios Deluxe"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {playing && (
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            )}
          </div>

          {/* Track info + controls */}
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] text-primary/60 uppercase tracking-wider mb-1">
              {track.artist}
            </p>
            <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-2">
              {track.title}
            </h3>
            
            {/* Controls: Play/Pause + Volume */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pausar" : "Reproduzir"}
                className="flex size-7 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 transition-all"
              >
                {playing ? (
                  <Pause className="size-3.5 fill-primary" />
                ) : (
                  <Play className="size-3.5 fill-primary translate-x-0.5" />
                )}
              </button>

              {/* Volume control */}
              <div className="flex items-center gap-1 ml-1">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex size-5 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  title={isMuted ? "Desmutar" : "Mutar"}
                >
                  {isMuted ? (
                    <VolumeX className="size-3.5" />
                  ) : (
                    <Volume2 className="size-3.5" />
                  )}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="h-1 w-12 rounded bg-secondary cursor-pointer accent-primary"
                  title="Volume"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
