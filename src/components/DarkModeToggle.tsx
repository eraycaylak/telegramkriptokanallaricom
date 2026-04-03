'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored === 'dark' || (!stored && prefersDark)
    setDark(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggle = () => {
    const html = document.documentElement
    // Enable transition temporarily
    html.classList.add('dark-transition')
    
    if (dark) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
    setDark(!dark)

    // Disable transition after animation completes
    setTimeout(() => html.classList.remove('dark-transition'), 500)
  }

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-transparent" aria-label="Tema değiştir">
        <div className="w-4 h-4" />
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-xl transition-all duration-300 hover:bg-[var(--bg-muted)] group"
      aria-label={dark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
      title={dark ? 'Aydınlık Mod' : 'Karanlık Mod'}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`w-5 h-5 absolute inset-0 text-amber-500 transition-all duration-300 ${
            dark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          className={`w-5 h-5 absolute inset-0 text-blue-400 transition-all duration-300 ${
            dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
          }`}
        />
      </div>
    </button>
  )
}
