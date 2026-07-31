import Image from 'next/image'
import { Terminal, ShieldCheck, Eye } from 'lucide-react'
import { SpectralBackground } from '@/components/spectral-background'
import { LinkButton } from '@/components/link-button'
import { EntryGate } from '@/components/entry-gate'
import { ViewCounter } from '@/components/view-counter'
import { FitToScreen } from '@/components/fit-to-screen'
import { MusicPlayer } from '@/components/music-player'
import { InstagramIcon, DiscordIcon, FiveMIcon } from '@/components/brand-icons'

// ─── Configuração do perfil ───────────────────────────────────────
const PROFILE = {
  name: 'Ethan Hermann',
  handle: '@itanbenevidess',
  role: 'dev',
  bio: 'Coor. ScreenShare · Analista Administrativo',
}

const LINKS = [
  {
    label: 'Instagram',
    sublabel: 'instagram.com/itanbenevides',
    href: 'https://instagram.com/itanbenevides',
    icon: <InstagramIcon className="size-5" />,
  },
  {
    label: 'Discord',
    sublabel: 'Ethan Hermann · SS',
    href: 'https://discord.com/users/369812409768083466',
    icon: <DiscordIcon className="size-5" />,
  },
]

const TAGS = [
  { icon: Terminal, label: 'Dev' },
  { icon: Eye, label: 'ScreenShare' },
  { icon: ShieldCheck, label: 'Admin' },
  { icon: FiveMIcon, label: 'FiveM' },
]
// ─────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main className="scanlines relative h-dvh overflow-hidden">
      <SpectralBackground />
      <EntryGate />

      <FitToScreen>
        <section className="flex w-full flex-col items-center gap-0">

          {/* ── Topo — prompt de terminal ───────────────────────── */}
          <div className="mb-3 flex w-full items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <span className="text-primary">❯</span>
            <span className="text-foreground/50">whoami</span>
            <span className="animate-[blink-cursor_1s_step-end_infinite] ml-0.5 inline-block w-[5px] h-[10px] bg-primary/70" aria-hidden="true" />
          </div>

          {/* ── Avatar ──────────────────────────────────────────── */}
          <div className="animate-float-slow relative">
            <div
              className="absolute -inset-3 rounded-full blur-2xl"
              style={{ background: 'oklch(0.65 0.26 295 / 0.35)' }}
              aria-hidden="true"
            />
            <div className="relative size-28 overflow-hidden rounded-full border border-primary/60 shadow-[0_0_32px_-4px_oklch(0.65_0.26_295/0.75)]">
              <Image
                src="/avatar-ghost.gif"
                alt="Avatar do Ethan — espectro encapuzado com olhos brilhantes"
                fill
                priority
                unoptimized
                className="object-cover object-[50%_32%]"
              />
            </div>
            {/* Online badge */}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex cursor-default items-center gap-1 rounded-full border border-primary/80 bg-primary/25 px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest text-primary shadow-[0_0_12px_oklch(0.65_0.26_295/0.6)] backdrop-blur whitespace-nowrap">
              <span className="animate-pulse size-1.5 rounded-full bg-primary" />
              ONLINE
            </span>
          </div>

          {/* ── Nome + handle ────────────────────────────────────── */}
          <div className="mt-5 flex flex-col items-center text-center">
            <div className="flex items-baseline gap-2">
              <h1 className="animate-[glitch_6s_steps(1)_infinite] font-display text-3xl font-extrabold tracking-widest text-foreground text-balance hover:text-primary transition-colors duration-300 hover:[text-shadow:0_0_20px_oklch(0.65_0.26_295/0.85)]">
                {PROFILE.name}
              </h1>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary border border-primary/50 rounded px-1.5 py-0.5 bg-primary/10">
                {PROFILE.role}
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground tracking-wide">
              {PROFILE.handle}
            </p>
            <p className="mt-1.5 text-[13px] text-foreground/70">
              {PROFILE.bio}
            </p>
          </div>

          {/* ── Tags de cargo ───────────────────────────────────── */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {TAGS.map((t) => (
              <span
                key={t.label}
                translate="no"
                className="notranslate flex shrink-0 cursor-default items-center gap-1 whitespace-nowrap rounded-md border border-border bg-card/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur transition-colors duration-200 hover:border-primary/50 hover:text-primary"
              >
                <t.icon className="size-3 shrink-0 text-primary/80" />
                {t.label}
              </span>
            ))}
          </div>

          {/* ── Divisor com código ───────────────────────────────── */}
          <div className="mt-4 flex w-full items-center gap-2 text-muted-foreground/40">
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[9px] tracking-widest uppercase">links</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* ── Links ───────────────────────────────────────────── */}
          <nav className="mt-3 flex w-full flex-col gap-2.5" aria-label="Meus links">
            {LINKS.map((link) => (
              <LinkButton key={link.label} {...link} />
            ))}
          </nav>

          {/* ── Player de música ────────────────────────────────── */}
          <div className="mt-4 w-full">
            <MusicPlayer />
          </div>

          {/* ── Footer ──────────────────────────────────────────── */}
          <footer className="mt-4 flex w-full flex-col items-center gap-3">
            <ViewCounter />

            {/* Social icons */}
            <div className="flex items-center gap-4 text-muted-foreground">
              <a
                href="https://instagram.com/itanbenevides"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-colors hover:text-primary"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href="https://discord.com/users/369812409768083466"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="transition-colors hover:text-primary"
              >
                <DiscordIcon className="size-4" />
              </a>
            </div>

            {/* Frase bíblica */}
            <blockquote className="group/verse w-full cursor-default text-center">
              <p className="font-display text-[12px] italic leading-relaxed text-foreground/60 transition-all duration-300 group-hover/verse:text-primary/80 group-hover/verse:[text-shadow:0_0_14px_oklch(0.65_0.26_295/0.6)] text-pretty">
                {'"Pai, perdoa-lhes, pois não sabem o que fazem."'}
              </p>
              <cite className="mt-0.5 block font-mono text-[9px] not-italic tracking-widest text-muted-foreground/60 transition-colors duration-300 group-hover/verse:text-primary/60">
                LUCAS 23:34
              </cite>
            </blockquote>

            {/* Copyright */}
            <p className="font-mono text-[9px] tracking-widest text-muted-foreground/40">
              © 2022 · Ethan Hermann
            </p>
          </footer>
        </section>
      </FitToScreen>
    </main>
  )
}
