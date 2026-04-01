import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ChannelCard from '@/components/ChannelCard'
import { ArrowRight, TrendingUp, Star, ShieldCheck, Zap, Users, Shield, MessageSquare, ChevronRight } from 'lucide-react'
import { ChannelWithCategory, Category } from '@/lib/types'

async function getData() {
  const supabase = await createClient()
  const [featuredRes, newRes, trendingRes, categoriesRes, bannerRes] = await Promise.all([
    supabase.from('channels').select('*, categories(*)').eq('is_approved', true).eq('is_featured', true).order('votes', { ascending: false }).limit(5),
    supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('created_at', { ascending: false }).limit(6),
    supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('trending_score', { ascending: false, nullsFirst: false }).order('votes', { ascending: false }).limit(10),
    supabase.from('categories').select('*').order('channel_count', { ascending: false }),
    supabase.from('site_settings').select('value').eq('key', 'home_banner_ad').single(),
  ])
  return {
    featured: (featuredRes.data ?? []) as ChannelWithCategory[],
    newest: (newRes.data ?? []) as ChannelWithCategory[],
    trending: (trendingRes.data ?? []) as ChannelWithCategory[],
    categories: (categoriesRes.data ?? []) as Category[],
    banner: bannerRes.data?.value as { imageUrl: string, link: string, isActive: boolean } | null,
  }
}

export default async function HomePage() {
  const { featured, newest, trending, categories, banner } = await getData()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Telegram kripto kanalları nedir?',
        acceptedAnswer: { '@type': 'Answer', text: 'Telegram kripto kanalları, kripto para piyasaları hakkında teknik analiz, temel analiz, alım-satım sinyalleri ve güncel haberler paylaşılan küresel ve yerel Telegram topluluklarıdır. Hem yeni hem de profesyonel traderlar için piyasanın anlık nabzını tutma imkanı sağlar.' }
      },
      {
        '@type': 'Question',
        name: 'En iyi telegram kanalları hangileri?',
        acceptedAnswer: { '@type': 'Answer', text: 'En iyi telegram kripto kanalları kişisel trade stratehinize (Day trading, Swing trading, Hold) göre değişmekle birlikte; platformumuzda onaylanmış, düzenli paylaşımlar yapan ve kullanıcı oylarıyla Top listelerinde liderliğini koruyan (örneğin Binance Türkiye Sinyalleri, Kripto Haber gibi) kanallardır.' }
      },
      {
        '@type': 'Question',
        name: 'Telegram sinyal kanalları güvenilir mi?',
        acceptedAnswer: { '@type': 'Answer', text: 'Tüm telegram sinyal kanalları güvenilir diyemeyiz. Gerçekten güvenilir olanlar şeffaf işlem geçmişlerini paylaşan, risk yönetimine (R/R oranları, Stop Loss kullanımı) odaklanan, yüksek etkileşimli ve garanti kazanç gibi asılsız vaatlerde bulunmayan gruplardır. Sitemizdeki oylama sistemimiz, bot hesapların şişirdiği sahte VIP kanallardan korunmanıza yardımcı olur.' }
      }
    ]
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/50 border-b border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 text-center relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-[11px] font-bold uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" /> Doğrulanmış Kanallar
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wide">
               Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-slate-900 leading-[1.15] mb-4 tracking-tight">
            Türkiye'nin En Güvenilir <br className="hidden sm:block" />
            <span className="text-blue-700">Telegram Kripto Kanalları</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
            Gerçek kullanıcıların oyladığı, şeffaf metriklerle analiz edilmiş en iyi <strong className="text-slate-800 font-bold">Bitcoin sinyalleri</strong> ve altcoin haber gruplarını saniyeler içinde keşfedin. Bütün topluluklar uzman editörlerimiz tarafından her hafta denetlenmektedir.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/kanallar" className="btn-primary w-full sm:w-auto px-8 py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-blue-600/20">
              Kanalları Keşfet <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/kanal-ekle" className="btn-secondary w-full sm:w-auto px-8 py-4 text-base sm:text-lg rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800">
              Kanal Ekle
            </Link>
          </div>

          {/* Core Trust Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 pb-2">
            {[
              { label: 'Doğrulanan Grup', value: '1,500+' },
              { label: 'Aylık Ziyaret', value: '75,000+' },
              { label: 'Gerçek İnceleme', value: '25,000+' },
              { label: 'Toplam Üye', value: '2M+' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSOR HERO AD (home_hero) */}
      {banner?.isActive && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-[-1rem]">
        <a href={banner.link || '#'} target="_blank" rel="noopener noreferrer" className="block w-full overflow-hidden rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-all group relative bg-slate-50 flex items-center justify-center min-h-[90px]">
          {banner.imageUrl ? (
            <img src={banner.imageUrl} alt="Sponsor" className="w-full h-auto max-h-[120px] object-cover sm:object-contain" />
          ) : (
            <div className="p-6 text-center text-slate-500 text-sm font-semibold">[ Reklam Görseli Yok ]</div>
          )}
          <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded backdrop-blur-sm tracking-widest">AD</div>
        </a>
      </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-16">

        {/* FEATURED CHANNELS */}
        {featured.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 mb-1">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Öne Çıkanlar (Sponsorlu)
                </h2>
                <p className="text-slate-500 text-sm">Topluluk kurallarını ihlal etmeyen ve özel sponsorluk sağlayan editör seçimleri.</p>
              </div>
              <Link href="/en-iyi-kanallar" className="btn-secondary py-2 px-4 text-sm shrink-0">
                Tamamını Gör <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-4">
              {featured.map((ch, i) => (
                <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* CATEGORIES – Mobilde yatay scroll, Desktop'ta grid */}
        <nav aria-label="Popüler Kategoriler">
          <section>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Popüler Kategoriler</h2>

            {/* Mobil: yatay scroll chip'ler */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2.5 hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-bold text-sm text-slate-800 group-hover:text-blue-700 transition-colors whitespace-nowrap">{cat.name}</span>
                  <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">{cat.channel_count}</span>
                </Link>
              ))}
            </div>

            {/* Desktop: grid */}
            <div className="hidden lg:grid grid-cols-5 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className="bg-white border border-slate-200 rounded-2xl p-4 text-center hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col items-center justify-center"
                >
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <div className="font-bold text-sm text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">{cat.name}</div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wide">{cat.channel_count} kanal</div>
                </Link>
              ))}
            </div>
          </section>
        </nav>

        {/* TWO COLUMN: TRENDING vs NEWEST */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* TRENDING */}
          {trending.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" /> Trend Olanlar
                </h2>
                <Link href="/trending" className="text-sm text-blue-600 hover:text-blue-800 font-bold transition-colors">Tümü &rarr;</Link>
              </div>
              <div className="flex flex-col gap-3">
                {trending.slice(0, 5).map((ch, i) => (
                  <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
                ))}
              </div>
            </section>
          )}

          {/* NEWEST */}
          {newest.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" /> Yeni Doğrulananlar
                </h2>
                <Link href="/yeni-kanallar" className="text-sm text-blue-600 hover:text-blue-800 font-bold transition-colors">Tümü &rarr;</Link>
              </div>
              <div className="flex flex-col gap-3">
                {newest.slice(0, 5).map((ch) => (
                  <ChannelCard key={ch.id} channel={ch} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* TRUST BADGES SECTION */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full filter blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full filter blur-[80px]" />
          
          <div className="relative z-10 text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black mb-4">Gerçek Veri, Gerçek Topluluk</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Dizinimizde sadece organik kullanıcı deneyimi ile kanıtlanmış kripto telegram gruplarına yer veririz. Robot botlara veya spam sinyal akışlarına sıfır tolerans uygularız.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative z-10">
            {[
              { icon: <Shield className="w-8 h-8 text-emerald-400" />, title: '%100 Manuel Doğrulama', desc: 'Sisteme eklenen her telegram linkini admin kadromuz bizzat inceler.' },
              { icon: <MessageSquare className="w-8 h-8 text-blue-400" />, title: 'Şeffaf Yorum Sistemi', desc: '"Güvenilir Mi?" başlığında kullanıcıların dürüst puanlamalarını paylaşıyoruz.' },
              { icon: <Users className="w-8 h-8 text-violet-400" />, title: 'Doğal Güven Skoru', desc: 'Kanallar üye sayısından çok, aldıkları şikayetler/beğeniler (Trust Score) oranına göre sıralanır.' },
            ].map((item) => (
              <div key={item.title} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 shadow-inner border border-slate-700">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* LONG SEO TEXT + FAQ (Trustpilot-like plain clean formatting) */}
        <section className="prose prose-slate max-w-none text-slate-700 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          
          <h2 className="text-3xl font-black text-slate-900 mb-6">En İyi Telegram Kripto Kanalları 2026: Tam Kapsamlı Başarı Rehberi</h2>
          <p className="font-medium text-slate-600 leading-relaxed text-lg mb-6">
             Kripto para endüstrisi hızla değişirken, anlık fiyat hareketlerini, son dakika Bitcoin sinyallerini ve major airdrop listelemelerini saniyeler içerisinde elde edebilmeniz ancak dünyanın en güçlü alfa grupları olan <strong>Telegram kripto kanalları</strong> ile mümkündür. Doğru bir Telegram kanalını takip etmek portföyünüzün büyümesini kolaylaştırırken, botlu, organik olmayan scam (dolandırıcılık) kanalları ise sizi likidite (sıfırlanma) noktasına iter.
          </p>
          <p>
            Listemizde yer alan tüm Türk ve Global Kripto grupları, editörlerimizin incelemesinden (KYC/Doğrulama aşaması) geçerek <strong>"Güven Skoru (Trust Score)"</strong> metriklerine tabi tutulmuştur. Bu skor tamamen kanalın geçmiş aylar içindeki sinyal başarı oranına (Win Rate) ve topluluğumuzdan topladığı "Benzer Kanallar" teyitlerine dayanır. Hiçbir zaman kaldıraçlı piyasalarda %100 kazanç garantisi bulunmaz; bu yüzden <strong>ücretsiz telegram kripto kanalları</strong> üzerinden alacağınız yatırım bilgilerini mutlaka ve öncelikle Stop Loss (zarar kesme) prensipleriyle risk havuzunuzda eritmeyi unutmayın.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">Telegram Sinyal Kanalları Ne Kadar Şeffaf?</h3>
          <p>
            Kripto dünyasında en önemli olgu dürüstlüktür. Sinyal kanallarını listelerken onlardan belirli günlerde zarar ettikleri, stop oldukları tabloları da açıkça (şeffaflık dökümü) toplulukla paylaşmalarını bekleriz. Spot alımlar için verilen Coin tavsiyelerinde temel analizlerin, zincir üstü (on-chain) metriklerin desteklendiği kaliteli grupları filtreleyerek size en temiz platformu yaratıyoruz.
          </p>

          <hr className="my-10 border-slate-200" />
          
          <h3 className="text-2xl font-black text-slate-900 mb-6">Sıkça Sorulan Sorular (FAQ)</h3>
          <div className="space-y-4 not-prose">
            {[
              { q: 'Telegram kripto kanalları nedir?', a: 'Telegram kripto kanalları, kripto piyasaları hakkında teknik analiz, temel analiz, alım-satım sinyalleri ve güncel makro-ekonomik (FED faiz, SEC onayı) haberlerin paylaşıldığı kapalı veya açık haber topluluklarıdır.' },
              { q: 'En iyi telegram kanalları hangileri?', a: 'En iyi telegram kripto kanalları kişisel risk algoritmanıza göre değişmekle birlikte; sitemizde yer alan "Trust Score" puanı 80 ve üzeri olan, onay rozetine (Verified) sahip, topluluk yorumlarında pozitif dönüş alan "Öne Çıkanlar" sayfasındaki listelerdir.' },
              { q: 'Telegram sinyal kanalları güvenilir mi?', a: 'Sinyaller asla mutlak gerçekliği yansıtmaz. Kripto doğası gereği yüksek oynaklık içeren spekülatif bir piyasadır. Güvenilir bir kanal her zaman Take-Profit (Kar al) ve Stop-Loss (Zarar kes) lokasyonlarıyla işlemi sigortalar ve "Risk/Ödül" oranındaki isabetliliğini şeffaf ispatlar.' }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
