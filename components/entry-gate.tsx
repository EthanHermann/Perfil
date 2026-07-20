"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import useSWR from "swr"
import { Eye } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function EntryGate() {
  const [entered, setEntered] = useState(false)
  const [removed, setRemoved] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const countedRef = useRef(false)

  // Real-time view counter: increment once on mount, then poll.
  const { data, mutate } = useSWR<{ count: number }>("/api/views", fetcher, {
    refreshInterval: 5000,
  })

  useEffect(() => {
    if (countedRef.current) return
    countedRef.current = true
    fetch("/api/views", { method: "POST" })
      .then((r) => r.json())
      .then((d) => mutate(d, { revalidate: false }))
      .catch(() => {})
  }, [mutate])

  // Lock scroll while the gate is visible.
  useEffect(() => {
    if (removed) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [removed])

  function handleEnter() {
    if (entered) return
    setEntered(true)
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = 0
      audio.volume = 0.7
      audio.play().catch(() => {})
    }
    // Fade out, then remove from DOM so the site becomes interactive.
    window.setTimeout(() => setRemoved(true), 900)
  }

  if (removed) {
    return <audio ref={audioRef} src="/enter-sound.mp3" preload="auto" />
  }

  const views = data?.count ?? null

  return (
    <div
      className={`fixed inset-0 z-50 flex h-dvh w-screen flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${
        entered ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <audio ref={audioRef} src="/enter-sound.mp3" preload="auto" />

      {/* Purple-toned blur layer over the hidden content */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,oklch(0.62_0.24_300/0.4),transparent_60%)]" />

      {/* Centered image button */}
      <button
        type="button"
        onClick={handleEnter}
        aria-label="Entrar no perfil"
        className="group relative z-10 flex flex-col items-center focus:outline-none"
      >
        <span className="absolute -inset-6 rounded-full bg-primary/30 blur-2xl transition-all duration-500 group-hover:bg-primary/50" />
        <span className="animate-pulse-glow relative inline-flex items-center justify-center rounded-full ring-2 ring-primary/60 shadow-[0_0_40px_-6px_oklch(0.62_0.24_300/0.9)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
          <Image
            src="/enter-button.png"
            alt="Clique para entrar"
            width={168}
            height={168}
            priority
            className="size-36 rounded-full object-cover sm:size-44"
          />
        </span>
        <span className="mt-6 font-display text-lg font-semibold uppercase tracking-[0.35em] text-foreground/90">
          Clique para entrar
        </span>
      </button>

      {/* Minimalist, elegant view counter */}
      <div className="absolute bottom-8 z-10 flex items-center gap-2 rounded-full border border-primary/40 bg-background/40 px-4 py-1.5 backdrop-blur-md">
        <Eye className="size-4 text-primary" aria-hidden="true" />
        <span className="text-sm font-medium tabular-nums tracking-wide text-foreground/90">
          {views === null ? "—" : views.toLocaleString("pt-BR")}
        </span>
        <span className="text-xs text-muted-foreground">visualizações</span>
      </div>
    </div>
  )
}
