# Architecture

How the app is put together, and how to run a copy of it. The cipher itself is in
[cipher.md](cipher.md).

## The shape of it

One route, prerendered as static HTML, with the whole application mounted under
it as a single client component. There is no API route, no server action, no
database and no runtime. `npm run build` produces `/` and `/_not-found`, both
static, and the deployed copy is those files on a CDN.

```
src/app/layout.tsx      the document: fonts, metadata, theme bootstrap
src/app/page.tsx        a server component whose entire job is to mount CryptoApp
src/app/globals.css     the design system: tokens, then components
src/components/         the window
src/contexts/           the theme provider
src/lib/                the cipher, the registry, the dispatch
src/types/              the shared types
```

## State, and where it lives

`CryptoApp` is the only stateful component and holds four values: the selected
cipher, the mode, the input text and the key. Everything below it is a
presentational component taking props.

There is no `output` state. The output is derived on every render:

```tsx
const output = input ? process(selected, input, mode, { key }) : ''
```

The cipher is a few hundred microseconds of string work on any realistic input,
so deriving it is cheaper than the bookkeeping of keeping two pieces of state in
step, and it cannot go stale. If a heavier cipher ever lands here, that is the
line to reconsider, and `useMemo` is the smallest change that would fix it.

`Swap` moves the output into the input and flips the mode, which is how you check
that something decodes back.

## Dispatch

`src/lib/process.ts` switches on the cipher id, with a `never` assignment in the
default branch:

```ts
default: {
  const _never: never = id
  return _never
}
```

Adding a member to `CipherId` without handling it is then a typecheck failure
rather than a silent fall-through. That is the whole reason the union exists for
what is currently one cipher: it makes a second one impossible to half-add.

`src/lib/ciphers.ts` is the registry the sidebar and the title bar read, so
labels and placeholder text are declared once rather than typed into JSX twice.

## Theme without a flash

The theme is stored in `localStorage` under `stele-theme` and applied by
`ThemeProvider`. React runs after hydration, though, and a page that paints in
light and then switches to dark is worse than one that has no theme switch at all.

So `layout.tsx` carries one inline script that runs before first paint: it reads
`localStorage`, falls back to `prefers-color-scheme`, and sets `data-theme` and
`color-scheme` on `<html>` directly. The provider then picks up the same value.
The two must agree on the storage key and the fallback, which is why both say so
in a comment.

This is the one inline script on the page, and the reason the
`Content-Security-Policy` below carries `'unsafe-inline'` for scripts.

## Headers

Set in `next.config.ts`, applied to every route.

| Header                    | Value                                                                                                           | Why                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `Content-Security-Policy` | `default-src 'self'`, `connect-src 'self'`, `img-src 'self' data:`, `font-src 'self'`, `frame-ancestors 'none'` | The page cannot reach another origin, so the text cannot leave the tab |
| `X-Frame-Options`         | `DENY`                                                                                                          | Clickjacking, for browsers that predate `frame-ancestors`              |
| `X-Content-Type-Options`  | `nosniff`                                                                                                       | No MIME sniffing                                                       |
| `Referrer-Policy`         | `strict-origin-when-cross-origin`                                                                               | An outbound link learns the origin, never the path                     |
| `Permissions-Policy`      | `camera=(), microphone=(), geolocation=()`                                                                      | Nothing here needs any of the three                                    |
| `X-XSS-Protection`        | `1; mode=block`                                                                                                 | Inert in current browsers, kept for old ones where it is not           |

`script-src` carries `'unsafe-inline'` and `'unsafe-eval'`, which is the one
place this is looser than it looks. Next.js needs the first for the hydration
data and for the theme script above, and the second in development. Tightening it
means a per-request nonce, and a nonce means the page can no longer be static,
which would trade the property that makes the privacy claim simple for a
directive that guards against injecting a script into a page that has no server
to inject one through. Fonts are self-hosted rather than fetched from a font
CDN, so `font-src 'self'` holds without exceptions and no request announces a
visit.

## The runes need a font, and most systems have none

Elder Futhark lives at U+16A0 to U+16F8, and nothing guarantees a reader has a
face for it. Windows has Segoe UI Historic and macOS has coverage, but a stock
Linux or Android system has neither, and there the entire output of this cipher
arrives as a row of empty boxes: the one thing the app exists to show.

So the block travels with the page. `public/fonts/noto-sans-runic-subset.woff2`
is Noto Sans Runic cut down to the 64 glyphs the table uses plus the padding
mark, which is 2.4 KB, and `globals.css` declares it with
`unicode-range: U+16A0-16DF, U+16EB`. That range is what keeps it honest: the
face is fetched only by a page actually showing runes, and it can never
override a Latin character. It sits at the end of the `--mono` stack, so a
system that does have a runic face is free to use its own.

The font is under the SIL Open Font License 1.1, with the text beside it in
`public/fonts/OFL.txt`.

## Deployment

Vercel, from `main`. `vercel.json` names the framework and the commands, and
`cleanUrls` drops `.html` from paths. A push to `main` deploys to production; a
pull request gets a preview URL.

Nothing is required in the environment. `NEXT_PUBLIC_SITE_URL` is read in
`layout.tsx` for the canonical and Open Graph URLs, and it is optional: without
it the build falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`,
then the production domain. Set it only when serving from a domain Vercel does
not know about.

Any static host works. `npm run build` and `npm start` serve the same output
behind Node, and the headers above come from `next.config.ts` rather than from
Vercel's configuration, so they survive the move.

### A custom domain

Add it under Settings, Domains, then point DNS at Vercel: `A` at `76.76.21.21`
for an apex, or `CNAME` to `cname.vercel-dns.com` for a subdomain. The
certificate is issued automatically once the record resolves.

## Checking a deployment

```sh
curl -sI https://stelegraphy.kevinpradith.my.id | grep -i 'content-security-policy\|x-frame-options'
```

The rest is the app itself: type something, swap, and see it come back.
