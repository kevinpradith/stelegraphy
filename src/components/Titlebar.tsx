'use client'

import ThemeToggle from './ThemeToggle'

export default function Titlebar() {
  return (
    <header className="titlebar" role="banner">
      {/* macOS traffic lights */}
      <div className="traffic" aria-hidden="true">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
      </div>

      {/* Centered app name */}
      <div className="titlebar-center">
        <span className="titlebar-name">Stèlegraphy</span>
      </div>

      <div className="titlebar-right">
        <ThemeToggle />
      </div>
    </header>
  )
}
