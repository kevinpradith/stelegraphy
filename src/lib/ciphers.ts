import type { Category, CipherDef } from '@/types';

export const CIPHERS: ReadonlyArray<CipherDef> = [

  {
    id: 'stelegraphy',
    label: 'Stèlegraphy',
    category: 'Stèlegraphy',
    description: 'Custom symmetric block cipher that outputs an encrypted ciphertext in Ancient Runes.',
    needsKey: true,
    keyPlaceholder: 'Master Secret Key',
  },
] as const;

export const CATEGORIES: ReadonlyArray<Category> = ['Stèlegraphy'];
