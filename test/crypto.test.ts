import { test } from 'node:test'
import assert from 'node:assert/strict'
import { stelegraphyEncrypt, stelegraphyDecrypt } from '../src/lib/crypto.js'

const RUNES = /^[ᚠ-ᛸ᛫]*$/

test('a message comes back through the same key', () => {
  const key = 'correct horse battery staple'
  const text = 'Attack at dawn.'
  assert.equal(stelegraphyDecrypt(stelegraphyEncrypt(text, key), key), text)
})

test('anything outside ASCII survives the round trip', () => {
  const text = 'Halo dunia — ᚠᚢᚦ — 日本語 — 🜍🗝️'
  assert.equal(stelegraphyDecrypt(stelegraphyEncrypt(text, 'kunci'), 'kunci'), text)
})

test('a key outside ASCII does not break Base64', () => {
  // The key byte is masked to 8 bits for exactly this: an unmasked emoji key
  // pushed a character past 255 and btoa threw.
  const out = stelegraphyEncrypt('hello', '🔑')
  assert.match(out, RUNES)
  assert.equal(stelegraphyDecrypt(out, '🔑'), 'hello')
})

test('the ciphertext is runes and nothing else', () => {
  assert.match(stelegraphyEncrypt('The quick brown fox. 12345!', 'k'), RUNES)
})

test('the wrong key does not give the message back', () => {
  const out = stelegraphyEncrypt('Attack at dawn.', 'right')
  assert.notEqual(stelegraphyDecrypt(out, 'wrong'), 'Attack at dawn.')
})

test('an empty key falls back to the default rather than dividing by zero', () => {
  assert.equal(stelegraphyEncrypt('hello', ''), stelegraphyEncrypt('hello', 'stele'))
})

test('empty input stays empty in both directions', () => {
  assert.equal(stelegraphyEncrypt('', 'k'), '')
  assert.equal(stelegraphyDecrypt('', 'k'), '')
})

test('input that is not runes is refused rather than thrown', () => {
  assert.match(stelegraphyDecrypt('not runes at all', 'k'), /^Decryption Error:/)
})
