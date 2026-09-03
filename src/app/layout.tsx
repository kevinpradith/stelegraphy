import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/contexts/theme-context'
import './globals.css'

/** Inline: set data-theme before paint to avoid flash (must match STORAGE_KEY + logic in theme-context). */
const themeInitScript = `!function(){try{var k='stele-theme',t=localStorage.getItem(k),r=document.documentElement;if(t==='light'||t==='dark'){r.setAttribute('data-theme',t);r.style.colorScheme=t;}else if(matchMedia('(prefers-color-scheme: dark)').matches){r.setAttribute('data-theme','dark');r.style.colorScheme='dark';}else{r.setAttribute('data-theme','light');r.style.colorScheme='light';}}catch(e){}}();`

// ─── Fonts (self-hosted by Next.js, no external requests at runtime) ──
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// ─── Site URL & Base ─────────────────────────────────────────
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://stelegraphy.kevinpradith.my.id'

// ─── SEO Metadata ────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Stèlegraphy — Visual Cipher & Cryptography Tool',
    template: '%s | Stèlegraphy',
  },
  description:
    'A minimal, macOS-inspired cryptography tool designed specifically for the visual Stèlegraphy cipher. Encode and decode ancient rune-like glyphs entirely in your browser.',
  keywords: [
    'cryptography',
    'cipher',
    'encoder',
    'decoder',
    'stelegraphy',
    'ancient runes cipher',
    'visual cipher',
    'steganography',
  ],
  authors: [{ name: 'Kevin Praditiansyah', url: 'https://github.com/kevinpradith' }],
  creator: 'Kevin Praditiansyah',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Stèlegraphy — Visual Cipher & Cryptography Tool',
    description:
      'A minimal, macOS-inspired cryptography tool designed specifically for the visual Stèlegraphy cipher. Encode and decode ancient rune-like glyphs entirely in your browser.',
    siteName: 'Stèlegraphy',
    images: [
      {
        url: '/opengraph/stelegraphy.webp',
        width: 1200,
        height: 630,
        alt: 'Stèlegraphy Preview',
        type: 'image/webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stèlegraphy — Visual Cipher & Cryptography Tool',
    description:
      'A minimal, macOS-inspired cryptography tool designed specifically for the visual Stèlegraphy cipher. Encode and decode ancient rune-like glyphs entirely in your browser.',
    images: ['/opengraph/stelegraphy.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1C1C1E' },
    { media: '(prefers-color-scheme: light)', color: '#F6F6F4' },
  ],
  width: 'device-width',
  initialScale: 1,
}

// ─── Root Layout ─────────────────────────────────────────────
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
