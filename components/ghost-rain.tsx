"use client"

import { useEffect, useState } from "react"

type Drop = {
  left: number
  size: number
  delay: number
  duration: number
  drift: number
  opacity: number
}

/**
 * Mini "ghosts" (the hooded head from the logo) falling slowly like rain.
 * The asset sits on a solid black background, so `mix-blend-screen` makes the
 * black disappear and only the glowing purple head shows.
 *
 * Drops are generated only on the client (after mount) so the randomized
 * values don't cause a server/client hydration mismatch.
 */
export function GhostRain({ count = 22 }: { count?: number }) {
  const [drops, setDrops] = useState<Drop[]>([])

  useEffect(() => {
    setDrops(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 14 + Math.random() * 20, // really small: 14–34px
        delay: Math.random() * 12,
        duration: 9 + Math.random() * 10, // slow fall
        drift: (Math.random() - 0.5) * 80,
        opacity: 0.35 + Math.random() * 0.4,
      })),
    )
  }, [count])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {drops.map((d, i) => (
        <img
          key={i}
          src="/ghost-head.png"
          alt=""
          className="absolute top-0 select-none mix-blend-screen"
          style={{
            left: `${d.left}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            opacity: d.opacity,
            animation: `fall ${d.duration}s linear ${d.delay}s infinite`,
            ["--drift" as string]: `${d.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
