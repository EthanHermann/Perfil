"use client"

import { useEffect, useState } from "react"

const BASE_COUNT = 1027
const STORAGE_KEY = "profile-view-count"

/**
 * Vanity view counter. Starts at 1027 and increments automatically over time.
 * The current value is persisted in localStorage so it keeps growing between
 * visits instead of resetting. Shows only the number (no label, no icon).
 */
export function ViewCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let current = BASE_COUNT
    try {
      const stored = Number(window.localStorage.getItem(STORAGE_KEY))
      if (Number.isFinite(stored) && stored >= BASE_COUNT) {
        current = stored
      }
    } catch {
      // ignore storage errors
    }

    // Count this visit immediately.
    current += 1
    setCount(current)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(current))
    } catch {}

    // Then keep incrementing automatically while the page is open.
    const interval = window.setInterval(() => {
      current += Math.floor(Math.random() * 2) + 1 // +1 or +2
      setCount(current)
      try {
        window.localStorage.setItem(STORAGE_KEY, String(current))
      } catch {}
    }, 8000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div
      translate="no"
      className="notranslate flex items-center justify-center rounded-full border border-primary/40 bg-background/40 px-4 py-1.5 backdrop-blur-md shadow-[0_0_18px_-6px_oklch(0.62_0.24_300/0.8)]"
    >
      <span className="text-sm font-medium tabular-nums tracking-wide text-foreground/90">
        {count === null ? "—" : count.toLocaleString("pt-BR")}
      </span>
    </div>
  )
}
