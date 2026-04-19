import type { Mode } from '@/types';

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

/**
 * Sliding-pill segmented control for Encrypt / Decrypt.
 * The dark indicator translates horizontally via CSS Spring transition.
 */
export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="mode-toggle" role="group" aria-label="Cipher mode">
      {/* The sliding dark pill — purely decorative, aria-hidden */}
      <div
        className={`mode-toggle-track${mode === 'decrypt' ? ' is-decrypt' : ''}`}
        aria-hidden="true"
      />

      <button
        className={`mode-toggle-btn${mode === 'encrypt' ? ' is-active' : ''}`}
        onClick={() => onChange('encrypt')}
        aria-pressed={mode === 'encrypt'}
      >
        Encrypt
      </button>

      <button
        className={`mode-toggle-btn${mode === 'decrypt' ? ' is-active' : ''}`}
        onClick={() => onChange('decrypt')}
        aria-pressed={mode === 'decrypt'}
      >
        Decrypt
      </button>
    </div>
  );
}
