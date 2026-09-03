# Changelog

All notable changes to this project are recorded here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
While the version is below 1.0.0 the shape of `src/lib` may still change between
minor versions. A change that stops previously produced runes from decoding is a
breaking change and is called one here.

## [Unreleased]

## [0.2.0] - 2026-09-03

The documentation stops overselling the cipher, and there is now something
checking it.

### Added

- **A test suite.** `npm test` runs `node:test` over the cipher: the round trip,
  text outside ASCII, a key outside ASCII, the wrong key, an empty key, empty
  input, and input that is not runes. It compiles with `tsc` into `.test-build/`
  first rather than relying on Node's built-in type stripping, which is missing
  from some distribution builds and so would have made the suite pass on some
  machines and not others.
- **CI on Node 22.18 and 24**, running typecheck, lint, format check, tests and
  build. CodeQL with the `security-extended` pack analyses every push and pull
  request, OpenSSF Scorecard scores the repository itself weekly, and Dependabot
  watches npm and the actions. Every action is pinned to a commit rather than a
  tag.
- **The files a public repository is expected to carry**: an MIT `LICENSE` that
  was previously only implied by a sentence in the README, `SECURITY.md`,
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CITATION.cff`, issue and pull request
  templates, and `CODEOWNERS`.
- **Prettier**, pinned, at 100 columns with single quotes and no semicolons. CI
  checks the formatting rather than applying it.

### Changed

- **The README says what the cipher is.** It previously described a repeating-key
  XOR as a "custom-designed symmetric block cipher" with "uncompromising" this and
  "aesthetically profound" that. It now opens with a warning that the transform is
  a Vigenère cipher over bytes, and `docs/cipher.md` names the three attacks that
  break it. The runes are the point; the security never was, and saying otherwise
  was the one genuinely harmful thing in the repository.
- **Six documents became two.** The `docs/` folder held a PRD, an ERD, an API
  reference, an architecture note, a deployment guide and an index, for a single
  page with one function in it. The ERD described no data, because there is none.
  What survived is `docs/cipher.md` and `docs/architecture.md`.
- **One live URL.** The README, the docs index and the metadata fallback in
  `layout.tsx` each named a different address. All three now say
  `stelegraphy.kevinpradith.my.id`.
- `src/lib/crypto.ts` lost the class wrapping its two functions, and the XOR walk
  that was written out twice is now one function used in both directions, which is
  the property the cipher rests on.

### Fixed

- **A key containing a character above U+00FF no longer fails.** The XOR of an
  ASCII byte with, say, an emoji produced a value wider than a byte, `btoa` threw,
  and the user was shown `Encryption Error` with a DOM exception in it. The key
  byte is now masked to 8 bits. Keys that already worked produce the same runes
  as before.

## [0.1.0] - 2026-08-31

First working version.

### Added

- The Stèlegraphy cipher: URI-safe serialization, repeating-key XOR, Base64, and
  a one-to-one mapping onto 64 Elder Futhark runes with a 65th glyph for padding.
- A macOS-styled single window: title bar, sidebar, encrypt and decrypt toggle,
  Master Key bar, two I/O panes with copy and word count, and a swap button.
- Light and dark themes, chosen from the system by default, remembered in
  `localStorage`, and applied by an inline script before first paint so the page
  does not flash the wrong one.
- Security headers on every route, including a `Content-Security-Policy` with
  `connect-src 'self'`, and fonts self-hosted by `next/font` so no request
  reaches a font CDN.
- Open Graph and Twitter card metadata, so a pasted link arrives as a picture of
  the app.

[Unreleased]: https://github.com/kevinpradith/stelegraphy/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/kevinpradith/stelegraphy/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kevinpradith/stelegraphy/releases/tag/v0.1.0
