import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'
import ChannelCard from '@/components/ChannelCard'
import { Eye, Users, ChevronRight, ArrowLeft, Crown, Star, Globe, Tag, Calendar, ShieldCheck, HeartPulse, MessageSquareQuote, CheckCircle2 } from 'lucide-react'
import VoteButton from '@/components/VoteButton'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('slug', slug).single()
  if (!data) return { title: 'Kanal Bulunamadı' }
  const ch = data as ChannelWithCategory
  return {
    title: ch.meta_title || `${ch.name} | Telegram Kripto Kanalı İncelemesi`,
    description: ch.meta_description || ch.description || `${ch.name} telegram kanalı yorumları, güven skoru ve analiz detayları.`,
    openGraph: { title: ch.name, description: ch.description ?? '', type: 'website', url: `/kanal/${ch.slug}` },
    alternates: { canonical: `/kanal/${ch.slug}` },
  }
}

export default async function KanalDetayPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: channelData } = await supabase
    .from('channels')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('is_approved', true)
    .single()

  if (!channelData) notFound()

  const ch = channelData as ChannelWithCategory

  // Fetch related channels (Internal linking SEO)
  const { data: relatedData } = await supabase
    .from('channels')
    .select('*, categories(*)')
    .eq('category_id', ch.category_id)
    .neq('id', ch.id)
    .eq('is_approved', true)
    .order('trust_score', { ascending: false })
    .limit(3)

  const relatedChannels = (relatedData ?? []) as ChannelWithCategory[]

  // Fetch Reviews
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .eq('channel_id', ch.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(5)
  const reviews = reviewsData || []

  // Increment views
  supabase.rpc('increment_channel_views', { p_channel_id: ch.id }).then(() => {})

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: ch.name,
    description: ch.description,
    image: ch.logo_url || undefined,
    url: `https://www.telegramkriptokanallari.com/kanal/${ch.slug}`,
    aggregateRating: ch.votes > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: Math.min(5, 3 + ch.votes / 100).toFixed(1),
      reviewCount: ch.votes,
    } : undefined,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://www.telegramkriptokanallari.com' },
      { '@type': 'ListItem', position: 2, name: 'Kanallar', item: 'https://www.telegramkriptokanallari.com/kanallar' },
      { '@type': 'ListItem', position: 3, name: ch.name, item: `https://www.telegramkriptokanallari.com/kanal/${ch.slug}` }
    ]
  }

  const faqObj = ch.faq ? ch.faq : [
      {
        '@type': 'Question',
        name: `${ch.name} kanalı güvenilir mi?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Bu kanal platformumuzda ${ch.trust_score || 80}/100 güven skoruna sahip olup, kullanıcı etkileşimine göre derecelendirilmiştir.`
        }
      },
      {
        '@type': 'Question',
        name: `${ch.name} sinyalleri ücretsiz mi?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: ch.is_premium ? 'Yüksek oranda VIP üyeliğe dayalı veya Premium erişim gerektiren paylaşımları bulunmaktadır.' : 'Kanal genel olarak ücretsiz sinyal ve analiz paylaşımları yapmaktadır.'
        }
      }
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqObj
  }

  const initials = ch.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const avatarColors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-slate-800', 'bg-cyan-600']
  const avatarColor = avatarColors[ch.name.charCodeAt(0) % avatarColors.length]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/kanallar" className="hover:text-blue-600 transition-colors">Kanallar</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{ch.name}</span>
      </nav>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Verification Strip Background effect */}
        {ch.is_verified && (
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-emerald-400" />
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
          <div className={`w-24 h-24 rounded-2xl ${avatarColor} flex items-center justify-center text-3xl font-black text-white flex-shrink-0 shadow-md border border-slate-100 overflow-hidden`}>
            {ch.logo_url ? <img src={ch.logo_url} alt={ch.name} className="w-full h-full object-cover" /> : initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{ch.name}</h1>
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                {ch.is_verified && <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-1 rounded-full font-bold shadow-sm"><ShieldCheck className="w-3.5 h-3.5" /> Doğrulandı</span>}
                {ch.is_premium && <span className="badge badge-premium"><Crown className="w-3.5 h-3.5" /> Premium</span>}
                {ch.is_featured && <span className="badge bg-amber-50 text-amber-600 border border-amber-200"><Star className="w-3.5 h-3.5" /> Öne Çıkan</span>}
              </div>
            </div>
            
            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap text-sm text-slate-600">
              {ch.categories && (
                <Link href={`/kategori/${ch.categories.slug}`} className="font-semibold text-blue-600 flex items-center gap-1 hover:underline">
                  {ch.categories.icon} {ch.categories.name}
                </Link>
              )}
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4 text-slate-500" /> {ch.language === 'tr' ? '🇹🇷 Türkçe' : ch.language}</span>
              {ch.last_verified_at && (
                <>
                  <span className="text-slate-700">|</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> 
                    Son Kontrol: {new Date(ch.last_verified_at).toLocaleDateString('tr-TR')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <HeartPulse className="w-5 h-5 text-emerald-500" />, val: `${ch.trust_score || 85}/100`, lbl: 'Güven Skoru' },
            { icon: <div className="flex justify-center mb-1"><VoteButton channelId={ch.id} initialVotes={ch.votes} /></div>, val: '', lbl: 'Organik Oy' },
            { icon: <Eye className="w-5 h-5 text-slate-500" />, val: ch.views.toLocaleString('tr-TR'), lbl: 'Görüntülenme' },
            { icon: <Users className="w-5 h-5 text-violet-500" />, val: ch.member_count ? (ch.member_count >= 1000 ? `${(ch.member_count/1000).toFixed(1)}K` : ch.member_count) : 'Gizli', lbl: 'Telegram Üye' },
          ].map((s) => (
            <div key={s.lbl} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <div className="text-lg font-black text-slate-900">{s.val}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold mt-0.5">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-blue-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-blue-100">
          <div>
            <h3 className="font-bold text-blue-900 text-lg mb-1">Kanala Katıl ve Analizleri İncele</h3>
            <p className="text-blue-700/80 text-sm font-medium">Telegram bağlantısına güvenli bir şekilde yönlendirileceksiniz.</p>
          </div>
          <Link
            href={`/git/${ch.slug}`}
            className="btn-primary w-full sm:w-auto px-10 py-4 text-base shadow-md hover:shadow-lg shrink-0"
          >
            Hemen Katıl <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

      </div>

      {/* Sponsor Banner Here */}
      <div className="mt-8 mb-8">
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl h-24 flex items-center justify-center text-slate-400 text-sm font-semibold tracking-wide">
          <Star className="w-4 h-4 mr-2 text-slate-300" /> SPONSOR REKLAM ALANI
        </div>
      </div>

      {/* SEO ARTICLE BLOCK */}
      <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 prose prose-slate max-w-none text-slate-600">
        <h2 className="text-2xl font-black text-slate-900 !mt-0">{ch.name} Detaylı İncelemesi</h2>
        <p className="text-lg font-medium leading-relaxed">
          Kripto piyasasında kârlı işlemler yapabilmek ve doğru projelere erken erişim sağlayabilmek için güvenilir haber kaynaklarına ihtiyacınız vardır. <strong className="text-slate-900">{ch.name}</strong>, {ch.categories?.name ?? 'Kripto Para'} alanında faaliyet gösteren ve topluluğumuz tarafından {ch.trust_score || 85} güven skoru ile derecelendirilmiş aktif bir Telegram grubudur.
        </p>
        <p>
          Sistemimizde organik olarak <strong className="text-slate-900">{ch.votes} beğeni</strong> alan bu mecra, şeffaflık (Win Rate paylaşımı) ve üye etkileşimi bakımından belirli kalite standartlarını yakalamış görünmektedir. {ch.is_premium ? 'VIP sinyal ağırlıklı çalışan bu topluluk, piyasadaki riskleri minimize etmeyi hedefleyen yatırımcılar için ideal olabilir.' : 'Ücretsiz ve herkesin erişimine açık spot/vadeli işlem analizleri yapan yöneticiler, kriptoya yeni başlayanlara da eğitici içerikler sunmaktadır.'} Yüksek volatiliteye sahip günlerde dahi, panik yapmadan grafik kırılımlarını aktarması, bu telegram kanalını değerli kılan ana etmenlerden biridir.
        </p>
        
        {ch.tags && ch.tags.length > 0 && (
          <div className="not-prose mt-6 flex flex-wrap gap-2">
            <h4 className="w-full text-sm font-bold text-slate-900 mb-2">Kanal Uzmanlık Alanları:</h4>
            {ch.tags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* FORUM / COMMUNITY DISCUSSION */}
      <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <MessageSquareQuote className="w-6 h-6 text-blue-600" /> Güvenilir Mi? (Topluluk Tartışması)
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Bu kanal hakkındaki gerçek yatırımcı deneyimleri ve şikayetler.</p>
          </div>
          <div className="hidden sm:flex text-right flex-col items-end">
            <div className="text-3xl font-black text-slate-900">{ch.trust_score || 85} <span className="text-lg text-slate-500 font-semibold">/100</span></div>
            <div className="text-xs font-bold text-emerald-600">Yüksek Güven</div>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((rv) => (
              <div key={rv.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">{(rv.user_name as string)[0].toUpperCase()}</div>
                    {rv.user_name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{new Date(rv.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{rv.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <MessageSquareQuote className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <h3 className="text-slate-900 font-bold mb-1">Henüz Yorum Yapılmamış</h3>
              <p className="text-slate-500 text-sm">İlk deneyimi siz paylaşın ve topluluğumuza rehberlik edin.</p>
              <button className="mt-4 btn-secondary py-2 px-6 text-sm">Yorum Yap</button>
            </div>
          )}
        </div>
      </div>

      {/* BENZER KANALLAR */}
      {relatedChannels.length > 0 && (
        <div className="mt-12 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
               İlgili Sinyal Kanalları
            </h2>
          </div>
          <div className="grid gap-3">
            {relatedChannels.map(rc => (
              <ChannelCard key={rc.id} channel={rc} />
            ))}
          </div>
        </div>
      )}

      <Link href="/kanallar" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 font-semibold transition-colors mt-6">
        <ArrowLeft className="w-4 h-4" /> Dizin Ana Sayfasına Dön
      </Link>
    </div>
  )
}
