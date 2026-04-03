'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, TrendingUp, Search, PlusCircle } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Ana Sayfa' },
  { href: '/kanallar', icon: Compass, label: 'Kanallar' },
  { href: '/trending', icon: TrendingUp, label: 'Trend' },
  { href: '/kanallar?q=', icon: Search, label: 'Ara' },
  { href: '/kanal-ekle', icon: PlusCircle, label: 'Ekle' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-[var(--bg-card)] border-[var(--border-default)] safe-area-bottom" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-[var(--brand-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-semibold leading-none ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
