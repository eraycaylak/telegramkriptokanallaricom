import Link from 'next/link'
import { Zap, Send, Globe } from 'lucide-react'

const footerLinks = {
  Kanallar: [
    { href: '/en-iyi-kanallar', label: 'En İyi Kanallar' },
    { href: '/yeni-kanallar', label: 'Yeni Doğrulananlar' },
    { href: '/trending', label: 'Trend Kanallar' },
    { href: '/kanal-ekle', label: 'Ücretsiz Kanal Ekle' },
  ],
  Kategoriler: [
    { href: '/kategori/sinyal', label: 'Kripto Sinyalleri' },
    { href: '/kategori/haber', label: 'Sıcak Haberler' },
    { href: '/kategori/bitcoin', label: 'Bitcoin (BTC)' },
    { href: '/kategori/defi', label: 'DeFi Projeleri' },
  ],
  Kurumsal: [
    { href: '/blog', label: 'Analiz Blogu' },
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/iletisim', label: 'İletişim' },
    { href: '/sitemap.xml', label: 'Site Haritası' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                TelegramKriptoKanallari
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
              Türkiye&apos;nin en şeffaf kripto para kanalları dizini. Uzman kadro tarafından incelenmiş on binlerce üyelik Telegram sinyal gruplarını keşfedin.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-200">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-200">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm font-medium text-slate-500 hover:text-blue-700 hover:underline transition-all">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-200 py-8 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-semibold text-slate-400 mb-2">
            © {new Date().getFullYear()} telegramkriptokanallari.com — Kripto paralarda işlem yapmak yüksek risk taşır. Sitemizde listelenen hiçbir telegram grubundaki mesajlar yatırım tavsiyesi (YTD) değildir.
          </p>
          <div className="flex gap-4">
            <Link href="/gizlilik-politikasi" className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors">Gizlilik Politikası</Link>
            <Link href="/kullanim-kosullari" className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
