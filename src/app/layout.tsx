import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/contexts/theme-context';
import './globals.css';

/** Inline: set data-theme before paint to avoid flash (must match STORAGE_KEY + logic in theme-context). */
const themeInitScript = `!function(){try{var k='stele-theme',t=localStorage.getItem(k),r=document.documentElement;if(t==='light'||t==='dark'){r.setAttribute('data-theme',t);r.style.colorScheme=t;}else if(matchMedia('(prefers-color-scheme: dark)').matches){r.setAttribute('data-theme','dark');r.style.colorScheme='dark';}else{r.setAttribute('data-theme','light');r.style.colorScheme='light';}}catch(e){}}();`;

// ─── Fonts (self-hosted by Next.js, no external requests at runtime) ──
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// ─── SEO Metadata ────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Stèle',
    template: '%s | Stèle',
  },
  description:
    'A minimal, macOS-inspired cryptography tool designed specifically for the visual Stelegraphy cipher. Runs entirely in your browser.',
  keywords: [
    'cryptography',
    'cipher',
    'encoder',
    'decoder',
    'stelegraphy',
    'ancient runes cipher',
  ],
  authors: [{ name: 'Stèle' }],
  creator: 'Stèle',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Stèle',
    description:
      'A minimal, macOS-inspired cryptography tool designed specifically for the visual Stelegraphy cipher.',
    siteName: 'Stèle',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stèle',
    description:
      'A minimal, macOS-inspired cryptography tool designed specifically for the visual Stelegraphy cipher.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1C1C1E' },
    { media: '(prefers-color-scheme: light)', color: '#F6F6F4' },
  ],
  width: 'device-width',
  initialScale: 1,
};

// ─── Root Layout ─────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
