// Matrix hacker rain na tela inicial (entry gate)
// Mesmo efeito denso de caracteres caindo do SpectralBackground

const HACKER_CHARS = ['0', '1', 'A', 'B', 'C', 'D', 'E', 'F', 'x', '>', '<', '/', '\\', '|', '!', '@', '#', '$', '%', '^', '&', '*', '+', '-', '=']

const FALLING_CHARS = Array.from({ length: 50 }).map((_, i) => ({
  char: HACKER_CHARS[i % HACKER_CHARS.length],
  left: (i * 2) % 100,
  delay: (i * 0.15),
  duration: 11 + Math.random() * 5,
  drift: (Math.random() - 0.5) * 35,
}))

export function GhostRain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {FALLING_CHARS.map((c, i) => (
        <span
          key={i}
          className="absolute top-0 font-mono font-bold text-primary/50 select-none"
          style={{
            left: `${c.left}%`,
            fontSize: '12px',
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
