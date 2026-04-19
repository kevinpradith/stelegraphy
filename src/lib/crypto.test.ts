import { describe, expect, it } from 'vitest';
import * as C from './crypto';

describe('Caesar', () => {
  it('round-trips', () => {
    const plain = 'The Quick Brown Fox 123!';
    expect(C.caesarDecrypt(C.caesarEncrypt(plain, 7), 7)).toBe(plain);
  });
  it('handles non-finite shift as 0', () => {
    expect(C.caesarEncrypt('Ab', Number.NaN)).toBe('Ab');
  });
});

describe('Vigenère', () => {
  it('round-trips', () => {
    const plain = 'Attack at dawn!';
    const key = 'LeMon';
    expect(C.vigenereDecrypt(C.vigenereEncrypt(plain, key), key)).toBe(plain);
  });
  it('empty or non-alpha key leaves text unchanged', () => {
    expect(C.vigenereEncrypt('Hello', '')).toBe('Hello');
    expect(C.vigenereEncrypt('Hello', '123')).toBe('Hello');
  });
});

describe('ROT-13', () => {
  it('is self-inverse', () => {
    expect(C.rot13(C.rot13('Why 123?'))).toBe('Why 123?');
  });
});

describe('Atbash', () => {
  it('is self-inverse', () => {
    expect(C.atbash(C.atbash('Az test 9'))).toBe('Az test 9');
  });
});

describe('XOR', () => {
  it('round-trips via hex', () => {
    const plain = 'Secret\x00msg';
    const key = 'k';
    const hex = C.xorEncrypt(plain, key);
    expect(C.xorDecrypt(hex, key)).toBe(plain);
  });
  it('rejects invalid hex bytes', () => {
    expect(C.xorDecrypt('gg', 'k')).toBe('Invalid XOR hex input');
    expect(C.xorDecrypt('1', 'k')).toBe('Invalid XOR hex input');
  });
  it('empty output for empty hex when key set', () => {
    expect(C.xorDecrypt('   ', 'k')).toBe('');
  });
});

describe('Base64', () => {
  it('round-trips ASCII and Unicode', () => {
    const a = 'Hello';
    expect(C.base64Decode(C.base64Encode(a))).toBe(a);
    const u = '你好 🪨';
    expect(C.base64Decode(C.base64Encode(u))).toBe(u);
  });
});

describe('Hex', () => {
  it('round-trips space-separated and continuous', () => {
    const plain = 'AB×';
    const spaced = C.textToHex(plain);
    expect(C.hexToText(spaced)).toBe(plain);
    const compact = spaced.replace(/\s+/g, '');
    expect(C.hexToText(compact)).toBe(plain);
  });
  it('rejects odd-length hex', () => {
    expect(C.hexToText('414')).toBe('Invalid hex');
  });
});

describe('Binary', () => {
  it('round-trips spaced and compact', () => {
    const plain = 'OK';
    const spaced = C.textToBinary(plain);
    expect(C.binaryToText(spaced)).toBe(plain);
    expect(C.binaryToText(spaced.replace(/\s+/g, ''))).toBe(plain);
  });
  it('rejects wrong bit length or non-binary', () => {
    expect(C.binaryToText('0101010')).toBe('Invalid binary');
    expect(C.binaryToText('010101011')).toBe('Invalid binary');
    expect(C.binaryToText('02000000')).toBe('Invalid binary');
  });
});

describe('Morse', () => {
  it('round-trips letters and words', () => {
    const a = 'HELLO WORLD';
    const m = C.textToMorse(a);
    expect(C.morseToText(m)).toBe(a);
  });
  it('accepts slash without surrounding spaces', () => {
    const compact = C.textToMorse('A B').replace(/\s*\/\s*/, '/');
    expect(C.morseToText(compact)).toBe('A B');
  });
});
