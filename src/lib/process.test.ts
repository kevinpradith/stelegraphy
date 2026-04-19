import { describe, expect, it } from 'vitest';
import { process } from './process';
import type { CipherId } from '@/types';

const params = { shift: 4, key: 'alpha' };

function roundTrip(id: CipherId, plain: string, symmetric: boolean) {
  if (symmetric) {
    const once = process(id, plain, 'encrypt', params);
    const twice = process(id, once, 'encrypt', params);
    expect(twice).toBe(plain);
    return;
  }
  const enc = process(id, plain, 'encrypt', params);
  const dec = process(id, enc, 'decrypt', params);
  expect(dec).toBe(plain);
}

describe('process()', () => {
  it('Caesar round-trip', () =>
    roundTrip('caesar', 'Mixed Case 9!', false));

  it('Vigenère round-trip', () =>
    roundTrip('vigenere', 'Secret MESSAGE!', false));

  it('XOR round-trip', () => roundTrip('xor', 'Binary\x00safe', false));

  it('symmetric ciphers self-inverse', () => {
    roundTrip('rot13', 'Test 1', true);
    roundTrip('atbash', 'Zebra', true);
  });

  it('encodings round-trip', () => {
    const t = 'Line1\nLine2';
    roundTrip('base64', t, false);
    roundTrip('hex', t, false);
    roundTrip('binary', t, false);
    roundTrip('morse', 'SOS TEST', false);
  });

  it('does not throw on any cipher id', () => {
    const ids: CipherId[] = [
      'caesar',
      'vigenere',
      'rot13',
      'atbash',
      'xor',
      'base64',
      'hex',
      'binary',
      'morse',
    ];
    for (const id of ids) {
      expect(() =>
        process(id, 'x', 'encrypt', params),
      ).not.toThrow();
      expect(() =>
        process(id, 'x', 'decrypt', params),
      ).not.toThrow();
    }
  });
});
