import type { Category, CipherDef } from '@/types'

export const CIPHERS: ReadonlyArray<CipherDef> = [
  {
    id: 'stelegraphy',
    label: 'Stèlegraphy',
    category: 'Stèlegraphy',
    description: 'A repeating-key XOR over Base64, written out in 64 Elder Futhark runes.',
    needsKey: true,
    keyPlaceholder: 'Master Secret Key',
  },
] as const

export const CATEGORIES: ReadonlyArray<Category> = ['Stèlegraphy']
