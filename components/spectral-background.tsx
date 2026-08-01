'use client'

// Caracteres hacker para matrix rain
const HACKER_CHARS = ['0', '1', 'A', 'B', 'C', 'D', 'E', 'F', 'x', '>', '<', '/', '\\', '|', '!', '@', '#', '$', '%', '^', '&', '*', '+', '-', '=', '?', '~', '`', '(', ')', '[', ']', '{', '}']

// Gera muitos caracteres caindo de forma densa
const FALLING_MATRIX = Array.from({ length: 50 }).map((_, i) => ({
  char: HACKER_CHARS[Math.floor(Math.random() * HACKER_CHARS.length)],
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 8 + Math.random() * 6,
  drift: (Math.random() - 0.5) * 40,
}))

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

      {/* Matrix rain — caracteres hacker caindo em densidade alta */}
      {FALLING_MATRIX.map((m, i) => (
        <span
          key={i}
          className="absolute top-0 font-mono font-bold text-primary/50 select-none"
          style={{
            left: `${m.left}%`,
            fontSize: '13px',
            lineHeight: '1',
            animation: `fall ${m.duration}s linear ${m.delay}s infinite`,
            ['--drift' as string]: `${m.drift}px`,
          }}
        >
          {m.char}
        </span>
      ))}
    </div>
  )
}
