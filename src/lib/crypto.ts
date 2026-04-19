// ─── Caesar Cipher ───────────────────────────────────────────
export function caesarEncrypt(text: string, shift: number): string {
  shift = ((shift % 26) + 26) % 26;
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c >= 'a' ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
  });
}
export function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, -shift);
}

// ─── Vigenère Cipher ─────────────────────────────────────────
export function vigenereEncrypt(text: string, key: string): string {
  if (!key) return text;
  const k = key.toLowerCase().replace(/[^a-z]/g, '');
  if (!k.length) return text;
  let ki = 0;
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c >= 'a' ? 97 : 65;
    const shift = k[ki++ % k.length].charCodeAt(0) - 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
  });
}
export function vigenereDecrypt(text: string, key: string): string {
  if (!key) return text;
  const k = key.toLowerCase().replace(/[^a-z]/g, '');
  if (!k.length) return text;
  let ki = 0;
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c >= 'a' ? 97 : 65;
    const shift = k[ki++ % k.length].charCodeAt(0) - 97;
    return String.fromCharCode(((c.charCodeAt(0) - base - shift + 26) % 26) + base);
  });
}

// ─── ROT13 ───────────────────────────────────────────────────
export function rot13(text: string): string {
  return caesarEncrypt(text, 13);
}

// ─── Atbash ──────────────────────────────────────────────────
export function atbash(text: string): string {
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c >= 'a' ? 97 : 65;
    return String.fromCharCode(base + 25 - (c.charCodeAt(0) - base));
  });
}

// ─── XOR Cipher ──────────────────────────────────────────────
// Encrypt → text XOR key → hex pairs
// Decrypt → hex pairs XOR key → text
export function xorEncrypt(text: string, key: string): string {
  if (!key) return text;
  return Array.from(text)
    .map((c, i) =>
      (c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        .toString(16)
        .padStart(2, '0'),
    )
    .join(' ');
}
export function xorDecrypt(hexText: string, key: string): string {
  if (!key) return hexText;
  try {
    const bytes = hexText.trim().split(/\s+/);
    return bytes
      .map((h, i) =>
        String.fromCharCode(parseInt(h, 16) ^ key.charCodeAt(i % key.length)),
      )
      .join('');
  } catch {
    return 'Invalid XOR hex input';
  }
}

// ─── Base64 ──────────────────────────────────────────────────
export function base64Encode(text: string): string {
  try {
    // UTF-8 safe encoding
    return btoa(
      encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1: string) =>
        String.fromCharCode(parseInt(p1, 16)),
      ),
    );
  } catch {
    return 'Invalid input';
  }
}
export function base64Decode(text: string): string {
  try {
    return decodeURIComponent(
      Array.from(atob(text.trim()))
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
  } catch {
    return 'Invalid Base64';
  }
}

// ─── Hex ─────────────────────────────────────────────────────
export function textToHex(text: string): string {
  return Array.from(text)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join(' ');
}
export function hexToText(hex: string): string {
  try {
    const parts = hex.trim().split(/\s+/);
    if (parts.some((h) => !/^[0-9a-fA-F]{1,4}$/.test(h))) return 'Invalid hex';
    return parts.map((h) => String.fromCharCode(parseInt(h, 16))).join('');
  } catch {
    return 'Invalid hex';
  }
}

// ─── Binary ──────────────────────────────────────────────────
export function textToBinary(text: string): string {
  return Array.from(text)
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}
export function binaryToText(bin: string): string {
  try {
    const parts = bin.trim().split(/\s+/);
    if (parts.some((b) => !/^[01]{1,16}$/.test(b))) return 'Invalid binary';
    return parts.map((b) => String.fromCharCode(parseInt(b, 2))).join('');
  } catch {
    return 'Invalid binary';
  }
}

// ─── Morse Code ──────────────────────────────────────────────
const MORSE: Readonly<Record<string, string>> = {
  A: '.-',   B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.',  H: '....', I: '..',   J: '.---', K: '-.-', L: '.-..',
  M: '--',   N: '-.',   O: '---',  P: '.--.',  Q: '--.-', R: '.-.',
  S: '...',  T: '-',    U: '..-',  V: '...-',  W: '.--',  X: '-..-',
  Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--',
  '/': '-..-.', '@': '.--.-.', '&': '.-...', ':': '---...',
} as const;

const MORSE_REV: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k]),
);

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map((c) => (c === ' ' ? '/' : (MORSE[c] ?? '?')))
    .join(' ');
}
export function morseToText(morse: string): string {
  return morse
    .trim()
    .split(/\s+\/\s+/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => MORSE_REV[code] ?? '?')
        .join(''),
    )
    .join(' ');
}
