# Internal API Reference

**Product:** Stèlegraphy
**Version:** 0.1.0
**Last Updated:** April 2026

---

## Overview

Stèlegraphy has **no HTTP API or REST endpoints**. It is a fully client-side application with no backend.

This document describes the **internal programmatic API** — the TypeScript functions, React Context, and component interfaces that form the application's logic layer.

---

## 1. Cipher Engine — `src/lib/crypto.ts`

The core cipher module. Exports two pure functions that form the public cipher API.

---

### `stelegraphyEncrypt(text, key)`

Encrypts a plaintext string into an Ancient Runic ciphertext.

**Signature:**
```ts
function stelegraphyEncrypt(text: string, key: string): string
```

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `text` | `string` | The plaintext input to encrypt |
| `key` | `string` | The Master Key for XOR masking; falls back to `"stele"` if empty |

**Returns:** `string` — The Ancient Runic ciphertext (e.g., `ᚠᚡᚢᛟ᛫ᚹ...`)

**Returns on error:** `string` — A string prefixed with `"Encryption Error: ..."` if the operation fails (never throws to the caller).

**Cipher Phases:**

| Phase | Operation | Web API |
|---|---|---|
| 1. Serialization | UTF-8 URI-encode input | `encodeURIComponent()` |
| 2. XOR Masking | Cyclic key XOR over each character code | Bitwise `^` |
| 3. Base64 Normalization | Encode XOR bytes into stable 64-char set | `btoa()` |
| 4. Runic Translation | Map each Base64 char → Elder Futhark rune | Lookup table |

**Example:**
```ts
import { stelegraphyEncrypt } from '@/lib/crypto';

stelegraphyEncrypt('Hello', 'mykey');
// Returns a string of Ancient Runic characters
```

---

### `stelegraphyDecrypt(text, key)`

Decrypts an Ancient Runic ciphertext back to plaintext.

**Signature:**
```ts
function stelegraphyDecrypt(text: string, key: string): string
```

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `text` | `string` | The Ancient Runic ciphertext to decrypt |
| `key` | `string` | The Master Key that was used during encryption |

**Returns:** `string` — The recovered plaintext.

**Returns on error:** `string` — A string prefixed with `"Decryption Error: ..."` on:
- Invalid Runic characters in input
- Incorrect Master Key producing malformed Base64 (caught by `atob()`)
- URI decoding failure from `decodeURIComponent()`

**Decryption Phases:**

| Phase | Operation | Web API |
|---|---|---|
| 1. Runic Reversion | Rune chars → Base64 chars via lookup | Reverse lookup table |
| 2. Base64 Decoding | Decode Base64 → XOR-scrambled bytes | `atob()` |
| 3. XOR Unmasking | Same cyclic key XOR (symmetric: A^B^B=A) | Bitwise `^` |
| 4. Deserialization | Decode URI-encoded string → original text | `decodeURIComponent()` |

---

### Internal: `class Stelegraphy`

Used internally by the two exported functions. Not exported.

```ts
class Stelegraphy {
  constructor(key: string)  // Defaults key to "stele" if empty
  encrypt(plaintext: string): string
  decrypt(runesStr: string): string
}
```

---

### Internal: Character Mapping Constants

| Constant | Value | Description |
|---|---|---|
| `B64_CHARS` | `"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"` | Standard 64-char Base64 alphabet |
| `RUNE_CHARS` | `"ᚠᚡᚢᚣ...ᛟ"` (64 chars) | 64 consecutive Elder Futhark rune codepoints |
| Padding | `'='` ↔ `'᛫'` | Base64 padding sentinel ↔ Runic middle dot |

---

## 2. Process Dispatcher — `src/lib/process.ts`

A thin routing layer that maps `(CipherId, Mode)` to the correct cipher function.

---

### `process(id, input, mode, params)`

**Signature:**
```ts
function process(
  id: CipherId,
  input: string,
  mode: Mode,
  params: ProcessParams,
): string
```

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `CipherId` | The cipher identifier (`'stelegraphy'`) |
| `input` | `string` | The text to process |
| `mode` | `Mode` | `'encrypt'` or `'decrypt'` |
| `params` | `ProcessParams` | Parameter bag; currently `{ key: string }` |

**Returns:** `string` — The processed output or an error string.

**Behavior:**
- Dispatches via an exhaustive `switch (id)` — TypeScript reports a compile error if a `CipherId` is added without a corresponding case.
- Catches all thrown errors and returns them as `"Error: <message>"` strings.

**Example:**
```ts
import { process } from '@/lib/process';

const result = process('stelegraphy', 'Hello World', 'encrypt', { key: 'secret' });
```

---

## 3. Cipher Registry — `src/lib/ciphers.ts`

Provides the static list of registered ciphers and categories.

### `CIPHERS`

```ts
const CIPHERS: ReadonlyArray<CipherDef>
```

A readonly array of all registered cipher definitions. Currently contains one entry:

```ts
{
  id: 'stelegraphy',
  label: 'Stèlegraphy',
  category: 'Stèlegraphy',
  description: 'Custom symmetric block cipher that outputs an encrypted ciphertext in Ancient Runes.',
  needsKey: true,
  keyPlaceholder: 'Master Secret Key',
}
```

### `CATEGORIES`

```ts
const CATEGORIES: ReadonlyArray<Category>
// ['Stèlegraphy']
```

Used by the Sidebar to group ciphers under category headers.

---

## 4. Theme Context — `src/contexts/theme-context.tsx`

Provides application-wide theme state management.

---

### `ThemeProvider`

```tsx
function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element
```

Wraps the application root. Responsible for:
- Reading `localStorage['stele-theme']` on mount
- Falling back to `window.matchMedia('(prefers-color-scheme: dark)')` if no stored value
- Listening for OS theme changes and syncing when no user preference is stored
- Setting `data-theme` and `color-scheme` on `document.documentElement`

**Usage:**
```tsx
// In layout.tsx (already wired)
<ThemeProvider>{children}</ThemeProvider>
```

---

### `useTheme()`

```ts
function useTheme(): {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}
```

Returns the current theme context. Must be called within a `ThemeProvider` subtree — throws a descriptive error otherwise.

| Return Field | Type | Description |
|---|---|---|
| `theme` | `Theme` | Current active theme: `'light'` or `'dark'` |
| `setTheme` | `(t: Theme) => void` | Set a specific theme; persists to localStorage |
| `toggleTheme` | `() => void` | Toggle between light and dark; persists to localStorage |

**Usage:**
```tsx
import { useTheme } from '@/contexts/theme-context';

const { theme, toggleTheme } = useTheme();
```

---

## 5. Type Definitions — `src/types/index.ts`

All shared TypeScript types used across the application.

```ts
// Unique cipher identifier — extend this union to add a new cipher
type CipherId = 'stelegraphy';

// Sidebar category grouping
type Category = 'Stèlegraphy';

// Cipher operation direction
type Mode = 'encrypt' | 'decrypt';

// Full cipher metadata definition
interface CipherDef {
  readonly id:              CipherId;
  readonly label:           string;
  readonly category:        Category;
  readonly description:     string;
  readonly symmetric?:      boolean;   // if true, no mode toggle is shown
  readonly needsKey?:       boolean;   // if true, ParamsBar is rendered
  readonly keyPlaceholder?: string;    // placeholder for the key input
}

// Parameter bag for process()
interface ProcessParams {
  key: string;
}
```

---

## 6. Component Props Reference

### `CryptoApp` — `src/components/CryptoApp.tsx`

No props. This is the root client component and owns all state.

---

### `Titlebar` — `src/components/Titlebar.tsx`

| Prop | Type | Required | Description |
|---|---|---|---|
| `cipher` | `CipherDef` | Yes | Active cipher definition; used to display the window title |

---

### `ModeToggle` — `src/components/ModeToggle.tsx`

| Prop | Type | Required | Description |
|---|---|---|---|
| `mode` | `Mode` | Yes | Currently active mode |
| `onChange` | `(mode: Mode) => void` | Yes | Callback when the user changes the mode |

---

### `ParamsBar` — `src/components/ParamsBar.tsx`

| Prop | Type | Required | Description |
|---|---|---|---|
| `cipher` | `CipherDef` | Yes | Used for `keyPlaceholder` text |
| `keyValue` | `string` | Yes | Controlled value for the key input |
| `onKeyChange` | `(key: string) => void` | Yes | Callback on key field change |

---

### `IOGrid` — `src/components/IOGrid.tsx`

| Prop | Type | Required | Description |
|---|---|---|---|
| `input` | `string` | Yes | Current input text |
| `output` | `string` | Yes | Computed output text |
| `onInputChange` | `(v: string) => void` | Yes | Called when user edits input panel |
| `onSwap` | `() => void` | Yes | Called when Swap button is clicked |

---

### `IOPane` — `src/components/IOPane.tsx`

| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | Yes | Panel header label (e.g., `"Input"`, `"Output"`) |
| `value` | `string` | Yes | Text content of the panel |
| `readOnly` | `boolean` | No | If true, renders as read-only display; if false, renders editable textarea |
| `onChange` | `(v: string) => void` | No | Required when `readOnly` is false |
| `placeholder` | `string` | No | Placeholder text for the textarea |

---

### `SwapButton` — `src/components/SwapButton.tsx`

| Prop | Type | Required | Description |
|---|---|---|---|
| `onClick` | `() => void` | Yes | Called when the button is clicked |
| `disabled` | `boolean` | No | If true, button is visually dimmed and non-interactive |

---

### `ThemeToggle` — `src/components/ThemeToggle.tsx`

No props. Reads and updates theme via `useTheme()`.

---

## 7. Extending the Cipher Registry

To add a new cipher to the application:

1. **`src/types/index.ts`** — Add the new ID to the `CipherId` union and optionally to `Category`.
2. **`src/lib/crypto.ts`** — Implement `newCipherEncrypt()` and `newCipherDecrypt()` functions.
3. **`src/lib/ciphers.ts`** — Add a `CipherDef` entry to the `CIPHERS` array.
4. **`src/lib/process.ts`** — Add a `case 'newCipherId':` branch to the `switch` statement.

TypeScript's exhaustive switch will cause a **compile error** at step 4 if the new `CipherId` is not handled, preventing silent regressions.
