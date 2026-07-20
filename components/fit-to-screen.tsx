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
      const next = Math.min(1, availH / neededH, availW / neededW)
      setScale((prev) => (Math.abs(prev - next) > 0.005 ? next : prev))
    }

    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(inner)
    ro.observe(outer)
    window.addEventListener("resize", compute)
    window.addEventListener("orientationchange", compute)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", compute)
      window.removeEventListener("orientationchange", compute)
    }
  }, [])

  return (
    <div
      ref={outerRef}
      className="relative z-10 flex h-dvh w-full items-center justify-center overflow-hidden px-4 py-4"
    >
      <div
        ref={innerRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
        className="flex w-full max-w-md flex-col items-center"
      >
        {children}
      </div>
    </div>
  )
}
