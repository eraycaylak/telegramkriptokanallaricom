'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap, Search } from 'lucide-react'

const navLinks = [
  { href: '/kanallar', label: 'Kanallar' },
  { href: '/en-iyi-kanallar', label: 'En İyiler' },
  { href: '/trending', label: '🔥 Trending' },
  { href: '/kategoriler', label: 'Kategoriler' },
  { href: '/blog', label: 'Blog' },
  { href: '/kanal-ekle', label: 'Kanal Ekle' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/50 transition-shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base hidden sm:block">
              <span className="gradient-text">KriptoKanal</span>
              <span className="text-slate-400">.com</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link href="/kanallar" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Search className="w-4 h-4" />
            </Link>
            <Link href="/giris" className="btn-secondary text-sm py-1.5 px-4 hidden sm:inline-flex">
              Giriş Yap
            </Link>
            <Link href="/kayit" className="btn-primary text-sm py-1.5 px-4 hidden sm:inline-flex">
              Üye Ol
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/5 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 px-1">
              <Link href="/giris" className="btn-secondary text-sm py-2 flex-1 justify-center">Giriş</Link>
              <Link href="/kayit" className="btn-primary text-sm py-2 flex-1 justify-center">Üye Ol</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
