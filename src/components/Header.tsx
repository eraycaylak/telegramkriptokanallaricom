'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, TrendingUp, Compass, BookOpen, PlusCircle, Star, ChevronDown } from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'

const navLinks = [
  { href: '/kanallar', label: 'Kanallar', icon: Compass },
  { href: '/en-iyi-kanallar', label: 'En İyiler', icon: Star },
  { href: '/trending', label: '🔥 Trending', icon: TrendingUp },
  { href: '/kategoriler', label: 'Kategoriler', icon: ChevronDown },
  { href: '/blog', label: 'Blog', icon: BookOpen },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [btcPrice, setBtcPrice] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // BTC Price Ticker
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true')
        const data = await res.json()
        if (data.bitcoin) {
          const price = data.bitcoin.usd.toLocaleString('en-US', { maximumFractionDigits: 0 })
          const change = data.bitcoin.usd_24h_change?.toFixed(1)
          setBtcPrice(`$${price}`)
        }
      } catch {}
    }
    fetchPrice()
    const interval = setInterval(fetchPrice, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* BTC Ticker Strip */}
      {btcPrice && (
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-default)] text-[var(--text-muted)] text-[11px] font-semibold hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-7">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-500">₿</span> BTC: <span className="stat-number text-[var(--text-primary)] font-bold">{btcPrice}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <Link href="/kanal-ekle" className="text-[var(--brand-primary)] hover:underline font-bold">Kanal Ekle — Ücretsiz</Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className={`sticky top-0 z-50 glass border-b border-[var(--border-default)] transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className={`flex items-center justify-center transition-all duration-300 ${scrolled ? 'w-7 h-7' : 'w-8 h-8 sm:w-9 sm:h-9'}`}>
                <img src="/telegram.svg" alt="Telegram Logo" className="w-full h-full object-contain" />
              </div>
              <span className={`font-extrabold text-[var(--text-primary)] tracking-tight leading-tight transition-all duration-300 ${scrolled ? 'text-sm' : 'text-sm sm:text-base'}`}>
                TelegramKripto<br className="sm:hidden" />Kanallari
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-muted)] transition-all font-semibold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-1.5">
              <Link href="/kanallar" className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-muted)] transition-all" title="Ara">
                <Search className="w-4 h-4" />
              </Link>
              
              <DarkModeToggle />

              <Link href="/kanal-ekle" className="hidden sm:inline-flex btn-primary text-xs py-2 px-4 shadow-sm animate-pulse-glow">
                <PlusCircle className="w-3.5 h-3.5" /> Kanal Ekle
              </Link>

              <Link href="/giris" className="hidden sm:inline-flex btn-ghost text-xs py-2 px-3">
                Giriş
              </Link>

              <button
                className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-muted)] transition-all"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menüyü aç"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {menuOpen && (
            <div className="lg:hidden border-t border-[var(--border-default)] py-3 space-y-1 bg-[var(--bg-card)] animate-fade-in-up">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-muted)] transition-all font-semibold"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
              <div className="flex gap-2 pt-3 px-4 border-t border-[var(--border-default)] mt-2">
                <Link href="/giris" className="btn-secondary text-sm py-2.5 flex-1 justify-center" onClick={() => setMenuOpen(false)}>Giriş</Link>
                <Link href="/kanal-ekle" className="btn-primary text-sm py-2.5 flex-1 justify-center" onClick={() => setMenuOpen(false)}>Kanal Ekle</Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
