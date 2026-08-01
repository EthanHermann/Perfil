import type { ReactNode } from 'react'
import { ArrowUpRight, Package } from 'lucide-react'

type LinkButtonProps = {
  href: string
  label: string
  sublabel?: string
  icon?: ReactNode | null
}

export function LinkButton({ href, label, sublabel, icon }: LinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-3.5 overflow-hidden rounded-xl border border-border bg-card/35 px-4 py-3.5 backdrop-blur-md transition-all duration-300 hover:border-primary/60 hover:bg-card/60 hover:shadow-[0_0_24px_-6px_oklch(0.65_0.26_295/0.6)]"
    >
      {/* Sweep glow */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,oklch(0.65_0.26_295/0.12),transparent)] transition-transform duration-600 group-hover:translate-x-full" />

      {/* Linha de destaque topo */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/0 transition-colors duration-300 group-hover:bg-primary/30" />

      {/* Prefixo de terminal */}
      <span className="font-mono text-[10px] text-primary/50 group-hover:text-primary transition-colors duration-300 select-none">
        ~/
      </span>

      {/* Ícone */}
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/50 text-primary transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_12px_-2px_oklch(0.65_0.26_295/0.5)]">
        {icon ?? <Package className="size-5" />}
      </span>

      {/* Textos */}
      <span className="flex min-w-0 flex-col text-left">
        <span className="font-mono text-[13px] font-semibold tracking-wide text-foreground transition-colors duration-300 group-hover:text-primary">
          {label}
        </span>
        {sublabel ? (
          <span className="truncate font-mono text-[10px] text-muted-foreground transition-colors duration-300 group-hover:text-primary/60">
            {sublabel}
          </span>
        ) : null}
      </span>

      <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
    </a>
  )
}
