# Architecture Document

**Product:** Stèlegraphy
**Version:** 0.1.0
**Last Updated:** April 2026

---

## 1. Technology Stack

| Layer | Technology | Version | Role |
|---|---|---|---|
| Framework | Next.js | 16.2.4 | App Router, SSR/SSG, routing |
| Runtime | React | 19.2.4 | Component model and state |
| Language | TypeScript | ^5 | Static typing, strict mode |
| Compiler | Turbopack | (bundled with Next.js) | Fast HMR in development |
| Styling | Vanilla CSS + CSS Variables | — | Design system tokens, layout |
| Fonts | Google Fonts via `next/font` | — | Inter (sans), JetBrains Mono |
| Deployment | Vercel | — | Edge CDN, CI/CD |
| Linting | ESLint + `eslint-config-next` | ^9 / 16.2.4 | Code quality enforcement |

---

## 2. Architecture Overview

Stèlegraphy is a **fully static, client-rendered single-page application (SPA)**. Next.js is used as the framework but the application has no server-side data fetching, no API routes, and no database. It is deployed as a static export served from Vercel's Edge CDN.

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
│                                                          │
│  ┌──────────┐    ┌────────────────────────────────────┐  │
│  │ Next.js  │    │         React Component Tree       │  │
│  │  Router  │───▶│  layout.tsx → page.tsx             │  │
│  └──────────┘    │    └── CryptoApp (state owner)     │  │
│                  │         ├── Titlebar                │  │
│                  │         ├── Sidebar                 │  │
│                  │         ├── ModeToggle              │  │
│                  │         ├── ParamsBar               │  │
│                  │         └── IOGrid                  │  │
│                  │              ├── IOPane (input)     │  │
│                  │              ├── SwapButton         │  │
│                  │              └── IOPane (output)    │  │
│                  └────────────────────────────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                    Core Library                     │ │
│  │   crypto.ts ← process.ts ← CryptoApp               │ │
│  │   ciphers.ts (registry)                             │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │             Web APIs (no network required)          │ │
│  │   encodeURIComponent / decodeURIComponent           │ │
│  │   btoa / atob                                       │ │
│  │   localStorage                                      │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # HTML shell, fonts, metadata, theme init script
│   ├── page.tsx            # Single route — renders <CryptoApp />
│   └── globals.css         # CSS design system (tokens, layout, components)
├── components/             # Presentational and interactive UI components
│   ├── CryptoApp.tsx       # Single state owner for the entire application
│   ├── Titlebar.tsx        # macOS window chrome bar
│   ├── Sidebar.tsx         # Cipher list / navigation
│   ├── ModeToggle.tsx      # Encrypt ↔ Decrypt segmented control
│   ├── ParamsBar.tsx       # Master Key input
│   ├── IOGrid.tsx          # Side-by-side input/output panel layout
│   ├── IOPane.tsx          # Reusable single I/O panel (textarea + copy button)
│   ├── SwapButton.tsx      # Swap action between input and output
│   └── ThemeToggle.tsx     # Light / Dark theme switch
├── contexts/
│   └── theme-context.tsx   # React Context for theme state + localStorage sync
├── lib/
│   ├── crypto.ts           # Stèlegraphy cipher engine (encrypt/decrypt)
│   ├── ciphers.ts          # Static registry of available ciphers
│   └── process.ts          # Dispatch layer: routes (id, mode) → crypto fn
└── types/
    └── index.ts            # Shared TypeScript types (CipherId, Mode, CipherDef, ProcessParams)
```

---

## 4. Data Flow

### 4.1 Encryption Flow

```
User types plaintext (input textarea)
        │
        ▼
  CryptoApp.tsx (useState)
  [input, mode='encrypt', key]
        │
        ▼
  process(id='stelegraphy', input, mode, { key })   ← lib/process.ts
        │
        ▼
  stelegraphyEncrypt(text, key)                     ← lib/crypto.ts
        │
  ┌─────────────────────────────────────────┐
  │  Phase 1: encodeURIComponent(plaintext) │
  │  Phase 2: XOR each byte with cyclic key │
  │  Phase 3: btoa() → Base64 string        │
  │  Phase 4: Base64 → Ancient Rune chars   │
  └─────────────────────────────────────────┘
        │
        ▼
  output (Runic ciphertext) rendered in IOPane
```

### 4.2 Decryption Flow

```
User pastes Runic ciphertext + provides key
        │
        ▼
  CryptoApp.tsx (useState)
  [input=runes, mode='decrypt', key]
        │
        ▼
  process(id='stelegraphy', input, 'decrypt', { key })
        │
        ▼
  stelegraphyDecrypt(runes, key)                    ← lib/crypto.ts
        │
  ┌─────────────────────────────────────────┐
  │  Phase 1: Rune → Base64 char mapping    │
  │  Phase 2: atob() → XOR-scrambled bytes  │
  │  Phase 3: XOR unmasking with same key   │
  │  Phase 4: decodeURIComponent()          │
  └─────────────────────────────────────────┘
        │
        ▼
  plaintext rendered in IOPane
```

### 4.3 Theme Initialization Flow

```
Browser loads HTML
        │
        ▼
  Inline <script> runs before paint
  └── Reads localStorage['stele-theme']
  └── Falls back to prefers-color-scheme
  └── Sets data-theme attribute on <html>
        │
        ▼
  CSS variables resolve to correct theme palette
        │
        ▼
  React hydrates — ThemeProvider syncs React state
  with DOM (no FOUC, no flash)
```

---

## 5. Component Architecture

### 5.1 State Ownership

All interactive state is owned by a single component: `CryptoApp.tsx`. Child components receive data via props and communicate upward via callback props. This is intentional to keep the state surface minimal and predictable.

```
CryptoApp (state owner)
├── selected: CipherId       // currently active cipher
├── mode: Mode               // 'encrypt' | 'decrypt'
├── input: string            // user text in left panel
└── key: string              // master key value
     │
     └── output: string      // derived — not in state, recomputed each render
```

### 5.2 Server vs. Client Components

| Component | Directive | Reason |
|---|---|---|
| `layout.tsx` | Server (default) | Static metadata, no interactivity |
| `page.tsx` | Server (default) | Thin shell, just renders CryptoApp |
| `CryptoApp.tsx` | `'use client'` | Owns all interactive state |
| `ThemeToggle.tsx` | Inherits client | Renders inside CryptoApp |
| `ModeToggle.tsx` | Inherits client | Event handlers |
| `ParamsBar.tsx` | Inherits client | Controlled input |
| `IOPane.tsx` | Inherits client | Textarea + clipboard API |
| `ThemeProvider` | `'use client'` | Uses `useEffect`, `localStorage` |

### 5.3 Context

A single React Context (`ThemeContext`) provides theme state app-wide without prop drilling.

| Export | Type | Description |
|---|---|---|
| `ThemeProvider` | Component | Wraps the app; manages theme lifecycle |
| `useTheme()` | Hook | Returns `{ theme, setTheme, toggleTheme }` |
| `Theme` | Type | `'light' \| 'dark'` |

---

## 6. CSS Design System

All styles are in `src/app/globals.css`. No CSS-in-JS or utility framework is used.

### 6.1 Token Architecture

CSS Custom Properties are scoped to `[data-theme="light"]` and `[data-theme="dark"]`:

| Variable Group | Examples |
|---|---|
| Background | `--bg-base`, `--bg-surface`, `--bg-elevated` |
| Text | `--text-primary`, `--text-secondary`, `--text-tertiary` |
| Border | `--border`, `--border-subtle` |
| Accent | `--accent`, `--accent-hover` |
| Shadow | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |
| Glassmorphism | `--glass-bg`, `--glass-border` |

### 6.2 Typography

| Variable | Font | Usage |
|---|---|---|
| `--font-sans` | Inter | All UI text |
| `--font-mono` | JetBrains Mono | Key input, cipher output |

---

## 7. Security Model

| Threat | Mitigation |
|---|---|
| Data exfiltration | All crypto runs in-browser; zero network requests for user data |
| Clickjacking | `X-Frame-Options: DENY` header |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| XSS | CSP `script-src 'self'`; no third-party scripts |
| Referrer leakage | `Referrer-Policy: strict-origin-when-cross-origin` |
| Device access | `Permissions-Policy` disables camera, microphone, geolocation |

> **Note:** The Stèlegraphy cipher is a custom educational cipher and is **not** cryptographically secure for protecting sensitive real-world data. It is designed for visual and educational impact, not adversarial security.

---

## 8. Infrastructure

```
Developer Machine
      │
      │  git push
      ▼
GitHub Repository (kevinpradith/stelegraphy)
      │
      │  Webhook trigger
      ▼
Vercel CI Pipeline
  ├── npm install
  ├── npm run build   (Next.js → static HTML + JS bundles)
  └── Deploy to Vercel Edge Network (global CDN)
            │
            ▼
    https://stelegraphy.vercel.app
```

No backend services, databases, or runtime servers are involved.
