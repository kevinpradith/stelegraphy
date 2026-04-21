# Product Requirements Document (PRD)

**Product:** Stèlegraphy
**Version:** 0.1.0
**Status:** Production
**Last Updated:** April 2026

---

## 1. Overview

### 1.1 Product Summary

Stèlegraphy is a single-page, client-side cryptographic application. It provides users with a clean, premium interface to encrypt and decrypt text using the **Stèlegraphy cipher** — a custom symmetric cipher that encodes data into Ancient Runic characters.

The product targets students, cryptography enthusiasts, and educators looking for a visually compelling demonstration of symmetric encryption principles.

### 1.2 Problem Statement

Standard cryptographic tools are either overly complex for educational purposes or visually unengaging. There is no tool that combines a comprehensible, custom cipher algorithm with a premium, aesthetically differentiated visual output (Ancient Runes), making it both educational and memorable.

### 1.3 Goals

- Provide a fully functional encrypt/decrypt interface for the Stèlegraphy cipher.
- Guarantee absolute user privacy by performing all operations client-side.
- Deliver a premium, macOS-inspired user experience across all device types.
- Serve as a complete educational demonstration of XOR-based symmetric encryption.

---

## 2. Target Users

| User Type | Description |
|---|---|
| **Students** | Computer science or cybersecurity students learning cryptography fundamentals |
| **Educators** | Teachers demonstrating XOR cipher mechanics and symmetric encryption |
| **Enthusiasts** | Hobbyists interested in custom cipher design and runic aesthetics |
| **General Users** | Anyone who needs a private, offline-capable message encoder |

---

## 3. User Stories

### 3.1 Core Encryption & Decryption

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-01 | user | type plaintext into an input field | I can see it instantly encrypted in real time |
| US-02 | user | enter a Master Key | my encrypted output is unique to that key |
| US-03 | user | switch between Encrypt and Decrypt mode | I can reverse a received Runic ciphertext |
| US-04 | user | paste an Ancient Runic ciphertext and provide the key | I can recover the original plaintext |
| US-05 | user | swap the output back into the input with one click | I can quickly chain operations without copy-pasting |
| US-06 | user | see errors when decryption fails (wrong key / invalid input) | I understand why the operation failed |

### 3.2 Interface & Experience

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-07 | user | copy the output text with one click | I can share the result quickly |
| US-08 | user | toggle between Light and Dark themes | I can use the application comfortably in any lighting |
| US-09 | user | have my theme preference saved | I don't have to re-select it on every visit |
| US-10 | user | use the app on mobile without horizontal scrolling | I can use it comfortably on any device |
| US-11 | user | see the app load without a white flash in dark mode | the experience feels polished and native |

### 3.3 Privacy & Security

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-12 | user | be confident my text is never sent to a server | my private data remains private |
| US-13 | user | use the app with no account or login required | I can access it immediately with no friction |

---

## 4. Feature Specifications

### 4.1 Stèlegraphy Cipher Engine

**Priority:** Critical

- Implements a 4-phase symmetric cipher:
  1. **Serialization** — `encodeURIComponent()` for UTF-8/emoji safety
  2. **XOR Masking** — cyclic key XOR over serialized bytes
  3. **Base64 Normalization** — `btoa()` to produce a stable 64-char domain
  4. **Runic Translation** — deterministic 1:1 mapping of Base64 chars → 64 Elder Futhark rune variants
- The default key fallback is `"stele"` when no key is provided.
- Decryption is the exact inverse: Rune → Base64 → `atob()` → XOR unmasking → `decodeURIComponent()`.
- Symmetric: `A ^ B ^ B = A`.

### 4.2 Real-Time Processing

**Priority:** Critical

- Output is computed as a **derived value** from `(input, mode, key)` state — no explicit "run" button required.
- Re-renders are triggered on every keystroke in either the input or key field.

### 4.3 Mode Toggle (Encrypt / Decrypt)

**Priority:** Critical

- A segmented control switches between `encrypt` and `decrypt` modes.
- The "Swap" button sets the output as the new input and toggles the mode automatically.

### 4.4 Master Key Input

**Priority:** Critical

- A dedicated key input field is shown for ciphers with `needsKey: true`.
- The key field renders with a monospace font and placeholder `"Master Secret Key"`.
- An empty key field falls back to the default key `"stele"`.

### 4.5 Input / Output Panels

**Priority:** Critical

- Two side-by-side panels on desktop; stacked vertically on mobile.
- The input panel contains an editable `<textarea>`.
- The output panel renders the result as read-only text.
- Each panel has a **Copy** button that writes the panel content to the clipboard.
- Character count is displayed per panel.

### 4.6 Swap Action

**Priority:** High

- A centered Swap button between the two panels transfers the output text into the input field.
- Mode is automatically toggled (Encrypt → Decrypt, Decrypt → Encrypt).
- The button is disabled / dimmed when the output is empty.

### 4.7 Theme System (Light / Dark)

**Priority:** High

- Defaults to the OS preference (`prefers-color-scheme`).
- User selection is persisted in `localStorage` under the key `stele-theme`.
- An inline blocking `<script>` reads storage before the first paint to prevent Flash of Unstyled Content (FOUC).
- Theme colors: Dark `#1C1C1E`, Light `#F6F6F4`.

### 4.8 Responsive Layout

**Priority:** High

- **Desktop (≥ 768px):** Floating, constrained-width window with macOS-style titlebar, sidebar, and side-by-side IO panels.
- **Mobile (< 768px):** Full-viewport layout; sidebar replaced by a swipeable info carousel; IO panels stack vertically.

### 4.9 Security Headers

**Priority:** Medium

- Applied via `next.config.ts` to every route:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy` — self-only, no external origins

---

## 5. Out of Scope

The following are explicitly **not** included in v0.1.0:

| Feature | Rationale |
|---|---|
| File encryption/decryption | Scope limited to text-based operations |
| Multiple cipher algorithms | Architecture is extensible but only Stèlegraphy is registered |
| Server-side processing or API | Intentional privacy design — client-only |
| User accounts or auth | No persistent user data exists |
| Export to PDF or image | Out of current scope |
| Asymmetric (public/private key) ciphers | Custom symmetric XOR is the educational focus |

---

## 6. Non-Functional Requirements

| Requirement | Target |
|---|---|
| First Contentful Paint | < 1.5s on a standard 4G connection |
| Encryption latency | < 10ms for inputs up to 10,000 characters |
| Accessibility | Keyboard-navigable UI; ARIA labels on interactive controls |
| Browser support | All modern evergreen browsers (Chrome, Firefox, Safari, Edge) |
| Zero external runtime requests | All assets (fonts, scripts) self-hosted via Next.js |

---

## 7. Success Metrics

| Metric | Description |
|---|---|
| Functional correctness | `decrypt(encrypt(text, key), key) === text` for all valid inputs |
| Zero network payloads | DevTools Network tab shows no POST/PUT requests |
| Lighthouse score | Performance ≥ 90, Accessibility ≥ 90 |
| FOUC-free theme load | No visible flash on page load in dark mode |
