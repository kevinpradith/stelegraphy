# Stèle

**Live Deployment:** [https://stele-gray.vercel.app/](https://stele-gray.vercel.app/)

Stèle is a minimal, visually focused cryptographic application built on Next.js. It is specifically designed to demonstrate the "Stelegraphy" cipher—a custom algorithm that algorithmically translates encoded messages into highly aesthetic Ancient Runic inscriptions.

Constructed with a premium, responsive, macOS-inspired monochrome interface, Stèle operates entirely on the client side without relying on external cryptography dependencies.

## Architecture & Features

- **Exclusive Focus on Stelegraphy**: The application is strictly optimized for a single cryptographic operation, presenting a streamlined layout devoid of unnecessary routing.
- **Client-Side Operations**: All encryption and decryption logic executes within the browser, ensuring messages remain inaccessible to any servers.
- **Premium Fluid UI**: The interface utilizes strict macOS-inspired design principles, including multi-layered glassmorphism, dynamic window scaling based on viewport constraints, precision San Francisco typography fallback, and authentic spring-physics animations.
- **Fully Responsive Layout**: Intelligent CSS grids map seamlessly from a dual-pane desktop floating window layout down to a touch-optimized swiping carousel for mobile environments.

## The Stelegraphy Algorithm

Stelegraphy eschews complex matrix rotations for a highly explainable, three-phase mathematical translation that prioritizes visual impact and uniqueness.

1. **XOR Masking**
The engine ingests the raw UTF-8 serialized message and performs a bitwise Exclusive-OR (XOR) operation sequentially against characters of a user-provided Master Key. This masks the original semantic meaning into randomized bytes.

2. **Base64 Normalization**
The masked byte array is encoded into a standard Base64 representation. This normalization guarantees that the disorganized binary data is forced into a predictable 64-character alphanumeric domain.

3. **Runic Translation**
Each character in the resulting Base64 string is deterministically mapped one-to-one into 64 distinct Ancient Runic alphabets (Elder Futhark variants), delivering a visually compelling, presentation-ready cryptographic output.

## Technology Stack

- **Framework**: Next.js 15 (App Router, Turbopack enabled)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Variables, Flexbox, Grid, Media Queries)
- **Deployment**: Configured for Vercel

## Local Development Environment

Ensure Node.js is installed, then proceed with the standard package installation.

```bash
# Install dependencies
npm install

# Run the development server with Turbopack
npm run dev
```

Navigate to `http://localhost:3000` to interact with the application.

## License

This project is intended for educational demonstrations in custom client-side ciphers and modern interface design.
