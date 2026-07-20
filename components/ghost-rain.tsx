// Chuva de partículas da tela inicial.
//
// Antes usávamos dezenas de imagens com `mix-blend-screen` por cima de um
// `backdrop-blur-2xl` — a composição pesava e a queda "travava". Agora usamos
// as MESMAS partículas CSS leves da tela principal (SpectralBackground), que
// são fluidas, só que com mais bolinhas caindo e no mesmo tom de roxo.
//
// Valores determinísticos para o markup do servidor bater com o do cliente
// (sem hydration mismatch). A animação `fall` e a variável `--drift` vêm do
// globals.css, exatamente como as "embers" da tela principal.

type Particle = {
  left: number
  delay: number
  duration: number
  size: number
  drift: number
}

// ~26 partículas: um pouco mais densa que a tela principal (11), mantendo as
// mesmas faixas de velocidade/duração para preservar a sensação da chuva.
const PARTICLES: Particle[] = [
  { left: 4, delay: 0, duration: 9, size: 3, drift: 20 },
  { left: 9, delay: 3, duration: 12, size: 2, drift: -30 },
  { left: 15, delay: 6, duration: 10, size: 4, drift: 15 },
  { left: 20, delay: 1.5, duration: 13, size: 2, drift: -20 },
  { left: 26, delay: 4.5, duration: 8, size: 3, drift: 25 },
  { left: 31, delay: 2, duration: 11, size: 2, drift: -15 },
  { left: 37, delay: 7, duration: 14, size: 4, drift: 30 },
  { left: 42, delay: 0.8, duration: 9.5, size: 3, drift: -25 },
  { left: 48, delay: 5, duration: 12.5, size: 2, drift: 18 },
  { left: 53, delay: 3.6, duration: 10.5, size: 3, drift: -18 },
  { left: 58, delay: 6.4, duration: 13.5, size: 2, drift: 22 },
  { left: 63, delay: 1.2, duration: 9, size: 4, drift: -28 },
  { left: 68, delay: 4, duration: 11.5, size: 2, drift: 16 },
  { left: 73, delay: 2.6, duration: 8.5, size: 3, drift: -22 },
  { left: 78, delay: 5.6, duration: 13, size: 2, drift: 26 },
  { left: 83, delay: 0.4, duration: 10, size: 3, drift: -16 },
  { left: 88, delay: 3.2, duration: 12, size: 4, drift: 20 },
  { left: 93, delay: 6, duration: 9.5, size: 2, drift: -24 },
  { left: 97, delay: 2.2, duration: 11, size: 3, drift: 14 },
  { left: 12, delay: 5.2, duration: 13, size: 2, drift: -20 },
  { left: 34, delay: 7.4, duration: 10, size: 3, drift: 28 },
  { left: 46, delay: 1.8, duration: 12.5, size: 2, drift: -14 },
  { left: 60, delay: 4.8, duration: 9, size: 4, drift: 22 },
  { left: 71, delay: 6.8, duration: 11.5, size: 2, drift: -26 },
  { left: 85, delay: 0.6, duration: 13.5, size: 3, drift: 18 },
  { left: 91, delay: 3.8, duration: 8.5, size: 2, drift: -18 },
]

export function GhostRain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full bg-primary/80 shadow-[0_0_8px_2px_oklch(0.62_0.24_300/0.65)]"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `fall ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
