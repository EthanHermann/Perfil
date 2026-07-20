import Image from 'next/image'
import { Eye, ShieldCheck } from 'lucide-react'
import { SpectralBackground } from '@/components/spectral-background'
import { LinkButton } from '@/components/link-button'
import { EntryGate } from '@/components/entry-gate'
import { ViewCounter } from '@/components/view-counter'
import { FitToScreen } from '@/components/fit-to-screen'
import { InstagramIcon, DiscordIcon, FiveMIcon } from '@/components/brand-icons'

// ─── Fácil de editar ──────────────────────────────────────────────
const PROFILE = {
  name: 'Ethan',
  nickname: 'Final Boss',
  username: '@itanbenevidess',
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

const ROLES = [
  { icon: Eye, label: 'ScreenShare' },
  { icon: ShieldCheck, label: 'Analista Administrativo' },
  { icon: FiveMIcon, label: 'FiveM' },
]
// ──────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main className="relative h-dvh overflow-hidden">
      <SpectralBackground />
      <EntryGate />

      <FitToScreen>
        <section className="flex w-full flex-col items-center">
        {/* Avatar */}
        <div className="animate-float-slow relative">
          <div className="absolute -inset-2 rounded-full bg-primary/40 blur-xl" aria-hidden="true" />
          <div className="relative size-32 overflow-hidden rounded-full border-2 border-primary/70 shadow-[0_0_35px_-2px_oklch(0.62_0.24_300/0.7)]">
            <Image
              src="/avatar-ghost.gif"
              alt="Avatar do Ethan — um espectro encapuzado com olhos brilhantes"
              fill
              priority
              unoptimized
              className="object-cover object-[50%_32%]"
            />
          </div>
          {/* status online */}
          <span className="animate-pulse-glow absolute bottom-1 right-1 flex items-center gap-1 rounded-full border border-primary bg-primary/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary shadow-[0_0_14px_2px_oklch(0.62_0.24_300/0.95)] backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_6px_2px_oklch(0.62_0.24_300/0.95)]" />
            ONLINE
          </span>
        </div>

        {/* Nome + apelido */}
        <div className="mt-4 flex flex-col items-center text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-widest text-foreground text-balance">
            {PROFILE.name}
          </h1>
          <span className="mt-2 rounded-full border border-primary/70 bg-primary/25 px-3 py-1 font-display text-sm font-semibold tracking-wide text-white shadow-[0_0_18px_-4px_oklch(0.62_0.24_300/0.8)]">
            {PROFILE.nickname}
          </span>
          <p className="mt-3 text-sm font-medium text-foreground">{PROFILE.bio}</p>
        </div>

        {/* Roles — sempre os três alinhados na mesma linha */}
        <div className="mt-4 flex w-full flex-nowrap items-center justify-center gap-1.5">
          {ROLES.map((r) => (
            <span
              key={r.label}
              translate="no"
              className="notranslate group flex shrink-0 cursor-default items-center gap-1 whitespace-nowrap rounded-full border border-border bg-card/40 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur transition-colors duration-300 hover:border-primary/60 hover:text-primary"
            >
              <r.icon className="size-3.5 shrink-0 text-primary" />
              {r.label}
            </span>
          ))}
        </div>

        {/* Links */}
        <nav className="mt-6 flex w-full flex-col gap-3" aria-label="Meus links">
          {LINKS.map((link) => (
            <LinkButton key={link.label} {...link} />
          ))}
        </nav>

        {/* Footer — mt igual ao gap para centralizar o contador entre os Discord */}
        <footer className="mt-4 flex flex-col items-center gap-4">
          <ViewCounter />

          <div className="flex items-center gap-4 text-muted-foreground">
            <a
              href="https://instagram.com/itanbenevides"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-primary"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href="https://discord.com/users/369812409768083466"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="transition-colors hover:text-primary"
            >
              <DiscordIcon className="size-5" />
            </a>
          </div>

          <blockquote className="w-full text-center">
            <p className="text-pretty font-display text-[13px] italic leading-relaxed text-foreground/80 sm:text-sm">
              {'"Pai, perdoa-lhes, pois não sabem o que fazem."'}
            </p>
            <cite className="mt-1 block text-[11px] not-italic tracking-widest text-muted-foreground">
              LUCAS 23:34
            </cite>
          </blockquote>

          <p className="text-[10px] tracking-widest text-muted-foreground/60">
            © 2022 · Ethan Hermann
          </p>
        </footer>
        </section>
      </FitToScreen>
    </main>
  )
}
