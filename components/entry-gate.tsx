"use client"

import { useEffect, useRef, useState } from "react"
import { GhostRain } from "@/components/ghost-rain"

export function EntryGate() {
  const [entered, setEntered] = useState(false)
  const [removed, setRemoved] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // A single, persistent <audio> element lives for the whole lifetime of this
  // component (see the render below). We try to start it as soon as the site
  // opens; browsers usually block autoplay with sound, so we also (re)start it
  // on any user interaction. Because the element is never unmounted, playback
  // is not interrupted when the entry gate is removed from the DOM.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.7

    const tryPlay = () => {
      audio.play().catch(() => {})
    }

    // Attempt immediate autoplay (works when the browser allows it).
    tryPlay()

    // Fallback: resume on the very first user gesture and keep listening in
    // case the browser pauses it. These are cheap no-ops while already playing.
    window.addEventListener("pointerdown", tryPlay)
    window.addEventListener("keydown", tryPlay)
    window.addEventListener("touchstart", tryPlay)

    return () => {
      window.removeEventListener("pointerdown", tryPlay)
      window.removeEventListener("keydown", tryPlay)
      window.removeEventListener("touchstart", tryPlay)
    }
  }, [])

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
    // The click is a valid user gesture, so this reliably starts the music.
    audioRef.current?.play().catch(() => {})
    // Fade out, then remove the overlay from the DOM. The <audio> element is
    // rendered outside the overlay, so it keeps playing.
    window.setTimeout(() => setRemoved(true), 900)
  }

  return (
    <>
      {/* Persistent audio — never unmounted, so the music never gets cut off. */}
      <audio ref={audioRef} src="/enter-sound.mp3" preload="auto" loop />

      {!removed && (
        <button
          type="button"
          onClick={handleEnter}
          aria-label="Entrar no perfil"
          className={`fixed inset-0 z-50 flex h-dvh w-screen cursor-pointer items-center justify-center overflow-hidden focus:outline-none transition-opacity duration-700 ${
            entered ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          {/* Dark purple background + full-screen blur over the hidden content */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-[oklch(0.16_0.06_300/0.75)]" />
          {/* Soft ambient purple glows (not a hard circle) */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_40%,oklch(0.4_0.2_300/0.55),transparent_70%)]" />
          <div className="absolute -inset-10 bg-[radial-gradient(60%_50%_at_50%_50%,oklch(0.62_0.24_300/0.28),transparent_75%)] blur-3xl" />

          {/* Falling mini ghosts */}
          <GhostRain />

          {/* Just the logo — no circle, no text — blended in and glowing */}
          <span className="group relative z-10 inline-flex items-center justify-center">
            {/* soft glow that follows the logo, not a circle ring */}
            <img
              src="/enter-button.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full scale-125 opacity-40 blur-3xl"
            />
            <img
              src="/enter-button.png"
              alt="Logo do perfil"
              className="animate-float-slow relative w-40 max-w-[52vw] object-contain mix-blend-screen drop-shadow-[0_0_30px_oklch(0.62_0.24_300/0.7)] transition-transform duration-500 group-hover:scale-105 sm:w-52"
            />
          </span>
        </button>
      )}
    </>
  )
}
