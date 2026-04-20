/**
 * Stèlegraphy - Core Cryptographic Mechanism
 * 
 * This module defines the custom Stèlegraphy cipher. It utilizes a deterministic 
 * 3-phase transformation process:
 * 1. XOR Masking: The plaintext is scrambled using the provided Master Key.
 * 2. Base64 Normalization: The scrambled bytes are stabilized into a predictable 64-character set.
 * 3. Runic Translation: The Base64 output is mapped deterministically into visual Ancient Runes.
 */
const B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const RUNE_CHARS = "ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚲᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿᛀᛁᛂᛃᛄᛅᛆᛇᛈᛉᛊᛋᛌᛍᛎᛏᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟ";

function b64ToRunes(b64: string): string {
  return b64.replace(/./g, char => {
    if (char === '=') return '᛫';
    const idx = B64_CHARS.indexOf(char);
    return idx >= 0 ? RUNE_CHARS[idx] : char;
  });
}

function runesToB64(runes: string): string {
  return Array.from(runes.trim()).map(char => {
    if (char === '᛫') return '=';
    const idx = RUNE_CHARS.indexOf(char);
    return idx >= 0 ? B64_CHARS[idx] : char;
  }).join('');
}

class Stelegraphy {
  private key: string;

  constructor(key: string) {
    this.key = key || "stele";
  }

  encrypt(plaintext: string): string {
    // Phase 1: Serialization
    // Convert plaintext into URI-safe UTF-8 format to safely handle emojis and special characters.
    const encodedStr = encodeURIComponent(plaintext);

    // Phase 2: XOR Masking
    // Perform a bitwise Exclusive-OR (XOR) operation sequentially matching each character of 
    // the serialized string against the cyclic Master Key.
    const xored = Array.from(encodedStr).map((char, i) => {
      const charCode = char.charCodeAt(0);
      const keyChar = this.key.charCodeAt(i % this.key.length);
      return String.fromCharCode(charCode ^ keyChar);
    }).join('');
    
    // Phase 3: Base64 Normalization
    // Encode the randomized XOR bytes into standard Base64 to restrict the output to 64 known characters.
    const b64 = btoa(xored);

    // Phase 4: Runic Translation
    // Map the standard Base64 characters to their visually aesthetic Ancient Runic equivalents.
    return b64ToRunes(b64);
  }

  decrypt(runesStr: string): string {
    try {
      // Phase 1: Base64 Reversion
      // Revert the visually aesthetic Ancient Runes back into standard Base64 string data.
      const b64 = runesToB64(runesStr);

      // Phase 2: Base64 Decoding
      // Decode the Base64 format back into the raw XOR-scrambled bytes.
      const xored = atob(b64);

      // Phase 3: XOR Unmasking
      // Run the exact same XOR operation using the exact same Master Key.
      // Since XOR is symmetric (A ^ B ^ B = A), this reverts the text back to URI-encoded state.
      const decodedStr = Array.from(xored).map((char, i) => {
        const charCode = char.charCodeAt(0);
        const keyChar = this.key.charCodeAt(i % this.key.length);
        return String.fromCharCode(charCode ^ keyChar);
      }).join('');
      
      // Phase 4: Deserialization
      // Safely decode the URI string back into the original human-readable plaintext.
      return decodeURIComponent(decodedStr);
    } catch {
      throw new Error("Invalid Runic ciphertext or incorrect Master Key.");
    }
  }
}

export function stelegraphyEncrypt(text: string, key: string): string {
  if (!text) return '';
  try {
    return new Stelegraphy(key).encrypt(text);
  } catch (err) {
    return `Encryption Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

export function stelegraphyDecrypt(text: string, key: string): string {
  if (!text) return '';
  try {
    return new Stelegraphy(key).decrypt(text);
  } catch (err) {
    return `Decryption Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}
