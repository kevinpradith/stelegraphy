'use client';

import { useState, useCallback } from 'react';
import { CIPHERS, CATEGORIES } from '@/lib/ciphers';
import { process } from '@/lib/process';
import type { CipherId, Mode } from '@/types';
import Titlebar from './Titlebar';
import Sidebar from './Sidebar';
import ModeToggle from './ModeToggle';
import ParamsBar from './ParamsBar';
import IOGrid from './IOGrid';

/**
 * CryptoApp — the single interactive entry point.
 * Marked 'use client' so all state & event handlers live here;
 * child components inherit the client context without needing their own directive.
 */
export default function CryptoApp() {
  const [selected, setSelected] = useState<CipherId>('caesar');
  const [mode, setMode] = useState<Mode>('encrypt');
  const [input, setInput] = useState('');
  const [shift, setShift] = useState(3);
  const [key, setKey] = useState('');

  // Derived state
  const cipher = CIPHERS.find((c) => c.id === selected)!;
  const output = input
    ? process(selected, input, mode, { shift, key })
    : '';

  const handleSelectCipher = useCallback((id: CipherId) => {
    setSelected(id);
    setInput('');
  }, []);

  const handleSwap = useCallback(() => {
    if (!output) return;
    setInput(output);
    if (!cipher.symmetric) {
      setMode((m) => (m === 'encrypt' ? 'decrypt' : 'encrypt'));
    }
  }, [cipher.symmetric, output]);

  // Display mode: symmetric ciphers don't have a meaningful mode
  const displayMode: Mode = cipher.symmetric ? 'encrypt' : mode;

  return (
    <div className="app">
      <Titlebar cipher={cipher} mode={displayMode} />

      <div className="layout">
        <Sidebar
          ciphers={CIPHERS}
          categories={CATEGORIES}
          selected={selected}
          onSelect={handleSelectCipher}
        />

        <main className="main">
          {/* ── Panel header: title + mode toggle */}
          <div className="panel-header">
            <div className="panel-title-group">
              <h1 className="cipher-title">{cipher.label}</h1>
              <p className="cipher-desc">{cipher.description}</p>
            </div>

            {!cipher.symmetric && (
              <ModeToggle mode={mode} onChange={setMode} />
            )}
          </div>

          {/* ── Optional params (shift / key) */}
          {(cipher.needsShift || cipher.needsKey) && (
            <ParamsBar
              cipher={cipher}
              shift={shift}
              keyValue={key}
              onShiftChange={setShift}
              onKeyChange={setKey}
            />
          )}

          {/* ── IO panels */}
          <IOGrid
            input={input}
            output={output}
            onInputChange={setInput}
            onSwap={handleSwap}
          />
        </main>
      </div>
    </div>
  );
}
