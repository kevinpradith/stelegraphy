# Stèlegraphy

[![CI](https://github.com/kevinpradith/stelegraphy/actions/workflows/ci.yml/badge.svg)](https://github.com/kevinpradith/stelegraphy/actions/workflows/ci.yml)
[![CodeQL](https://github.com/kevinpradith/stelegraphy/actions/workflows/codeql.yml/badge.svg)](https://github.com/kevinpradith/stelegraphy/actions/workflows/codeql.yml)
[![Licence: MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.18-brightgreen.svg)](package.json)

Type a sentence, get a line of Elder Futhark runes back, and get the sentence
back out of the runes with the same key. It runs entirely in the browser tab and
sends nothing anywhere.

Try it at **[stelegraphy.kevinpradith.my.id](https://stelegraphy.kevinpradith.my.id)**.

> [!WARNING]
> **This is not encryption and it is not steganography.** The transform is a
> repeating-key XOR, which is a Vigenère cipher over bytes, followed by two public
> encodings. Anyone holding a few hundred runes can recover the key on a laptop,
> and anyone holding one guessed word recovers it instantly. It is a toy for
> making text look like a carved stone. Do not put anything behind it that you
> would mind a stranger reading. [How it breaks](#how-it-breaks) says exactly why,
> with the attacks named.

<img
  alt="The Stèlegraphy window: a plaintext pane on the left, a pane of Elder Futhark runes on the right, and the Master Key bar between them."
  src="public/opengraph/stelegraphy.webp"
/>

## Contents

- [Why it exists](#why-it-exists)
- [Quick start](#quick-start)
- [How the cipher works](#how-the-cipher-works)
- [How it breaks](#how-it-breaks)
- [Privacy](#privacy)
- [Development](#development)
- [Deliberate limits](#deliberate-limits)
- [Licence](#licence)
- [Project](#project)

Two longer documents sit beside this one, because the reader who wants to encode
a sentence and the reader who wants to know why the encoding is worthless are not
the same person:

|                                                         |                                              |
| ------------------------------------------------------- | -------------------------------------------- |
| The cipher in full, and the three attacks that break it | [docs/cipher.md](docs/cipher.md)             |
| How the app is put together, and how to deploy your own | [docs/architecture.md](docs/architecture.md) |

## Why it exists

Runes look like a secret. That is the entire appeal, and it is worth separating
from the claim that something is secret, because tools in this shape are usually
sold on the confusion between the two. A generator that calls a substitution
alphabet "military-grade encryption" is not lying about the runes; it is lying
about what they cost an attacker.

So this project does the fun half and says the quiet half out loud. The output is
genuinely nice to look at, one glyph per Base64 character, no ragged rows. The
security is genuinely nil, written down in [docs/cipher.md](docs/cipher.md) with
the key-recovery attacks spelled out rather than hinted at. Both statements are
true at once, and a reader deserves the second one on the same page as the first.

If you actually need to protect a message in a browser, the platform already
ships the thing to use: `crypto.subtle` with AES-GCM and a key derived through
PBKDF2 or Argon2. That is a different program, and it would not look like this
one.

## Quick start

Node 22.18 or newer, and nothing else. No accounts, no services, no environment
variables.

```sh
npm install
npm run dev       # http://localhost:3000
npm run build     # a production build
npm start         # serve that build
```

The deployed copy is the same build on Vercel. There is no server-side code in
it: every route is prerendered as static content, and the cipher runs in the tab.

## How the cipher works

Four phases, each reversible on its own, all in
[`src/lib/crypto.ts`](src/lib/crypto.ts).

| Phase                   | What happens                                                   | Reversed by          |
| ----------------------- | -------------------------------------------------------------- | -------------------- |
| 1. Serialization        | `encodeURIComponent`, so any codepoint becomes ASCII           | `decodeURIComponent` |
| 2. XOR masking          | every byte XORed against the Master Key, cycling               | the same XOR         |
| 3. Base64 normalization | arbitrary bytes become a known 64-character alphabet           | `atob`               |
| 4. Runic translation    | those 64 characters map one-to-one onto 64 Elder Futhark runes | the same table       |

Encrypting `HELLO` with the key `key`:

```
HELLO                     plaintext
HELLO                     phase 1, nothing to escape here
23 20 35 27 2a            phase 2, XOR against k, e, y, k, e
IyA1Jyo=                  phase 3, Base64
ᚨᛒᚠᛕᚩᛒᛈ᛫                   phase 4, one rune per character
```

Phase 2 is its own inverse, which is why decryption is the same walk in the other
direction and why there is one `xorWithKey` function rather than two. Base64 pads
with `=`, and the rune alphabet has exactly 64 slots, so padding gets a 65th
glyph of its own, the Old Norse punctuation mark `᛫`.

An empty key box falls back to the string `stele` rather than dividing by the
length of an empty key. The key byte is masked to 8 bits, so a key containing an
emoji is a valid key instead of an error.

## How it breaks

Phases 1, 3 and 4 are public and keyless. Phase 4's table is in the source file
above and the other two are standards, so an attacker peels all three off with no
work at all and is left facing a repeating-key XOR. That is a Vigenère cipher, and
it has been broken since the nineteenth century:

- **Known plaintext recovers the key outright.** XOR the ciphertext against text
  you already expect to be in the message and the key falls out, repeated. One
  guessed word is enough, and a message that begins with a greeting or ends with
  a name supplies it for free.
- **Kasiski examination and the index of coincidence give the key length.** Once
  the length is known, the ciphertext splits into that many single-byte XOR
  columns, and each column is solved separately by frequency analysis, in
  milliseconds, without the rest.
- **A short key is simply brute-forced.** The key space is the key, not a derived
  block, so a four-character lowercase key is under half a million tries against
  a check as cheap as "does the result decode as UTF-8".

Two more properties fall out of the construction, and each matters on its own:

- **The same plaintext under the same key always gives the same runes.** There is
  no nonce and no salt, so identical messages are visibly identical, and the
  length of the output states the length of the input.
- **Nothing authenticates the ciphertext.** Flipping a rune flips the
  corresponding plaintext bits. A decryption that succeeds is not evidence that
  the message arrived as it was sent.

None of this is a bug report. It is what a repeating-key XOR is, and the fix is
not a patch to this cipher but a different cipher entirely. See
[SECURITY.md](SECURITY.md) for what does count as a vulnerability here.

## Privacy

The claim is narrow and it holds: the text never leaves the tab. There is no
fetch, no analytics, no API route, and no server component that sees an input.
`localStorage` holds the chosen theme and nothing else.

That is backed by a `Content-Security-Policy` in
[`next.config.ts`](next.config.ts) with `connect-src 'self'`, so the page cannot
reach another origin even if a dependency were compromised, and `frame-ancestors
'none'` alongside `X-Frame-Options: DENY`. Fonts are self-hosted by `next/font`,
so there is no request to a font CDN to leak a visit either. The headers, and the
one directive deliberately left loose, are in
[docs/architecture.md](docs/architecture.md).

## Development

```
src/app/          the App Router: one route, one layout, the global stylesheet
src/lib/crypto.ts the cipher, four phases, no imports
src/lib/ciphers.ts the registry the sidebar and the title bar read
src/lib/process.ts dispatch by cipher id and mode, exhaustive over CipherId
src/components/   the window: title bar, sidebar, mode toggle, key bar, I/O panes
src/contexts/     the theme provider, paired with the pre-paint script in layout.tsx
src/types/        the shared types, and the union that keeps the dispatch honest
test/             node:test over the cipher, no framework
docs/             the cipher in full, and the architecture
```

```sh
npm install
npm run dev
npm run typecheck
npm run lint
npm run format:check   # npm run format writes it
npm test
npm run build
```

`npm test` compiles the cipher and its tests with `tsc` into `.test-build/` and
runs them under `node:test`. That extra step exists because Node's built-in type
stripping is missing from some distribution builds, and a test suite that only
runs on some machines is not a test suite.

Formatting is Prettier's, pinned to an exact version: 100 columns, single quotes,
no semicolons. CI checks it rather than applying it, so a pull request is told
what to run instead of having its diff rewritten underneath it.

## Deliberate limits

- **One cipher.** The registry in `src/lib/ciphers.ts` and the union in
  `src/types/index.ts` are shaped for several, and the dispatch switch is
  exhaustive so a second one cannot be half-added. There is still only one,
  because the sidebar of a tool with one item is honest and a plugin architecture
  for a single plugin is not.
- **No file input.** Text in a box, runes in a box. A file would mean reading
  bytes that are not text, and the whole point of phase 1 is that the input is
  text.
- **No URL sharing.** A link carrying the ciphertext would put it in browser
  history, in the referrer and in any proxy log along the way. For a cipher this
  weak that is a meaningfully worse place for it than a clipboard.

## Licence

[MIT](LICENSE).

## Project

- [SECURITY.md](SECURITY.md), which says what is in scope given that the cipher
  is already documented as broken
- [CONTRIBUTING.md](CONTRIBUTING.md) for how to run the checks and how commits
  are written
- [CHANGELOG.md](CHANGELOG.md) for what changed and when
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
