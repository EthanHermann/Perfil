// Deterministic particle values so server and client markup match (no hydration mismatch).
const EMBERS = [
  { left: 6, delay: 0, duration: 9, size: 3, drift: 20 },
  { left: 14, delay: 3, duration: 12, size: 2, drift: -30 },
  { left: 23, delay: 6, duration: 10, size: 4, drift: 15 },
  { left: 32, delay: 1.5, duration: 13, size: 2, drift: -20 },
  { left: 41, delay: 4.5, duration: 8, size: 3, drift: 25 },
  { left: 52, delay: 2, duration: 11, size: 2, drift: -15 },
  { left: 61, delay: 7, duration: 14, size: 4, drift: 30 },
  { left: 69, delay: 0.8, duration: 9.5, size: 3, drift: -25 },
  { left: 78, delay: 5, duration: 12.5, size: 2, drift: 18 },
  { left: 87, delay: 3.6, duration: 10.5, size: 3, drift: -18 },
  { left: 94, delay: 6.4, duration: 13.5, size: 2, drift: 22 },
]

export function SpectralBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,oklch(0.28_0.12_300)_0%,transparent_55%)]" />
      {/* Twin glows */}
      <div className="animate-pulse-glow absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/30 blur-[90px]" />
      <div
        className="animate-pulse-glow absolute bottom-10 left-1/2 h-64 w-80 -translate-x-1/2 rounded-full bg-accent/25 blur-[100px]"
        style={{ animationDelay: '1.5s' }}
      />
      {/* Rising embers */}
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full bg-accent/70 shadow-[0_0_8px_2px_oklch(0.7_0.2_320/0.6)]"
          style={{
            left: `${e.left}%`,
            width: `${e.size}px`,
            height: `${e.size}px`,
            animation: `fall ${e.duration}s linear ${e.delay}s infinite`,
            ['--drift' as string]: `${e.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
