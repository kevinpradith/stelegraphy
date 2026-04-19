# Stèle

A minimal, macOS-inspired cryptography and encoding tool — built with **Next.js 15** and **TypeScript**.

## Features

| Cipher | Category | Notes |
|--------|----------|-------|
| Caesar | Classical | Configurable shift |
| Vigenère | Classical | Keyword-based |
| ROT-13 | Classical | Self-inverse |
| Atbash | Classical | Self-inverse |
| XOR | Classical | Encrypt → hex pairs |
| Base64 | Encoding | UTF-8 safe |
| Hex | Encoding | Space-separated bytes |
| Binary | Encoding | 8-bit groups |
| Morse | Encoding | International code |

- All operations run **entirely in the browser** — no server, no data collection
- macOS-inspired monochrome aesthetic
- Responsive layout (desktop + mobile)

## Structure

```
src/
├── app/
│   ├── globals.css     # Full design system (tokens, components)
│   ├── layout.tsx      # Root layout + SEO metadata + self-hosted fonts
│   └── page.tsx        # Home page (server component)
├── components/
│   ├── CryptoApp.tsx   # Stateful client root ('use client' boundary)
│   ├── Titlebar.tsx    # macOS traffic-light titlebar
│   ├── Sidebar.tsx     # Operation navigation
│   ├── ModeToggle.tsx  # Sliding Encrypt/Decrypt pill
│   ├── ParamsBar.tsx   # Shift / Key inputs
│   ├── IOGrid.tsx      # Input | Swap | Output layout
│   ├── IOPane.tsx      # Single IO panel
│   └── SwapButton.tsx  # Swap icon button
└── lib/
    ├── crypto.ts       # All cipher implementations
    ├── ciphers.ts      # Cipher registry / metadata
    └── process.ts      # Dispatch function (exhaustive switch)
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint
```

## Deployment

Deploy instantly to Vercel:

```bash
npx vercel
```

Or connect the `stele-next` directory to a Vercel project via the dashboard.
