import Link from 'next/link'
import { Send, Globe, Zap, TrendingUp, Star, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

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
    { href: '/kategori/altcoin', label: 'Altcoin Kanalları' },
    { href: '/kategori/nft', label: 'NFT Kanalları' },
  ],
  Kurumsal: [
    { href: '/blog', label: 'Analiz Blogu' },
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/iletisim', label: 'İletişim' },
    { href: '/sitemap.xml', label: 'Site Haritası' },
  ],
}

/* SEO internal linking cloud */
const popularSearches = [
  { href: '/en-iyi-telegram-kanallari', label: 'En İyi Telegram Kanalları' },
  { href: '/turk-telegram-kripto-kanallari', label: 'Türk Kripto Kanalları' },
  { href: '/turk-telegram-sinyal-kanallari', label: 'Türk Sinyal Kanalları' },
  { href: '/guvenilir-telegram-sinyal-kanallari', label: 'Güvenilir Sinyal Kanalları' },
  { href: '/ucretsiz-telegram-kripto-kanallari', label: 'Ücretsiz Kripto Kanalları' },
  { href: '/premium-telegram-kripto-kanallari', label: 'Premium Kanallar' },
  { href: '/bitcoin-telegram-kanallari', label: 'Bitcoin Kanalları' },
  { href: '/binance-telegram-kanallari', label: 'Binance Kanalları' },
  { href: '/trending-telegram-kanallari', label: 'Trending Kanallar' },
  { href: '/yeni-telegram-kanallari', label: 'Yeni Kanallar' },
  { href: '/en-cok-kazanilan-kanallar', label: 'En Çok Kazanılan' },
]

export default async function Footer() {
  // Fetch sponsor links from DB
  const supabase = await createClient()
  const { data: sponsorData } = await supabase.from('site_settings').select('value').eq('key', 'ad_footer_sponsors').single()
  const sponsors = (sponsorData?.value as { links: { text: string; url: string }[]; isActive: boolean } | null)

  return (
    <footer className="bg-[var(--bg-card)] border-t border-[var(--border-default)] mt-20 pt-16 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Sponsor Links Section */}
        {sponsors?.isActive && sponsors.links?.length > 0 && (
          <div className="mb-12 pb-8 border-b border-[var(--border-default)]">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Sponsorlu Bağlantılar</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {sponsors.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer Top */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base text-[var(--text-primary)] tracking-tight">
                TelegramKriptoKanallari
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5 font-medium">
              Türkiye&apos;nin en şeffaf kripto para kanalları dizini. Uzman kadro tarafından incelenmiş Telegram sinyal gruplarını keşfedin.
            </p>
            <div className="flex gap-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-subtle)] transition-all border border-[var(--border-default)]">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-subtle)] transition-all border border-[var(--border-default)]">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Popular Searches — SEO Internal Link Cloud */}
        <div className="mb-10 pb-8 border-t border-[var(--border-default)] pt-8">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Popüler Aramalar</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--brand-primary)] transition-all border border-[var(--border-default)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[var(--border-default)] py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-semibold text-[var(--text-muted)] text-center sm:text-left">
            © {new Date().getFullYear()} telegramkriptokanallari.com — Kripto paralarda işlem yapmak yüksek risk taşır. Sitemizde listelenen hiçbir telegram grubundaki mesajlar yatırım tavsiyesi (YTD) değildir.
          </p>
          <div className="flex gap-4">
            <Link href="/gizlilik-politikasi" className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">Gizlilik Politikası</Link>
            <Link href="/kullanim-kosullari" className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
