'use client';

import type { CipherDef } from '@/types';
import ThemeToggle from './ThemeToggle';

interface TitlebarProps {
  cipher: CipherDef;
}

export default function Titlebar({ cipher }: TitlebarProps) {
  return (
    <header className="titlebar" role="banner">
      {/* macOS traffic lights */}
      <div className="traffic" aria-hidden="true">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
      </div>

      {/* Centered app name + cipher */}
      <div className="titlebar-center">
        <span className="titlebar-name">Stèle</span>
        <span className="titlebar-sep">—</span>
        <span className="titlebar-cipher">{cipher.label}</span>
      </div>

      <div className="titlebar-right">
        <ThemeToggle />
      </div>
    </header>
  );
}
