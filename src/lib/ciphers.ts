import type { Category, CipherDef } from '@/types';

export const CIPHERS: ReadonlyArray<CipherDef> = [
  {
    id: 'caesar',
    label: 'Caesar',
    category: 'Classical',
    description: 'Shifts each letter by a fixed number of positions in the alphabet.',
    needsShift: true,
  },
  {
    id: 'vigenere',
    label: 'Vigenère',
    category: 'Classical',
    description: 'Polyalphabetic substitution cipher using a repeating keyword.',
    needsKey: true,
    keyPlaceholder: 'Alphabetic key',
  },
  {
    id: 'rot13',
    label: 'ROT-13',
    category: 'Classical',
    description: 'Rotates each letter 13 positions. Applying it twice returns the original.',
    symmetric: true,
  },
  {
    id: 'atbash',
    label: 'Atbash',
    category: 'Classical',
    description: 'Mirrors the alphabet so A↔Z, B↔Y. Applying it twice returns the original.',
    symmetric: true,
  },
  {
    id: 'xor',
    label: 'XOR',
    category: 'Classical',
    description: 'XORs each character with a key; encrypts to hex pairs, decrypts from hex pairs.',
    needsKey: true,
    keyPlaceholder: 'Any string key',
  },
  {
    id: 'base64',
    label: 'Base64',
    category: 'Encoding',
    description: 'Encodes binary data as printable ASCII using 64 safe characters.',
  },
  {
    id: 'hex',
    label: 'Hex',
    category: 'Encoding',
    description: 'Converts each character to its two-digit hexadecimal byte value.',
  },
  {
    id: 'binary',
    label: 'Binary',
    category: 'Encoding',
    description: 'Converts each character to its 8-bit binary representation.',
  },
  {
    id: 'morse',
    label: 'Morse',
    category: 'Encoding',
    description: 'International Morse Code. Letters separated by spaces, words by " / ".',
  },
] as const;

export const CATEGORIES: ReadonlyArray<Category> = ['Classical', 'Encoding'];
