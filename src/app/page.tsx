import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ChannelCard from '@/components/ChannelCard'
import { ArrowRight, TrendingUp, Star, Zap, Shield, Users, BarChart2, ChevronRight } from 'lucide-react'
import { ChannelWithCategory, Category } from '@/lib/types'

async function getData() {
  const supabase = await createClient()
  const [featuredRes, newRes, trendingRes, categoriesRes] = await Promise.all([
    supabase.from('channels').select('*, categories(*)').eq('is_approved', true).eq('is_featured', true).order('votes', { ascending: false }).limit(5),
    supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('created_at', { ascending: false }).limit(6),
    supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('votes', { ascending: false }).limit(10),
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
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[520px] flex items-center">
        {/* Glow blobs */}
        <div className="hero-glow w-[500px] h-[500px] bg-violet-700/25 -top-32 -left-32" />
        <div className="hero-glow w-[400px] h-[400px] bg-blue-700/20 -bottom-20 right-0" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
              <Zap className="w-3 h-3" /> Türkiye&apos;nin #1 Kripto Kanal Dizini
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
               Son Güncelleme: 25 Mart 2026
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
            <span className="gradient-text">Telegram Kripto</span>
            <br />
            <span className="text-slate-100">Kanalları</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            En iyi Telegram kripto kanallarını keşfet. Bitcoin sinyalleri, Ethereum analizleri,
            DeFi fırsatları ve ücretsiz kripto haberleri tek platformda.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/kanallar" className="btn-primary px-6 py-3 text-base">
              Kanalları Keşfet <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/kanal-ekle" className="btn-secondary px-6 py-3 text-base">
              Kanal Ekle
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-center">
            {[
              { icon: '📡', val: `${trending.length}+`, lbl: 'Aktif Kanal' },
              { icon: '👥', val: '500K+', lbl: 'Toplam Üye' },
              { icon: '✅', val: '100%', lbl: 'Doğrulanmış' },
              { icon: '🆓', val: 'Ücretsiz', lbl: 'Erişim' },
            ].map((s) => (
              <div key={s.lbl} className="glass-card px-5 py-3 min-w-[110px]">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-lg font-black text-slate-100">{s.val}</div>
                <div className="text-xs text-slate-500">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">

        {/* FEATURED */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title flex items-center gap-2"><Star className="w-6 h-6 text-amber-400" /> Öne Çıkan Kanallar</h2>
              <Link href="/en-iyi-kanallar" className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Tümü <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid gap-3">
              {featured.map((ch, i) => (
                <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* CATEGORIES */}
        <section>
          <h2 className="section-title mb-6">📂 Kategoriler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="glass-card p-4 text-center group"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-bold text-sm text-slate-200 group-hover:text-violet-300 transition-colors">{cat.name}</div>
                <div className="text-xs text-slate-600 mt-1">{cat.channel_count} kanal</div>
              </Link>
            ))}
          </div>
        </section>

        {/* TRENDING */}
        {trending.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-orange-400" /> Trending Kanallar
              </h2>
              <Link href="/trending" className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Tümü <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid gap-3">
              {trending.slice(0, 5).map((ch, i) => (
                <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* NEWEST */}
        {newest.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-400" /> Yeni Eklenen Kanallar
              </h2>
              <Link href="/yeni-kanallar" className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Tümü <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {newest.map((ch) => (
                <ChannelCard key={ch.id} channel={ch} />
              ))}
            </div>
          </section>
        )}

        {/* WHY US */}
        <section className="glass-card p-8">
          <h2 className="section-title text-center mb-8">Neden Biz?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-emerald-400" />, title: 'Doğrulanmış Kanallar', desc: 'Her kanal manuel inceleme sürecinden geçer, sahte ve zararlı kanallar anında kaldırılır.' },
              { icon: <BarChart2 className="w-6 h-6 text-blue-400" />, title: 'Gerçek İstatistikler', desc: 'Üye sayıları, oy ve değerlendirmelerle kanalları objektif karşılaştır.' },
              { icon: <Users className="w-6 h-6 text-violet-400" />, title: 'Topluluk Odaklı', desc: 'Kullanıcılar oy vererek ve yorum yaparak en iyi kanalları öne çıkarır.' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-200 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEO CONTENT BLOCK & FAQ */}
        <section className="prose prose-invert prose-sm max-w-none">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          
          <div className="glass-card p-6 sm:p-10 space-y-8 text-slate-400 leading-loose text-sm sm:text-base">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mb-4">En İyi Telegram Kripto Kanalları 2026: Tam Kapsamlı Başarı Rehberi</h2>
              <p className="mb-4">
                Kripto para piyasası (kripto endüstrisi) sadece hız ve ivmeyle değil, bilgi hızıyla hareket eden bir ekosistemdir. Dünyanın en gelişmiş projesi veya en büyük paritedeki kırılım dahi, doğru strateji olmadan kazanç sağlamaz. Tam bu noktada devreye dünyanın tartışılamaz bir numaralı bilgi akışı platformlarından olan <strong className="text-slate-300">Telegram kripto kanalları</strong> girer. Türkiye'de ve dünyada her gün binlerce trader, Telegram üzerindeki özel alfa gruplarında işlem fırsatlarına herkesten önce ulaşır. Bu dijital ağ; teknik kırılımlardan anlık FOMO tetikleyicilerine, dev projelerin airdrop görevlerinden özel whitelist fırsatlarına kadar her metrikte yatırımcının bir numaralı kalkanıdır. Bizim kurduğumuz en gelişmiş ve tarafsız dizin sayesinde sahtekâr, bot basılmış dolandırıcı gruplardan korunarak, en isabetli ve dürüst Telegram kriptolarını saniyeler içinde keşfedebiliyorsunuz.
              </p>
              <p>
                2026 yılı, kripto piyasasında spot (uzun vadeli tutma) ve futures (kaldıraçlı işlem) arasındaki uçurumu daha da artırmış, makroekonomik faiz etkileri ile sert volatalitelere yol açmıştır. Kendi analiz yeteneğinize güvenseniz dahi profesyonel bir <strong className="text-slate-300">Telegram Kripto Kanalı</strong> size çok farklı bir bakış açısı sunabilir. İhtiyacınız olan şey sadece grafikteki üçgenin kırılımı değil, devasa zincir üstü (on-chain) balina cüzdanlarının hangi token'a yöneldiğini analiz edebilen vizyoner ekiplere katılmaktır. Listemizde görebileceğiniz üzere, biz sizin için tüm telegram kripto ekosistemini filtreledik.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-100 mb-4">Telegram Sinyal Kanalları İle Profesyonel Trade</h2>
              <p className="mb-4">
                Profesyonel bir <strong className="text-slate-300">Telegram sinyal kanalı</strong>, asla ama asla garantili zenginlik vaat etmez. Profesyoneller bilir ki piyasanın %100 tahmini yapılamaz. Ancak "risk minimizasyonu ve R/R (Risk/Reward) oranı" stratejileriyle, bir trade kaybedilse bile uzun vadede cüzdan bakiyesinin artması sağlanır. Listelediğimiz lider telegram sinyal kanalları, işlem setup'ını size atarken net bir Entry (Giriş) seviyesi, Take Profit 1-2-3 (Kar Alım Hedefleri) ve mutlaka Stop Loss (Zarar Kes) seviyesi sunar. Bu temel kurala uymayan "Yükselecek alın!" diyen hiçbir kanal, dizinimizdeki elit seviye veya popüler sıralamalarda yer bulamaz. Topluluk oylamalarımız tamamen şeffaf ve gerçektir.
              </p>
              <p>
                Sinyal takip ederken özellikle Binance, OKX veya Bybit gibi borsalardaki marjin (kaldıraçlı) seviyelere dikkat etmeli; izole ve çapraz marjin kavramlarına hâkim olmadan, sırf bir gruptan sinyal geldi diye sermayenizin tamamıyla (All in) işlem açmamalısınız. Gerçek <strong>türk telegram kripto kanalları</strong> çoğu zaman size piyasa eğitimini, piyasa psikolojisinin nasıl okunacağını, RSI, MACD, Fibonacci, likidite avı ve order block (OB) yapılarını öğretmeyi de misyon edinirler.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-100 mb-4">Ücretsiz Telegram Kanalları ve Bilgi Kaynakları</h2>
              <p className="mb-4">
                Özellikle kripto evreninde yeni bir balıksanız, binlerce dolar ücret ödeyerek VIP kapalı gruplara girmek yerine çok kaliteli, dürüst ve isabetli <strong>ücretsiz telegram kripto kanalları</strong> ile yola çıkmanızı şiddetle tavsiye ederiz. Dizinimizde yer alan bu ücretsiz platformlarda her sabah piyasa yönüne dair güncel bir özet bülteni sesli anons veya mesaj şeklinde gönderilir. En önemli airdropların testnet (test ağı yapılandırması) görev süreçleri, tamamen ücretsiz kanallar tarafından paylaşılarak sermayesiz bir şekilde binlerce dolar havadan token kazanmanızın da önünü açarlar. Kimi zaman bu gruplardaki ücretsiz ve karşılıksız bilgi, piyasadaki çoğu premium influencerın paralı servisinden daha saf ve değerlidir. 
              </p>
              <p>
                Ücretsiz grupları incelediğimizde bunların gelirlerini genellikle borsa (exchange) ref linklerinden veya reklamcılıktan elde ettiklerini görüyoruz. Bu ticari model tamamen yasal ve etiktir. Asıl olan tek kural, kanal yöneticisinin size fayda sağlamaya devam etmesi ve topluluğunu korumasıdır. Listemizde "Ücretsiz" veya "Sinyal" gibi özel kategorileri tıklayarak bu grupları kolayca keşfedebilirsiniz.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-100 mb-4">Güvenilir Telegram Kanalları Nasıl Anlaşılır?</h2>
              <p className="mb-4">
                Sürekli genişleyen ve büyüyen kripto sektörünün en büyük dezavantajı maalesef "scam" (dolandırıcılık) olaylarıdır. Piyasaya giren her bilinçsiz yatırımcı, kolay yoldan milyoner olacağını zannedip asılsız "garantili x100 yapan Pump gruplarının" tuzaklarına çekilir. Gerçek ve <strong>güvenilir telegram kanalları</strong>, "Pump & Dump" isimli yasadışı fiyat manipülasyonundan tamamiyle uzaktır. Bir telegram grubunun kalitesini şuradan anlarsınız: Zarar edebilirler, stop olabilirler ancak şeffaf bir şekilde o grafik neden patladı ve zararla çıkıldı diye durum analizi geçerler. Sizden sadece Telegram üzerinden "Kripto bakiyeni ikiye katlayıp geri göndereceğim, paranızı bu cüzdana atın" diyen yöneticilerden koşarak kaçmalısınız; dizin platformumuzda sahte isim, kopya profil kullanarak dolandırıcılık hedefleyen kişilere sıfır toleransla yaklaşılır, bildirildiğinde derhal "SCAM" tespitiyle banlanırlar.
              </p>
              <p>
                Platformumuzda kanal detayına girildiğinde "Oylama (Vote)" sistemi bulunur. İşte bu oylama sistemi, hangi telegram kripto grubunun topluluğunun arkasında durduğunu anında ölçer. Popüler olan her zaman kaliteli demek değildir ancak on binlerce organik takipçinin yüksek oyu ile zirveye tırmanmış bir Telegram grubu kesinlikle değerli bilgiler sunuyordur. Türkçe Kripto yayıncılığı yapan ve on binlerce kişiye yol gösteren yerel analistlerden, en global haber kaynaklarına kadar devasa bilgi deposu, hemen yukarıdaki kanallar sekmesinde bir tık uzağınızda!
              </p>
            </div>
            
            <hr className="border-white/10 my-8" />
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold text-slate-100 mb-6">Sıkça Sorulan Sorular (FAQ)</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-200 mb-2">Telegram kripto kanalları nedir?</h4>
                  <p className="text-sm">Telegram kripto kanalları, kripto para piyasaları hakkında teknik analiz, temel analiz, alım-satım sinyalleri ve güncel haberler paylaşılan küresel ve yerel Telegram topluluklarıdır. Hem yeni hem de profesyonel traderlar için piyasanın anlık nabzını tutma imkanı sağlar.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 mb-2">En iyi telegram kanalları hangileri?</h4>
                  <p className="text-sm">En iyi telegram kripto kanalları kişisel trade stratehinize (Day trading, Swing trading, Hold) göre değişmekle birlikte; platformumuzda onaylanmış, düzenli paylaşımlar yapan ve kullanıcı oylarıyla Top listelerinde liderliğini koruyan kanallardır.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 mb-2">Telegram sinyal kanalları güvenilir mi?</h4>
                  <p className="text-sm">Tüm telegram sinyal kanalları güvenilir diyemeyiz. Gerçekten güvenilir olanlar şeffaf işlem geçmişlerini paylaşan, risk yönetimine odaklanan ve asılsız vaatlerde bulunmayan gruplardır. Sitemizdeki oylama sistemimiz, sahte kanallardan korunmanıza yardımcı olur.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-3">Kanalınızı Ekleyin</h2>
          <p className="text-slate-500 mb-6 text-sm">100.000&apos;den fazla kripto yatırımcısına ulaşın</p>
          <Link href="/kanal-ekle" className="btn-primary px-8 py-3 text-base">
            Ücretsiz Kanal Ekle <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </>
  )
}
