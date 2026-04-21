# Stèlegraphy — Documentation Overview

**Live:** [https://stelegraphy.vercel.app](https://stelegraphy.vercel.app)
**Repository:** [https://github.com/kevinpradith/stelegraphy](https://github.com/kevinpradith/stelegraphy)

---

## What is Stèlegraphy?

Stèlegraphy is a client-side cryptographic web application built with Next.js. It implements a custom symmetric cipher — the **Stèlegraphy cipher** — that encrypts plaintext into visually distinctive **Ancient Runic** characters and decrypts them back to plaintext using the same Master Key.

All cryptographic operations execute entirely within the user's browser. No data is ever transmitted to a server.

---

## Documentation Index

| Document | Description |
|---|---|
| [README.md](./README.md) | Project overview, setup, and local development guide |
| [PRD.md](./PRD.md) | Product requirements, features, user stories, and scope |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technology stack, system architecture, and data flow |
| [ERD.md](./ERD.md) | Data structures and entity relationship diagram |
| [API.md](./API.md) | Internal API — cipher functions, context, and component interfaces |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment guide, environment variables, and CI/CD pipeline |

---

## Prerequisites

| Requirement | Minimum Version |
|---|---|
| Node.js | 18.17.0 |
| npm | 9.x |
| Git | Any modern version |

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kevinpradith/stelegraphy.git
cd stelegraphy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

> The development server uses **Turbopack** for fast hot-module replacement.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with Turbopack |
| `npm run build` | Compile a production-optimized build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the source tree |

---

## Project Structure

```
stelegraphy/
├── docs/                   # Project documentation
│   ├── README.md
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── ERD.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # Root layout (fonts, metadata, theme init)
│   │   ├── page.tsx        # Root page (renders CryptoApp)
│   │   └── globals.css     # Global CSS design system
│   ├── components/         # React UI components
│   │   ├── CryptoApp.tsx   # Root interactive component (state owner)
│   │   ├── Titlebar.tsx    # macOS-style window title bar
│   │   ├── Sidebar.tsx     # Cipher navigation sidebar
│   │   ├── ModeToggle.tsx  # Encrypt / Decrypt mode switch
│   │   ├── ParamsBar.tsx   # Master Key input bar
│   │   ├── IOGrid.tsx      # Input/output panel grid
│   │   ├── IOPane.tsx      # Individual I/O text panel
│   │   ├── SwapButton.tsx  # Swap input↔output button
│   │   └── ThemeToggle.tsx # Light / Dark theme switch
│   ├── contexts/
│   │   └── theme-context.tsx  # Theme state provider and hook
│   ├── lib/
│   │   ├── crypto.ts       # Core cipher implementation
│   │   ├── ciphers.ts      # Cipher registry and metadata
│   │   └── process.ts      # Cipher dispatch function
│   └── types/
│       └── index.ts        # Shared TypeScript type definitions
├── next.config.ts          # Next.js configuration and security headers
├── vercel.json             # Vercel deployment configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

---

## Environment Variables

This project requires **no environment variables** for local development. All logic is client-side and requires no secrets or API keys.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment details.

---

## Key Design Principles

- **Zero data transmission** — the cipher engine runs entirely in the browser via native Web APIs (`encodeURIComponent`, `btoa`, `atob`).
- **No external runtime dependencies** — zero third-party libraries beyond Next.js and React.
- **Strict TypeScript** — all modules use strict typing with exhaustive switch checks.
- **macOS-inspired UI** — glassmorphism, spring-curve transitions, and Apple typography fallbacks.
- **Theme-flash-free** — an inline `<script>` reads `localStorage` before first paint to prevent FOUC.
