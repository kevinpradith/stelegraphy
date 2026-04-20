// ─── Cipher IDs ──────────────────────────────────────────────
export type CipherId = 'stelegraphy';

export type Category = 'Stèlegraphy';

export type Mode = 'encrypt' | 'decrypt';

// ─── Cipher Definition ────────────────────────────────────────
export interface CipherDef {
  readonly id: CipherId;
  readonly label: string;
  readonly category: Category;
  readonly description: string;
  /** If true, the cipher uses the exact same operation for both encryption and decryption. */
  readonly symmetric?: boolean;
  readonly needsKey?: boolean;
  readonly keyPlaceholder?: string;
}

// ─── Process Parameters ───────────────────────────────────────
export interface ProcessParams {
  key: string;
}
