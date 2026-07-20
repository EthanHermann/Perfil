"use client"

import { useEffect, useRef } from "react"

type Drop = {
  x: number // posição horizontal base (px)
  y: number // posição vertical (px)
  vy: number // velocidade de queda (px/s)
  size: number
  opacity: number
  drift: number // deriva horizontal ao longo da queda (px)
  sway: number // amplitude do balanço lateral (px)
  swayFreq: number // frequência do balanço
  phase: number // fase inicial do balanço
}

/**
 * Mini "fantasmas" (a cabeça encapuzada do logo) caindo como chuva real.
 *
 * Em vez de animações CSS com tempos fixos (que faziam alguns ícones
 * parecerem "presos"), cada gota é animada por requestAnimationFrame com
 * valores aleatórios e reposicionamento contínuo ao sair da tela — então
 * a queda é sempre aleatória e nunca trava. Um multiplicador global de
 * "fluxo" (soma de senoides) acelera e desacelera suavemente a chuva,
 * imitando o embalo da música.
 *
 * O asset fica sobre fundo preto sólido, então `mix-blend-screen` faz o
 * preto sumir e só a cabeça roxa brilhante aparecer.
 */
export function GhostRain({ count = 34 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let w = container.clientWidth || window.innerWidth
    let h = container.clientHeight || window.innerHeight

    const imgs: HTMLImageElement[] = []
    const drops: Drop[] = []

    function resetDrop(d: Drop, fromTop: boolean) {
      d.x = Math.random() * w
      // Ao reciclar, entra por cima em altura aleatória para não criar
      // "ondas" sincronizadas. Na primeira vez, espalha por toda a tela.
      d.y = fromTop ? -40 - Math.random() * h * 0.5 : Math.random() * h
      d.size = 14 + Math.random() * 22 // 14–36px
      // Atravessa a tela em ~2.4s a ~5.6s — sensação de chuva, não flutuação.
      d.vy = (h + 160) / (2.4 + Math.random() * 3.2)
      d.drift = (Math.random() - 0.5) * 34
      d.opacity = 0.32 + Math.random() * 0.46
      d.sway = 4 + Math.random() * 16
      d.swayFreq = 0.4 + Math.random() * 1.0
      d.phase = Math.random() * Math.PI * 2
    }

    for (let i = 0; i < count; i++) {
      const img = document.createElement("img")
      img.src = "/ghost-head.png"
      img.alt = ""
      img.decoding = "async"
      img.className = "select-none mix-blend-screen"
      img.style.position = "absolute"
      img.style.left = "0"
      img.style.top = "0"
      img.style.willChange = "transform"
      img.style.pointerEvents = "none"

      const d: Drop = {
        x: 0,
        y: 0,
        vy: 0,
        size: 0,
        opacity: 0,
        drift: 0,
        sway: 0,
        swayFreq: 0,
        phase: 0,
      }
      resetDrop(d, false)
      img.style.width = `${d.size}px`
      img.style.height = `${d.size}px`
      img.style.opacity = String(d.opacity)
      container.appendChild(img)
      imgs.push(img)
      drops.push(d)
    }

    let raf = 0
    const start = performance.now()
    let last = start

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = (now - start) / 1000
      // "Fluxo" da música: oscila suavemente entre ~0.8x e ~1.35x.
      const flow = 1.05 + 0.22 * Math.sin(t * 0.8) + 0.08 * Math.sin(t * 2.3)

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]
        d.y += d.vy * flow * dt
        if (d.y > h + 60) {
          resetDrop(d, true)
          const el = imgs[i]
          el.style.width = `${d.size}px`
          el.style.height = `${d.size}px`
          el.style.opacity = String(d.opacity)
        }
        const progress = h > 0 ? d.y / h : 0
        const swayX = Math.sin(t * d.swayFreq + d.phase) * d.sway
        const drawX = d.x + d.drift * progress + swayX
        imgs[i].style.transform = `translate3d(${drawX}px, ${d.y}px, 0)`
      }
      raf = requestAnimationFrame(frame)
    }

    if (prefersReduced) {
      // Sem animação: apenas posiciona as gotas estaticamente.
      drops.forEach((d, i) => {
        imgs[i].style.transform = `translate3d(${d.x}px, ${d.y}px, 0)`
      })
    } else {
      raf = requestAnimationFrame(frame)
    }

    const onResize = () => {
      w = container.clientWidth || window.innerWidth
      h = container.clientHeight || window.innerHeight
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      imgs.forEach((img) => img.remove())
    }
  }, [count])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    />
  )
}
