import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

type LinkButtonProps = {
  href: string
  label: string
  sublabel?: string
  icon: ReactNode
}

export function LinkButton({ href, label, sublabel, icon }: LinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card/40 px-5 py-4 backdrop-blur-md transition-all duration-300 hover:border-primary/70 hover:bg-card/70 hover:shadow-[0_0_28px_-4px_oklch(0.62_0.24_300/0.55)]"
    >
      {/* sweep glow on hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,oklch(0.62_0.24_300/0.18),transparent)] transition-transform duration-700 group-hover:translate-x-full" />

      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/60 text-primary transition-colors duration-300 group-hover:border-primary/60 group-hover:text-accent">
        {icon}
      </span>

      <span className="flex min-w-0 flex-col text-left">
        <span className="font-display text-base font-bold tracking-wide text-foreground">
          {label}
        </span>
        {sublabel ? (
          <span className="truncate text-xs text-muted-foreground">{sublabel}</span>
        ) : null}
      </span>

      <ArrowUpRight className="ml-auto size-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
    </a>
  )
}
