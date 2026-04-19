import type { CipherDef } from '@/types';

interface ParamsBarProps {
  cipher: CipherDef;
  shift: number;
  keyValue: string;
  onShiftChange: (shift: number) => void;
  onKeyChange: (key: string) => void;
}

export default function ParamsBar({
  cipher,
  shift,
  keyValue,
  onShiftChange,
  onKeyChange,
}: ParamsBarProps) {
  return (
    <div className="params-bar">
      {cipher.needsShift && (
        <div className="param-field">
          <label className="param-label" htmlFor="param-shift">
            Shift
          </label>
          <input
            id="param-shift"
            type="number"
            min={-25}
            max={25}
            className="param-input"
            value={shift}
            onChange={(e) => onShiftChange(Number(e.target.value))}
          />
        </div>
      )}

      {cipher.needsKey && (
        <div className="param-field">
          <label className="param-label" htmlFor="param-key">
            Key
          </label>
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
