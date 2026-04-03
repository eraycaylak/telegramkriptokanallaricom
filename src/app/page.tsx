export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ChannelCard from '@/components/ChannelCard'
import AdBanner from '@/components/AdBanner'
import MostClicked from '@/components/MostClicked'
import { ArrowRight, TrendingUp, Star, ShieldCheck, Zap, Users, Shield, MessageSquare, ChevronRight, Flame } from 'lucide-react'
import { ChannelWithCategory, Category } from '@/lib/types'

async function getData() {
  const supabase = await createClient()
  const [featuredRes, newRes, trendingRes, categoriesRes] = await Promise.all([
    supabase.from('channels').select('*, categories(*)').eq('is_approved', true).eq('is_featured', true).order('votes', { ascending: false }).limit(5),
    supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('created_at', { ascending: false }).limit(6),
    supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('trending_score', { ascending: false, nullsFirst: false }).order('votes', { ascending: false }).limit(10),
    supabase.from('categories').select('*').order('channel_count', { ascending: false }),
  ])
  return {
    featured: (featuredRes.data ?? []) as ChannelWithCategory[],
    newest: (newRes.data ?? []) as ChannelWithCategory[],
    trending: (trendingRes.data ?? []) as ChannelWithCategory[],
    categories: (categoriesRes.data ?? []) as Category[],
  }
}

export default async function HomePage() {
  const { featured, newest, trending, categories } = await getData()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Telegram kripto kanalları nedir?',
        acceptedAnswer: { '@type': 'Answer', text: 'Telegram kripto kanalları, kripto para piyasaları hakkında teknik analiz, temel analiz, alım-satım sinyalleri ve güncel haberler paylaşılan küresel ve yerel Telegram topluluklarıdır.' }
      },
      {
        '@type': 'Question',
        name: 'En iyi telegram kanalları hangileri?',
        acceptedAnswer: { '@type': 'Answer', text: 'En iyi telegram kripto kanalları kişisel trade stratejinize göre değişmekle birlikte; platformumuzda onaylanmış, düzenli paylaşımlar yapan ve kullanıcı oylarıyla Top listelerinde liderliğini koruyan kanallardır.' }
      },
      {
        '@type': 'Question',
        name: 'Telegram sinyal kanalları güvenilir mi?',
        acceptedAnswer: { '@type': 'Answer', text: 'Tüm sinyal kanalları güvenilir diyemeyiz. Güvenilir olanlar şeffaf işlem geçmişlerini paylaşan, risk yönetimine odaklanan, yüksek etkileşimli ve garanti kazanç gibi asılsız vaatlerde bulunmayan gruplardır.' }
      }
    ]
  }

  return (
    <>
      {/* ═══ HERO SECTION — Dark gradient bg ═══ */}
      <section className="hero-bg text-white overflow-hidden relative">
        {/* Glow effects */}
        <div className="hero-glow w-[500px] h-[500px] bg-blue-500/20 -top-40 -right-40 absolute" />
        <div className="hero-glow w-[400px] h-[400px] bg-cyan-500/15 -bottom-32 -left-32 absolute" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 text-center relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-[11px] font-bold uppercase tracking-wide backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" /> Doğrulanmış Kanallar
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wide backdrop-blur-sm">
              Güncel: {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.1] mb-5 tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Türkiye&apos;nin En Güvenilir<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">Telegram Kripto Kanalları</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100/80 max-w-3xl mx-auto mb-8 leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Gerçek kullanıcıların oyladığı, şeffaf metriklerle analiz edilmiş en iyi <strong className="text-white font-bold">Bitcoin sinyalleri</strong> ve altcoin haber gruplarını saniyeler içinde keşfedin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/kanallar" className="btn-primary w-full sm:w-auto px-8 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-blue-600/30 bg-white text-slate-900 font-extrabold hover:bg-blue-50">
              Kanalları Keşfet <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/kanal-ekle" className="w-full sm:w-auto px-8 py-4 text-base sm:text-lg rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2">
              Kanal Ekle
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 mt-10 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {[
              { label: 'Doğrulanan Grup', value: '1,500+' },
              { label: 'Aylık Ziyaret', value: '75K+' },
              { label: 'Gerçek İnceleme', value: '25K+' },
              { label: 'Toplam Üye', value: '2M+' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="stat-number text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] sm:text-xs font-semibold text-blue-200/60 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HERO BANNER AD ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 mb-4">

        <AdBanner position="hero_banner" className="rounded-2xl shadow-lg" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">

        {/* ═══ FEATURED CHANNELS (Sponsorlu) ═══ */}
        {featured.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-md">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">Öne Çıkanlar</h2>
                  <p className="text-xs text-[var(--text-muted)] font-medium hidden sm:block">Editör seçimi sponsorlu kanallar</p>
                </div>
              </div>
              <Link href="/en-iyi-kanallar" className="btn-ghost text-xs font-bold text-[var(--brand-primary)]">
                Tamamını Gör <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid lg:grid-cols-2 gap-3 stagger-children">
              {featured.map((ch, i) => (
                <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* ═══ CATEGORIES ═══ */}
        <nav aria-label="Popüler Kategoriler">
          <section>
            <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] mb-4">Popüler Kategoriler</h2>

            {/* Mobile: 3-col grid showing all categories */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:hidden gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className="flex flex-col items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl px-2 py-3 hover:border-[var(--brand-primary)] hover:shadow-md transition-all group text-center"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-bold text-[11px] text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-1 w-full">{cat.name}</span>
                  <span className="text-[9px] font-semibold text-[var(--text-muted)]">{cat.channel_count} kanal</span>
                </Link>
              ))}
            </div>

            {/* Desktop: grid */}
            <div className="hidden lg:grid grid-cols-4 xl:grid-cols-5 gap-3 stagger-children">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className="premium-card p-4 text-center group flex flex-col items-center justify-center"
                >
                  <div className="w-11 h-11 bg-[var(--bg-muted)] rounded-xl flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <div className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-1">{cat.name}</div>
                  <div className="stat-number text-[11px] font-semibold text-[var(--text-muted)] mt-1">{cat.channel_count} kanal</div>
                </Link>
              ))}
            </div>
          </section>
        </nav>

        {/* ═══ ÇOK TIKLANANLAR ═══ */}

        <MostClicked />

        {/* ═══ INTERLEAVE AD ═══ */}

        <AdBanner position="interleave_list" className="rounded-xl" />

        {/* ═══ TRENDING vs NEWEST ═══ */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* TRENDING */}
          {trending.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5 border-b border-[var(--border-default)] pb-3">
                <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" /> Trend Olanlar
                </h2>
                <Link href="/trending" className="text-xs text-[var(--brand-primary)] hover:underline font-bold">Tümü →</Link>
              </div>
              <div className="flex flex-col gap-3 stagger-children">
                {trending.slice(0, 5).map((ch, i) => (
                  <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
                ))}
              </div>
            </section>
          )}

          {/* NEWEST */}
          {newest.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5 border-b border-[var(--border-default)] pb-3">
                <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[var(--brand-primary)]" /> Yeni Doğrulananlar
                </h2>
                <Link href="/yeni-kanallar" className="text-xs text-[var(--brand-primary)] hover:underline font-bold">Tümü →</Link>
              </div>
              <div className="flex flex-col gap-3 stagger-children">
                {newest.slice(0, 5).map((ch) => (
                  <ChannelCard key={ch.id} channel={ch} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ═══ TRUST BADGES ═══ */}
        <section className="hero-bg text-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden relative">
          <div className="hero-glow w-64 h-64 bg-blue-500/20 top-0 right-0 absolute" />
          <div className="hero-glow w-64 h-64 bg-emerald-500/20 bottom-0 left-0 absolute" />

          <div className="relative z-10 text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black mb-4">Gerçek Veri, Gerçek Topluluk</h2>
            <p className="text-blue-200/60 font-medium leading-relaxed text-sm sm:text-base">Dizinimizde sadece organik kullanıcı deneyimi ile kanıtlanmış kripto telegram gruplarına yer veririz.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 relative z-10">
            {[
              { icon: <Shield className="w-7 h-7 text-emerald-400" />, title: '%100 Manuel Doğrulama', desc: 'Sisteme eklenen her telegram linkini admin kadromuz bizzat inceler.' },
              { icon: <MessageSquare className="w-7 h-7 text-blue-400" />, title: 'Şeffaf Yorum Sistemi', desc: '"Güvenilir Mi?" başlığında kullanıcıların dürüst puanlamalarını paylaşıyoruz.' },
              { icon: <Users className="w-7 h-7 text-violet-400" />, title: 'Doğal Güven Skoru', desc: 'Kanallar aldıkları şikayetler/beğeniler (Trust Score) oranına göre sıralanır.' },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center backdrop-blur-sm">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 shadow-inner border border-white/10">{item.icon}</div>
                <h3 className="font-bold text-base mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-blue-200/50 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SEO TEXT + FAQ ═══ */}
        <section className="bg-[var(--bg-card)] p-8 sm:p-12 rounded-3xl border border-[var(--border-default)] shadow-sm">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6">En İyi Telegram Kripto Kanalları 2026</h2>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base font-medium">
            <p>
              Kripto para endüstrisi hızla değişirken, anlık fiyat hareketlerini ve son dakika Bitcoin sinyallerini saniyeler içerisinde elde edebilmeniz ancak <strong className="text-[var(--text-primary)] font-bold">Telegram kripto kanalları</strong> ile mümkündür. Doğru bir Telegram kanalını takip etmek portföyünüzün büyümesini kolaylaştırırken, botlu scam kanalları ise sizi likidite noktasına iter.
            </p>
            <p>
              Listemizde yer alan tüm grupları editörlerimiz incelemiş ve <strong className="text-[var(--text-primary)] font-bold">Güven Skoru (Trust Score)</strong> metriklerine tabi tutmuştur. Bu skor; kanalın geçmiş sinyal başarı oranına, üye etkileşimine ve topluluğumuzun geri bildirimlerine dayanır.
            </p>
          </div>

          <hr className="my-8 border-[var(--border-default)]" />

          <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mb-5">Sıkça Sorulan Sorular (FAQ)</h3>
          <div className="space-y-3">
            {[
              { q: 'Telegram kripto kanalları nedir?', a: 'Telegram kripto kanalları, kripto piyasaları hakkında teknik analiz, alım-satım sinyalleri ve güncel haberler paylaşılan kapalı veya açık topluluklardır.' },
              { q: 'En iyi telegram kanalları hangileri?', a: 'Sitemizde yer alan Trust Score puanı yüksek, onay rozetine sahip ve topluluk yorumlarında pozitif dönüş alan "Öne Çıkanlar" sayfasındaki kanallardır.' },
              { q: 'Telegram sinyal kanalları güvenilir mi?', a: 'Güvenilir bir kanal her zaman Take-Profit ve Stop-Loss lokasyonlarıyla işlemi sigortalar ve Risk/Ödül oranındaki isabetliliğini şeffaf ispatlar. Sitemizdeki oylama sistemi sahte VIP kanallardan korunmanıza yardımcı olur.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-xl overflow-hidden">
                <summary className="p-4 sm:p-5 cursor-pointer flex items-center justify-between font-bold text-sm sm:text-base text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
