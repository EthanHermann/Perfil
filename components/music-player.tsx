"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, SkipForward, SkipBack, Music } from "lucide-react"

const TRACKS = [
  { id: 1, title: "Clickbait FT Niink", artist: "Veigh", duration: "1:45", youtube: "XdGmHIZmg4w" },
]

export function MusicPlayer() {
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const track = TRACKS[trackIdx]

  useEffect(() => {
    if (!audioRef.current) {
      const audio = document.createElement("audio")
      audio.crossOrigin = "anonymous"
      audio.style.display = "none"
      document.body.appendChild(audio)
      audioRef.current = audio

      const onPlay = () => setPlaying(true)
      const onPause = () => setPlaying(false)

      audio.addEventListener("play", onPlay)
      audio.addEventListener("pause", onPause)

      return () => {
        audio.removeEventListener("play", onPlay)
        audio.removeEventListener("pause", onPause)
      }
    }
  }, [])

  function togglePlay() {
    setPlaying(!playing)
  }

  function prevTrack() {
    setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length)
  }

  function nextTrack() {
    setTrackIdx((i) => (i + 1) % TRACKS.length)
  }

  function openYouTube() {
    window.open(`https://www.youtube.com/watch?v=${track.youtube}`, '_blank')
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
            
            {/* Mini controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevTrack}
                aria-label="Anterior"
                className="flex size-6 items-center justify-center rounded text-muted-foreground hover:text-primary hover:bg-secondary/40 transition-colors"
              >
                <SkipBack className="size-3.5" />
              </button>

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

              <button
                type="button"
                onClick={nextTrack}
                aria-label="Próxima"
                className="flex size-6 items-center justify-center rounded text-muted-foreground hover:text-primary hover:bg-secondary/40 transition-colors"
              >
                <SkipForward className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={openYouTube}
                title="Abrir no YouTube"
                className="ml-auto flex size-6 items-center justify-center rounded text-muted-foreground hover:text-red-500 transition-colors"
              >
                <span className="text-xs font-bold">▶</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPlaylist(!showPlaylist)}
                title="Playlist"
                className="flex size-6 items-center justify-center rounded text-muted-foreground hover:text-primary hover:bg-secondary/40 transition-colors"
              >
                <Music className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Playlist dropdown */}
        {showPlaylist && (
          <div className="border-t border-border/30 bg-card/50 max-h-48 overflow-y-auto">
            <div className="divide-y divide-border/20">
              {TRACKS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTrackIdx(idx)
                    setShowPlaylist(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                    idx === trackIdx 
                      ? "bg-primary/15 text-primary font-semibold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  }`}
                >
                  <span className="font-mono mr-2">{idx + 1}.</span>
                  {t.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
