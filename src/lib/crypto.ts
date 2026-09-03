/**
 * The Stèlegraphy cipher.
 *
 * Four deterministic phases, each reversible on its own:
 *
 *   1. Serialization        plaintext -> URI-safe UTF-8, so any codepoint survives
 *   2. XOR masking          every byte XORed against a repeating Master Key
 *   3. Base64 normalization arbitrary bytes -> a known 64-character alphabet
 *   4. Runic translation    those 64 characters -> 64 Elder Futhark runes
 *
 * Phase 2 is a Vigenere cipher over bytes and phases 3 and 4 are public
 * encodings, so this obscures text rather than protecting it. See docs/cipher.md
 * for how it is broken and README.md for what that means. It is a toy.
 */

const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const RUNE_CHARS = 'ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚲᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿᛀᛁᛂᛃᛄᛅᛆᛇᛈᛉᛊᛋᛌᛍᛎᛏᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟ'

/** Base64 pads with '='; the rune alphabet has 64 slots, so padding needs a 65th glyph. */
const PAD_RUNE = '᛫'

/** Used when the key box is left empty, so the app still round-trips. */
const DEFAULT_KEY = 'stele'

function b64ToRunes(b64: string): string {
  return b64.replace(/./g, (char) => {
    if (char === '=') return PAD_RUNE
    const idx = B64_CHARS.indexOf(char)
    return idx >= 0 ? RUNE_CHARS[idx] : char
  })
}

function runesToB64(runes: string): string {
  return Array.from(runes.trim())
    .map((char) => {
      if (char === PAD_RUNE) return '='
      const idx = RUNE_CHARS.indexOf(char)
      return idx >= 0 ? B64_CHARS[idx] : char
    })
    .join('')
}

/**
 * XOR each character against the key, cycling the key. Its own inverse, which is
 * the whole reason one function serves both directions.
 *
 * The key byte is masked to 8 bits: a key holding a character above U+00FF would
 * otherwise push the result past 255, and btoa refuses anything wider than a byte.
 * Masking costs nothing here because the input is URI-encoded and so already ASCII.
 */
function xorWithKey(text: string, key: string): string {
  return Array.from(text)
    .map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ (key.charCodeAt(i % key.length) & 0xff)),
    )
    .join('')
}

export function stelegraphyEncrypt(text: string, key: string): string {
  if (!text) return ''
  try {
    return b64ToRunes(btoa(xorWithKey(encodeURIComponent(text), key || DEFAULT_KEY)))
  } catch (err) {
    return `Encryption Error: ${err instanceof Error ? err.message : String(err)}`
  }
}

export function stelegraphyDecrypt(text: string, key: string): string {
  if (!text) return ''
  try {
    return decodeURIComponent(xorWithKey(atob(runesToB64(text)), key || DEFAULT_KEY))
  } catch {
    // A wrong key and a damaged input fail the same way, and neither is worth
    // distinguishing: both mean the runes on screen did not come back.
    return 'Decryption Error: Invalid Runic ciphertext or incorrect Master Key.'
  }
}
