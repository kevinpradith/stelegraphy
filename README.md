# Stèlegraphy

**Live Deployment:** [https://stelegraphy.vercel.app/](https://stelegraphy.vercel.app/)

Stèlegraphy is a highly specialized, client-side cryptographic application built on Next.js. It operates as the exclusive frontend and algorithmic engine for the "Stèlegraphy" cipher—a custom-designed symmetric block cipher that translates raw textual data into aesthetically profound Ancient Runic inscriptions.

Constructed with an uncompromising focus on premium user experience, the application utilizes a macOS-inspired monochrome design language, featuring multi-layered glassmorphism, native Apple typography rendering fallback, and high-fidelity physics-based interactions.

## The Cryptographic Mechanism

Stèlegraphy circumvents complex, opaque matrix processing in favor of a deterministic, four-phase mathematical transformation optimized for extreme visual distinctiveness.

1. **Phase 1: Serialization**
   The application intercepts the plaintext input and sanitizes it via URI-safe UTF-8 encoding. This procedure guarantees structural integrity across heterogeneous data, including complex symbols and ideograms.

2. **Phase 2: XOR Masking**
   The core encryption involves a sequential, bitwise Exclusive-OR (XOR) operation. Each serialized character is masked against a user-provided cyclic Master Key, thoroughly obscuring the original byte patterns into randomized data.

3. **Phase 3: Base64 Normalization**
   To enforce structural consistency, the randomized XOR bytes are aggressively encoded into a standard Base64 representation. This normalization strictly confines the volatile binary output to a predictable 64-character alphanumeric domain.

4. **Phase 4: Runic Translation**
   Operating on the normalized Base64 string, the cipher executes a strict one-to-one character mapping. The 64 standard characters are translated deterministically into 64 distinct Ancient Runic alphabets (extrapolated from Elder Futhark variants), producing an intricately formatted, presentation-ready cryptographic construct.

*Decryption relies on the symmetric nature of the XOR logic (`A ^ B ^ B = A`), flawlessly reverting the Ancient Runes back into the initial unencrypted plaintext, conditional on the exact Master Key being provided.*

## Interface Architecture

- **Absolute Client-Side Processing**: Designed for utmost privacy. All serialization, scrambling, and mapping operations execute exclusively within the client's browser environment. Zero external requests are made; zero payload data is transmitted.
- **Dynamic Fluid Grids**: The application architecture scales intuitively. On desktop monitors, it renders as a constrained floating window utilizing shadow depth structures. On mobile devices, the environment fluidly reassembles into a responsive, full-viewport columnar layout featuring swipeable instructional components to conserve vertical space.
- **Micro-Interaction Fidelity**: Every state change employs highly calibrated CSS transitions replicating exact iOS/macOS spring curves and instantaneous color fades, delivering a tactile, highly responsive user experience. 

## Technology Blueprint

- **Core Framework**: Next.js 16 (App Router)
- **Compiler**: Turbopack
- **Library**: React 19
- **Scripting**: Strictly Typed TypeScript
- **Styling Architecture**: Zero-dependency CSS Variables and Flexbox/Grid topologies
- **Deployment Platform**: Vercel

## Local Initialization

Ensure Node.js is actively installed on your system.

```bash
# Clone the repository and install dependency matrices
npm install

# Initialize the development server backed by Turbopack
npm run dev
```

Proceed to `http://localhost:3000` to interact with the local uncompiled instance.

## Licensing

This repository serves as an educational and structural demonstration of custom cryptographic integration paired with top-tier modern interface design.
