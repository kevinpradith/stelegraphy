# The Stèlegraphy cipher

What the transform does, exactly, and what it costs an attacker to undo it
without the key. The short answer to the second question is: very little. This
document exists so that answer is written down next to the algorithm rather than
left for someone to find out later.

## The transform

Four phases, in `src/lib/crypto.ts`. Three of them are public and keyless.

### Phase 1: serialization

`encodeURIComponent(plaintext)`. Every codepoint outside the unreserved ASCII set
becomes `%XX` escapes of its UTF-8 bytes, so the string entering phase 2 is ASCII
whatever went in: emoji, Japanese, combining marks, all of it.

This is what makes the rest safe to do with `btoa`, which handles only characters
in the range U+0000 to U+00FF. It is also the first thing that leaks: the escapes
have a shape, and a ciphertext whose plaintext was mostly non-Latin decodes to a
recognisably `%`-dense string. See [What else leaks](#what-else-leaks).

### Phase 2: XOR masking

```ts
out[i] = in[i] ^ (key[i % key.length] & 0xff)
```

The key repeats over the text. XOR is its own inverse, so this one function
serves both directions, and that symmetry is the only thing decryption relies on.

The `& 0xff` masks the key byte to eight bits. Without it a key containing a
character above U+00FF pushes the result past 255 and `btoa` throws. Keys made
only of ASCII, which is all of them in practice, are unaffected, so this changed
no ciphertext that already worked.

An empty key falls back to `stele`, because `i % 0` is `NaN`.

### Phase 3: Base64 normalization

`btoa`. Arbitrary bytes in, the standard 64-character alphabet out, `=` padding.
No key, no choice, no secret.

### Phase 4: runic translation

A fixed one-to-one table from the 64 Base64 characters onto 64 Elder Futhark
runes, U+16A0 to U+16DF, in order. Base64 pads with `=` and the table has exactly
64 slots, so padding gets a 65th glyph, `᛫` (U+16EB, Runic single punctuation),
which is why a ciphertext can end in a dot-like mark.

Both alphabets are constants at the top of `src/lib/crypto.ts`. A substitution
table published in the source is not a key, and calling this step encryption is
the same error as calling ROT13 encryption.

### A worked example

Encrypting `HELLO` with the key `key`:

| Stage   | Value                      |
| ------- | -------------------------- |
| Input   | `HELLO`                    |
| Phase 1 | `HELLO`, nothing to escape |
| Phase 2 | `23 20 35 27 2a` in hex    |
| Phase 3 | `IyA1Jyo=`                 |
| Phase 4 | `ᚨᛒᚠᛕᚩᛒᛈ᛫`                 |

Phase 2 in full: `H^k`, `E^e`, `L^y`, `L^k`, `O^e`, the key having wrapped after
three characters.

## What it is

Strip phases 1, 3 and 4, all of which an attacker performs with no information
they do not already have, and what is left is a repeating-key XOR. That is a
Vigenère cipher over bytes rather than over letters. It was published in 1553 and
broken in public by 1863.

## How it breaks

### Known plaintext hands over the key

XOR is symmetric in both operands, so `ciphertext ^ plaintext = key`, repeated for
as far as the known plaintext runs. Guess `Meet me` at the start of a message, or
a name at the end, or the `%20` an escaped space leaves behind, and the key is not
recovered by analysis, it is simply read off.

A key shorter than the guessed fragment is fully recovered from that fragment
alone, and then the whole message decrypts.

### Kasiski examination and the index of coincidence give the key length

With no known plaintext, the key length falls out of the statistics. Repeated
plaintext at a distance that is a multiple of the key length produces repeated
ciphertext; the greatest common divisor of those distances is a multiple of the
key length. The index of coincidence gives the same number by a different route,
and the two agree on real text.

Once the length is `n`, the ciphertext splits into `n` interleaved columns, each
of which was XORed against a single constant byte. Each column is then solved on
its own by frequency analysis, or by trying all 256 bytes and scoring the result
for English, or for URI-escaped UTF-8, which is even more distinctive. The
problem stops being one long cipher and becomes `n` trivial ones.

### A short key is brute-forced directly

The key is used as itself rather than stretched into a derived block, so the
search space is the space of keys people type. Four lowercase letters is 456,976
candidates; six is 300 million and still an afternoon. The check is cheap because
a wrong key almost always produces something that is not valid UTF-8 after
`decodeURIComponent`, which the code already treats as an error.

There is no key derivation function here, no salt and no work factor, so nothing
makes a guess cost more than a fraction of a microsecond.

## What else leaks

Two properties that are not attacks but are worth stating, because both surprise
people who assume otherwise:

- **It is deterministic.** No nonce, no salt, no initialisation vector. The same
  plaintext under the same key always produces the same runes, so identical
  messages are visibly identical, and a message that repeats a phrase shows that
  too. The output length also states the input length, within Base64's rounding.
- **It is unauthenticated.** Nothing binds the ciphertext to the key beyond the
  decoding happening to succeed. Flipping a bit in a rune flips the corresponding
  plaintext bit, and a modified message can still decode. A successful decryption
  is not evidence that the message arrived as it was sent.

## What to use instead

If a message needs protecting in a browser, the platform already ships it, and it
is not much more code than the above:

```js
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: 600_000, hash: 'SHA-256' },
  await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveKey',
  ]),
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt', 'decrypt'],
)
const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)
```

That gives a real key derivation, a random `iv` per message so the same plaintext
never encrypts the same way twice, and an authentication tag so a modified
ciphertext is refused rather than decoded into rubbish. It is a different program
from this one, and its output does not look like a carved stone.
