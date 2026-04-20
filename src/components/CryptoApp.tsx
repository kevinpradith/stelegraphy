'use client';

import { useState, useCallback } from 'react';
import { CIPHERS } from '@/lib/ciphers';
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
  const [selected] = useState<CipherId>('stelegraphy');
  const [mode, setMode] = useState<Mode>('encrypt');
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');

  // Derived state
  const cipher = CIPHERS.find((c) => c.id === selected)!;
  const output = input
    ? process(selected, input, mode, { key })
    : '';

  const handleSwap = useCallback(() => {
    if (!output) return;
    setInput(output);
    if (!cipher.symmetric) {
      setMode((m) => (m === 'encrypt' ? 'decrypt' : 'encrypt'));
    }
  }, [cipher.symmetric, output]);



  return (
    <div className="app">
      <Titlebar cipher={cipher} />

      <div className="layout">
        <Sidebar />

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

          {/* ── Optional params (key) */}
          {cipher.needsKey && (
            <ParamsBar
              cipher={cipher}
              keyValue={key}
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
