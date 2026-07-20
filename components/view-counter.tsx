"use client"

import { useEffect, useRef } from "react"
import useSWR from "swr"
import { Eye } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/**
 * Real-time page view counter. Increments once on mount, then polls.
 * Rendered on the profile so it is only visible after the user enters.
 */
export function ViewCounter() {
  const countedRef = useRef(false)
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

  const views = data?.count ?? null

  return (
    <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-background/40 px-4 py-1.5 backdrop-blur-md shadow-[0_0_18px_-6px_oklch(0.62_0.24_300/0.8)]">
      <Eye className="size-4 text-primary" aria-hidden="true" />
      <span className="text-sm font-medium tabular-nums tracking-wide text-foreground/90">
        {views === null ? "—" : views.toLocaleString("pt-BR")}
      </span>
      <span className="text-xs text-muted-foreground">visualizações</span>
    </div>
  )
}
