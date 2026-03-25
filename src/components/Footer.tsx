import Link from 'next/link'
import { Zap, Send, Globe } from 'lucide-react'

const footerLinks = {
  Kanallar: [
    { href: '/en-iyi-kanallar', label: 'En İyi Kanallar' },
    { href: '/yeni-kanallar', label: 'Yeni Kanallar' },
    { href: '/trending', label: 'Trending' },
    { href: '/kanal-ekle', label: 'Kanal Ekle' },
  ],
  Kategoriler: [
    { href: '/kategori/sinyal', label: 'Sinyal Kanalları' },
    { href: '/kategori/haber', label: 'Haber Kanalları' },
    { href: '/kategori/bitcoin', label: 'Bitcoin Kanalları' },
    { href: '/kategori/defi', label: 'DeFi Kanalları' },
  ],
  Sayfa: [
    { href: '/blog', label: 'Blog' },
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/iletisim', label: 'İletişim' },
    { href: '/sitemap.xml', label: 'Sitemap' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">
                <span className="gradient-text">KriptoKanal</span>
                <span className="text-slate-500">.com</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Türkiye&apos;nin en kapsamlı Telegram kripto kanalları dizini. En iyi Bitcoin, Ethereum sinyal ve haber kanallarını keşfet.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} telegramkriptokanallari.com — Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4">
            <Link href="/gizlilik-politikasi" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Gizlilik Politikası</Link>
            <Link href="/kullanim-kosullari" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
