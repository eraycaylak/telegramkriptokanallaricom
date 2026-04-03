import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'
import ChannelCard from '@/components/ChannelCard'
import AdBanner from '@/components/AdBanner'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { Eye, Users, ChevronRight, ArrowLeft, Crown, Star, Globe, Tag, Calendar, ShieldCheck, HeartPulse, MessageSquareQuote, CheckCircle2, Share2 } from 'lucide-react'
import VoteButton from '@/components/VoteButton'
import ReviewForm from '@/components/ReviewForm'

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

  const { data: relatedData } = await supabase
    .from('channels')
    .select('*, categories(*)')
    .eq('category_id', ch.category_id)
    .neq('id', ch.id)
    .eq('is_approved', true)
    .order('trust_score', { ascending: false })
    .limit(5)

  const relatedChannels = (relatedData ?? []) as ChannelWithCategory[]

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .eq('channel_id', ch.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(5)
  const reviews = reviewsData || []

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
      reviewCount: Math.max(ch.votes, reviews.length),
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: reviews.slice(0, 3).map((rv: any) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: rv.user_name || 'Anonim' },
      reviewRating: { '@type': 'Rating', ratingValue: rv.rating, bestRating: 5, worstRating: 1 },
      reviewBody: rv.comment,
      datePublished: rv.created_at,
    })),
  }

  const faqObj = ch.faq ? ch.faq : [
    {
      '@type': 'Question',
      name: `${ch.name} kanalı güvenilir mi?`,
      acceptedAnswer: { '@type': 'Answer', text: `Bu kanal platformumuzda ${ch.trust_score || 80}/100 güven skoruna sahip olup, kullanıcı etkileşimine göre derecelendirilmiştir.` }
    },
    {
      '@type': 'Question',
      name: `${ch.name} sinyalleri ücretsiz mi?`,
      acceptedAnswer: { '@type': 'Answer', text: ch.is_premium ? 'VIP üyeliğe dayalı veya Premium erişim gerektiren paylaşımları bulunmaktadır.' : 'Kanal genel olarak ücretsiz sinyal ve analiz paylaşımları yapmaktadır.' }
    }
  ]

  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqObj }

  const initials = ch.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const avatarColors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-slate-800', 'bg-cyan-600']
  const avatarColor = avatarColors[ch.name.charCodeAt(0) % avatarColors.length]

  const shareUrl = `https://www.telegramkriptokanallari.com/kanal/${ch.slug}`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <BreadcrumbNav items={[
        { label: 'Ana Sayfa', href: '/' },
        { label: 'Kanallar', href: '/kanallar' },
        { label: ch.name },
      ]} />

      {/* Main Card */}
      <div className="premium-card p-6 sm:p-10 relative">
        {ch.is_verified && (
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] rounded-t-lg" />
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${avatarColor} flex items-center justify-center text-2xl sm:text-3xl font-black text-white flex-shrink-0 shadow-md border border-[var(--border-default)] overflow-hidden`}>
            {ch.logo_url ? <img src={ch.logo_url} alt={ch.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">{ch.name}</h1>
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                {ch.is_verified && <span className="flex items-center gap-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-bold"><ShieldCheck className="w-3.5 h-3.5" /> Doğrulandı</span>}
                {ch.is_premium && <span className="badge badge-premium"><Crown className="w-3.5 h-3.5" /> Premium</span>}
                {ch.is_featured && <span className="badge bg-amber-500/10 text-amber-500 border border-amber-500/20"><Star className="w-3.5 h-3.5" /> Öne Çıkan</span>}
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap text-sm text-[var(--text-secondary)]">
              {ch.categories && (
                <Link href={`/kategori/${ch.categories.slug}`} className="font-semibold text-[var(--brand-primary)] flex items-center gap-1 hover:underline">
                  {ch.categories.icon} {ch.categories.name}
                </Link>
              )}
              <span className="text-[var(--border-hover)]">|</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4 text-[var(--text-muted)]" /> {ch.language === 'tr' ? '🇹🇷 Türkçe' : ch.language}</span>
              {ch.last_verified_at && (
                <>
                  <span className="text-[var(--border-hover)]">|</span>
                  <span className="flex items-center gap-1 text-emerald-500 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Son Kontrol: {new Date(ch.last_verified_at).toLocaleDateString('tr-TR')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <HeartPulse className="w-5 h-5 text-emerald-500" />, val: `${ch.trust_score || 85}/100`, lbl: 'Güven Skoru' },
            { icon: <div className="flex justify-center mb-1"><VoteButton channelId={ch.id} initialVotes={ch.votes} /></div>, val: '', lbl: 'Organik Oy' },
            { icon: <Eye className="w-5 h-5 text-[var(--text-muted)]" />, val: ch.views.toLocaleString('tr-TR'), lbl: 'Görüntülenme' },
            { icon: <Users className="w-5 h-5 text-violet-500" />, val: ch.member_count ? (ch.member_count >= 1000 ? `${(ch.member_count/1000).toFixed(1)}K` : ch.member_count) : 'Gizli', lbl: 'Telegram Üye' },
          ].map((s) => (
            <div key={s.lbl} className="bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-2xl p-4 text-center">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <div className="stat-number text-lg font-black text-[var(--text-primary)]">{s.val}</div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold mt-0.5">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* CTA + Share */}
        <div className="bg-[var(--brand-primary)]/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[var(--brand-primary)]/10">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">Kanala Katıl ve Analizleri İncele</h3>
            <p className="text-[var(--text-muted)] text-sm font-medium">Telegram bağlantısına güvenli bir şekilde yönlendirileceksiniz.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href={`/git/${ch.slug}`} className="btn-primary flex-1 sm:flex-initial px-8 py-3.5 text-base shadow-md hover:shadow-lg justify-center">
              Hemen Katıl <ChevronRight className="w-5 h-5" />
            </Link>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(ch.name + ' - Telegram Kripto Kanalı')}`} target="_blank" rel="noopener noreferrer" className="btn-ghost p-3 rounded-xl border border-[var(--border-default)]" title="Twitter'da Paylaş">
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Channel Detail Ad */}
      <div className="mt-6 mb-6">
        <AdBanner position="channel_detail" className="rounded-xl" />
      </div>

      {/* SEO Article */}
      <div className="mt-6 premium-card p-8 sm:p-10">
        <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mb-4">{ch.name} Detaylı İncelemesi</h2>
        <div className="space-y-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-medium">
          <p>
            <strong className="text-[var(--text-primary)]">{ch.name}</strong>, {ch.categories?.name ?? 'Kripto Para'} alanında faaliyet gösteren ve topluluğumuz tarafından {ch.trust_score || 85} güven skoru ile derecelendirilmiş aktif bir Telegram grubudur.
          </p>
          <p>
            Sistemimizde organik olarak <strong className="text-[var(--text-primary)]">{ch.votes} beğeni</strong> alan bu kanal;{' '}
            {ch.is_premium ? 'VIP sinyal ağırlıklı çalışan, riskleri minimize etmeyi hedefleyen yatırımcılar için ideal olabilir.' : 'ücretsiz ve herkesin erişimine açık analizler yapan, yeni başlayanlara da eğitici içerikler sunan bir topluluktur.'}
          </p>
        </div>

        {ch.tags && ch.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <h4 className="w-full text-sm font-bold text-[var(--text-primary)] mb-2">Kanal Uzmanlık Alanları:</h4>
            {ch.tags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="mt-6 premium-card p-8 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] flex items-center gap-2">
              <MessageSquareQuote className="w-6 h-6 text-[var(--brand-primary)]" /> Güvenilir Mi?
            </h2>
            <p className="text-[var(--text-muted)] font-medium text-sm mt-1">Gerçek yatırımcı deneyimleri</p>
          </div>
          <div className="hidden sm:flex text-right flex-col items-end">
            <div className="stat-number text-2xl font-black text-[var(--text-primary)]">{ch.trust_score || 85} <span className="text-sm text-[var(--text-muted)] font-semibold">/100</span></div>
            <div className="text-xs font-bold text-emerald-500">Yüksek Güven</div>
          </div>
        </div>

        <div className="space-y-3">
          {reviews.length > 0 && reviews.map((rv: any) => (
            <div key={rv.id} className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-default)]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-[var(--text-primary)] flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center text-xs font-bold">{(rv.user_name || 'A')[0].toUpperCase()}</div>
                  {rv.user_name || 'Anonim'}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= (rv.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-[var(--text-muted)]'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">{new Date(rv.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{rv.comment}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <ReviewForm channelId={ch.id} channelName={ch.name} />
        </div>
      </div>

      {/* Related Channels */}
      {relatedChannels.length > 0 && (
        <div className="mt-10 mb-6">
          <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2 mb-5">
            İlgili Sinyal Kanalları
          </h2>
          <div className="grid gap-3 stagger-children">
            {relatedChannels.map(rc => (
              <ChannelCard key={rc.id} channel={rc} />
            ))}
          </div>
        </div>
      )}

      <Link href="/kanallar" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] font-semibold transition-colors mt-6">
        <ArrowLeft className="w-4 h-4" /> Dizin Ana Sayfasına Dön
      </Link>
    </div>
  )
}
