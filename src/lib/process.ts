import type { CipherId, Mode, ProcessParams } from '@/types';
import * as C from './crypto';

/**
 * Dispatch cipher operation based on id and mode.
 * Exhaustive switch ensures TypeScript warns if a new CipherId is added without updating here.
 */
export function process(
  id: CipherId,
  input: string,
  mode: Mode,
  params: ProcessParams,
): string {
  const { shift, key } = params;
  try {
    switch (id) {
      case 'caesar':
        return mode === 'encrypt'
          ? C.caesarEncrypt(input, shift)
          : C.caesarDecrypt(input, shift);

      case 'vigenere':
        return mode === 'encrypt'
          ? C.vigenereEncrypt(input, key)
          : C.vigenereDecrypt(input, key);

      case 'rot13':
        return C.rot13(input);

      case 'atbash':
        return C.atbash(input);

      case 'xor':
        return mode === 'encrypt'
          ? C.xorEncrypt(input, key)
          : C.xorDecrypt(input, key);

      case 'base64':
        return mode === 'encrypt' ? C.base64Encode(input) : C.base64Decode(input);

      case 'hex':
        return mode === 'encrypt' ? C.textToHex(input) : C.hexToText(input);

      case 'binary':
        return mode === 'encrypt' ? C.textToBinary(input) : C.binaryToText(input);

      case 'morse':
        return mode === 'encrypt' ? C.textToMorse(input) : C.morseToText(input);

      default: {
        // Exhaustiveness check — TypeScript will error here if a CipherId is unhandled
        const _never: never = id;
        return _never;
      }
    }
  } catch (e) {
    return `Error: ${e instanceof Error ? e.message : String(e)}`;
  }
}
