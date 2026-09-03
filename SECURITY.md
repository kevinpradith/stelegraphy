# Security policy

## The cipher is not a secret worth reporting

Read this before writing a report. Stèlegraphy's transform is a repeating-key XOR
wrapped in Base64 and a public rune table. It is breakable by known plaintext, by
Kasiski examination, and by brute force on any short key, and
[docs/cipher.md](docs/cipher.md) describes all three in detail on purpose. A
report saying the cipher is weak is describing the documentation, not finding a
flaw in it, and it will be closed as such.

That is the whole point of the warning at the top of the README: the weakness is a
published property of the design rather than a mistake in the implementation.

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue.

Use [GitHub's private vulnerability reporting](https://github.com/kevinpradith/stelegraphy/security/advisories/new)
on this repository. It opens a private thread visible only to the maintainer, and
it can be turned into a published advisory once a fix is out.

Expect an acknowledgement within seven days. If you have had no reply after that,
the report may not have reached anyone, so open a public issue saying only that
you are waiting on a security response. Do not put the details in it.

## Supported versions

This project is pre-1.0 and there is no maintenance branch. Fixes land on `main`
and go out in the next tag. Run the latest release.

| Version        | Supported |
| -------------- | --------- |
| latest release | yes       |
| anything older | no        |

## What is in scope

The claim this project makes is that the text you type never leaves the browser
tab, and that visiting the site cannot be turned against you. Anything that
breaks either claim is a vulnerability here:

- Any path by which the input, the output or the Master Key reaches the network.
  There is no `fetch`, no analytics and no API route in this repository, so any
  request at all is a finding.
- A way past the `Content-Security-Policy` in `next.config.ts`, since that policy
  is what makes the first claim hold even if a dependency were compromised. The
  same applies to the framing, referrer and permissions headers beside it.
- Cross-site scripting through anything typed into the input or key boxes, or
  through anything pasted into the output box before it is swapped back.
- A way to make the theme bootstrap script in `src/app/layout.tsx` execute
  something other than what the file contains. It is the one inline script here
  and it reads `localStorage`.
- Anything a compromised or typosquatted dependency in `package-lock.json` can do
  that the headers above do not already prevent.

## What is not in scope

- **The strength of the cipher.** See the first section. Recovering a key from
  ciphertext is the documented behaviour of a repeating-key XOR.
- Reading the rune table, the Base64 alphabet or the padding glyph out of the
  source. All three are published in `src/lib/crypto.ts` and in the README, and
  none of them is a key.
- The Master Key being visible in a text input on your own screen. It is not
  a stored credential, and there is no account behind it.
- Denial of service from text you paste into your own tab.
- Anything that requires an attacker to already be running code as you.
- Reports produced by a scanner with no accompanying explanation of how the
  finding applies to a static site with no server-side code and no backend.

## How this is checked

`npm test` covers the cipher's round trip and its refusals. CodeQL analyses every
push and pull request with the `security-extended` pack, and Dependabot watches
both npm and the actions themselves.

Every GitHub Actions step is pinned to a commit rather than a tag, because a tag
is a moving pointer and moving one is exactly how `tj-actions/changed-files` was
turned into a secret exfiltrator across 23,000 repositories in March 2025
(CVE-2025-30066). The workflow token is read-only at the top level, and the
checkout step is told not to leave it in `.git/config`.
