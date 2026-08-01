import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Cinzel } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-cinzel',
})

export const metadata: Metadata = {
  title: 'Ethan Hermann · dev',
  description:
    'Desenvolvedor. ScreenShare Coordinator. Onde os cheats encontram seu fim.',
  icons: {
    icon: '/favicon.png',
  },
  other: {
    google: 'notranslate',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#160a24',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      translate="no"
      className={`notranslate dark bg-background ${geistSans.variable} ${cinzel.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
