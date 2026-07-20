"use client"

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"

// Usa useLayoutEffect no cliente e cai para useEffect no servidor (SSR).
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

/**
 * Envolve o conteúdo e o reduz proporcionalmente (scale) para caber inteiro
 * na altura E largura da viewport. Assim o perfil sempre aparece completo,
 * sem cortar o topo/rodapé e sem gerar barra de rolagem em nenhuma tela.
 */
export function FitToScreen({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [ready, setReady] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const compute = () => {
      // Dimensões naturais do conteúdo (sem o scale aplicado).
      const neededH = inner.offsetHeight
      const neededW = inner.offsetWidth
      const availH = outer.clientHeight
      const availW = outer.clientWidth
      if (neededH === 0 || neededW === 0) return
      // Margem de segurança: nunca deixa o conteúdo encostar nas bordas.
      const SAFETY = 0.94
      const next = Math.min(1, (availH / neededH) * SAFETY, (availW / neededW) * SAFETY)
      setScale((prev) => (Math.abs(prev - next) > 0.004 ? next : prev))
      setReady(true)
    }

    compute()
    // Recalcula após um frame, cobrindo fontes/imagens que mudam de tamanho.
    const raf = requestAnimationFrame(compute)
    const ro = new ResizeObserver(compute)
    ro.observe(inner)
    ro.observe(outer)
    window.addEventListener("resize", compute)
    window.addEventListener("orientationchange", compute)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("resize", compute)
      window.removeEventListener("orientationchange", compute)
    }
  }, [])

  return (
    <div
      ref={outerRef}
      className="relative z-10 flex h-dvh w-full items-center justify-center overflow-hidden px-4 py-3"
    >
      <div
        ref={innerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          visibility: ready ? "visible" : "hidden",
        }}
        className="flex w-full max-w-md flex-col items-center"
      >
        {children}
      </div>
    </div>
  )
}
