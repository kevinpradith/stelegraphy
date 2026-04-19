import { useState, useCallback } from 'react';

interface IOPaneProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isReadonly: boolean;
  showWordCount?: boolean;
  showCopy?: boolean;
}

export default function IOPane({
  id,
  label,
  value,
  onChange,
  placeholder,
  isReadonly,
  showWordCount,
  showCopy,
}: IOPaneProps) {
  const [copied, setCopied] = useState(false);

  const wordCount = value.trim()
    ? value.trim().split(/\s+/).length
    : 0;

  const handleCopy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — silently fail
    }
  }, [value]);

  return (
    <div className="io-panel">
      {/* ── Label bar */}
      <div className="io-label-bar">
        <span className="io-label" id={`${id}-label`}>
          {label}
        </span>

        {!isReadonly && (
          <button
            className="io-action"
            onClick={() => onChange('')}
            disabled={!value}
            aria-label="Clear input"
          >
            Clear
          </button>
        )}

        {showCopy && (
          <button
            className={`io-action${copied ? ' is-copied' : ''}`}
            onClick={handleCopy}
            disabled={!value}
            aria-label="Copy output"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>

      {/* ── Textarea */}
      <textarea
        className={`io-textarea${isReadonly ? ' is-output' : ''}`}
        id={id}
        aria-labelledby={`${id}-label`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={isReadonly}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />

      {/* ── Footer stats */}
      <div className="io-footer">
        <span className="io-stat">{value.length} chars</span>
        {showWordCount && (
          <span className="io-stat">{wordCount} words</span>
        )}
      </div>
    </div>
  );
}
