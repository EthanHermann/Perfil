// Partículas determinísticas — sem mismatch de hidratação.
const PARTICLES = [
  { left: 5,  delay: 0,   duration: 11, size: 2, drift:  18 },
  { left: 12, delay: 2.5, duration: 14, size: 1, drift: -22 },
  { left: 21, delay: 5,   duration: 9,  size: 2, drift:  12 },
  { left: 30, delay: 1,   duration: 13, size: 1, drift: -16 },
  { left: 39, delay: 4,   duration: 10, size: 2, drift:  24 },
  { left: 48, delay: 7,   duration: 12, size: 1, drift: -10 },
  { left: 57, delay: 2,   duration: 15, size: 2, drift:  20 },
  { left: 66, delay: 0.5, duration: 10, size: 1, drift: -28 },
  { left: 74, delay: 6,   duration: 13, size: 2, drift:  16 },
  { left: 83, delay: 3.5, duration: 11, size: 1, drift: -14 },
  { left: 91, delay: 8,   duration: 14, size: 2, drift:  22 },
  { left: 96, delay: 1.8, duration: 9,  size: 1, drift: -18 },
]

// Texto de código flutuando ao fundo (estilo matrix sutil)
const CODE_SNIPPETS = [
  { text: 'const',  left: 8,  top: 15, opacity: 0.06 },
  { text: '() =>',  left: 72, top: 22, opacity: 0.05 },
  { text: '{}',     left: 18, top: 55, opacity: 0.07 },
  { text: '0x4F',   left: 85, top: 40, opacity: 0.06 },
  { text: 'while',  left: 40, top: 75, opacity: 0.05 },
  { text: 'async',  left: 60, top: 10, opacity: 0.06 },
  { text: 'null',   left: 28, top: 88, opacity: 0.05 },
  { text: '=>',     left: 92, top: 68, opacity: 0.07 },
]

export function SpectralBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient wash — dark void com toque roxo */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_80%_at_50%_-5%,oklch(0.22_0.1_295)_0%,transparent_55%)]" />

      {/* Glow central suave */}
      <div
        className="animate-pulse-glow absolute left-1/2 top-28 h-64 w-64 -translate-x-1/2 rounded-full blur-[100px]"
        style={{ background: 'oklch(0.65 0.26 295 / 0.2)' }}
      />
      <div
        className="animate-pulse-glow absolute bottom-12 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full blur-[110px]"
        style={{ background: 'oklch(0.72 0.22 310 / 0.14)', animationDelay: '1.8s' }}
      />

      {/* Grid sutil ao fundo */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.65 0.26 295) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.65 0.26 295) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Snippets de código ao fundo */}
      {CODE_SNIPPETS.map((s, i) => (
        <span
          key={i}
          className="absolute font-mono text-[11px] text-primary select-none"
          style={{ left: `${s.left}%`, top: `${s.top}%`, opacity: s.opacity }}
        >
          {s.text}
        </span>
      ))}

      {/* Partículas caindo */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: 'oklch(0.72 0.22 310 / 0.65)',
            boxShadow: '0 0 6px 1px oklch(0.65 0.26 295 / 0.5)',
            animation: `fall ${p.duration}s linear ${p.delay}s infinite`,
            ['--drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
