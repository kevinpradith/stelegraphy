import IOPane from './IOPane';
import SwapButton from './SwapButton';

interface IOGridProps {
  input: string;
  output: string;
  onInputChange: (value: string) => void;
  onSwap: () => void;
}

export default function IOGrid({
  input,
  output,
  onInputChange,
  onSwap,
}: IOGridProps) {
  return (
    <div className="io-grid">
      <IOPane
        id="io-input"
        label="Input"
        value={input}
        onChange={onInputChange}
        placeholder="Type or paste text here…"
        isReadonly={false}
        showWordCount
      />

      <div className="swap-col">
        <SwapButton onClick={onSwap} disabled={!output} />
      </div>

      <IOPane
        id="io-output"
        label="Output"
        value={output}
        onChange={() => {}}
        placeholder="Output appears here…"
        isReadonly
        showCopy
      />
    </div>
  );
}
