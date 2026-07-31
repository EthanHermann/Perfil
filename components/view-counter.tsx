"use client"

import { useEffect, useState } from "react"

// Guarda em nível de módulo: garante que UM carregamento de página só
// incremente o contador uma única vez, mesmo com o double-invoke do
// StrictMode do React em desenvolvimento.
let hasCountedThisLoad = false

/**
 * Contador REAL e global de carregamentos da página.
 * A cada vez que a página é aberta, faz um POST em /api/views que
 * incrementa o valor no banco (Neon) e exibe o total compartilhado
 * entre todos os visitantes. Não há incremento falso/automático.
 */
export function ViewCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        // Se este carregamento já foi contado, apenas lê o valor atual.
        const method = hasCountedThisLoad ? "GET" : "POST"
        hasCountedThisLoad = true

        const res = await fetch("/api/views", { method, cache: "no-store" })
        if (!res.ok) throw new Error("bad response")
        const data = (await res.json()) as { count?: number }
        if (!cancelled) setCount(Number(data.count) || 0)
      } catch {
        if (!cancelled) setCount(null)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      translate="no"
      className="notranslate flex items-center gap-2 rounded-md border border-border bg-card/30 px-3 py-1.5 backdrop-blur-md"
    >
      <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">views</span>
      <span className="font-mono text-xs font-semibold tabular-nums tracking-wide text-primary">
        {count === null ? "···" : count.toLocaleString("pt-BR")}
      </span>
    </div>
  )
}
