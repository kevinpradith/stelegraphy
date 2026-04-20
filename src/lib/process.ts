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
  const { key } = params;
  try {
    switch (id) {
      case 'stelegraphy':
        return mode === 'encrypt' ? C.stelegraphyEncrypt(input, key) : C.stelegraphyDecrypt(input, key);

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
