import type { CipherDef } from '@/types';

interface ParamsBarProps {
  cipher: CipherDef;
  keyValue: string;
  onKeyChange: (key: string) => void;
}

export default function ParamsBar({
  cipher,
  keyValue,
  onKeyChange,
}: ParamsBarProps) {
  return (
    <div className="params-bar">
      {cipher.needsKey && (
        <div className="param-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="param-label" htmlFor="param-key">
              Key
            </label>
            <button
              className="io-action"
              onClick={() => onKeyChange('')}
              disabled={keyValue.length === 0}
              aria-label="Clear key"
              type="button"
            >
              Clear
            </button>
          </div>
          <input
            id="param-key"
            type="text"
            className="param-input param-input-wide"
            placeholder={cipher.keyPlaceholder ?? 'Key'}
            value={keyValue}
            onChange={(e) => onKeyChange(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}
