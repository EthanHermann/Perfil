// Caracteres hacker caindo (matrix rain)
const HACKER_CHARS = ['0', '1', 'A', 'B', 'C', 'D', 'E', 'F', 'x', '>', '<', '/', '\\', '|', '!', '@', '#', '$', '%', '^', '&', '*', '+', '-', '=']

const FALLING_CHARS = Array.from({ length: 12 }).map((_, i) => ({
  char: HACKER_CHARS[Math.floor(Math.random() * HACKER_CHARS.length)],
  left: (i * 8 + 2) % 100,
  delay: i * 0.8,
  duration: 12 + Math.random() * 4,
  drift: (Math.random() - 0.5) * 30,
}))

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

      {/* Caracteres hacker caindo (matrix rain) */}
      {FALLING_CHARS.map((c, i) => (
        <span
          key={i}
          className="absolute top-0 font-mono font-bold text-primary/60 select-none"
          style={{
            left: `${c.left}%`,
            fontSize: '14px',
            lineHeight: '1',
            animation: `fall ${c.duration}s linear ${c.delay}s infinite`,
            ['--drift' as string]: `${c.drift}px`,
          }}
        >
          {c.char}
        </span>
      ))}
    </div>
  )
}
