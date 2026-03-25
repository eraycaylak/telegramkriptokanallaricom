import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'
import ChannelCard from '@/components/ChannelCard'
import { ThumbsUp, Eye, Users, ExternalLink, ArrowLeft, Crown, Star, Globe, Tag, Calendar } from 'lucide-react'

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
    title: `${ch.name} | Telegram Kripto Kanalı`,
    description: ch.description ?? `${ch.name} Telegram kripto kanalı hakkında detaylı bilgi, üye sayısı, oylar ve kullanıcı yorumları.`,
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
    .order('votes', { ascending: false })
    .limit(3)

  const relatedChannels = (relatedData ?? []) as ChannelWithCategory[]

  // Increment views (fire and forget)
  supabase.rpc('increment_channel_views', { p_channel_id: ch.id }).then(() => {})

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: ch.name,
    description: ch.description,
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

  const initials = ch.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-600 mb-6">
        <Link href="/" className="hover:text-slate-400 transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/kanallar" className="hover:text-slate-400 transition-colors">Kanallar</Link>
        <span>/</span>
        <span className="text-slate-400">{ch.name}</span>
      </nav>

      <div className="glass-card p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-xl font-black text-white flex-shrink-0 shadow-xl">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-100">{ch.name}</h1>
              {ch.is_premium && <span className="badge badge-premium"><Crown className="w-3 h-3" /> Premium</span>}
              {ch.is_featured && <span className="badge" style={{background:'rgba(234,179,8,0.15)',color:'#eab308',border:'1px solid rgba(234,179,8,0.25)'}}><Star className="w-3 h-3" /> Öne Çıkan</span>}
            </div>
            {ch.categories && (
              <Link href={`/kategori/${ch.categories.slug}`} className="badge badge-category text-xs">
                {ch.categories.icon} {ch.categories.name}
              </Link>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <ThumbsUp className="w-4 h-4 text-violet-400" />, val: ch.votes, lbl: 'Oy' },
            { icon: <Eye className="w-4 h-4 text-blue-400" />, val: ch.views.toLocaleString('tr-TR'), lbl: 'Görüntülenme' },
            { icon: <Users className="w-4 h-4 text-emerald-400" />, val: ch.member_count ? (ch.member_count >= 1000 ? `${(ch.member_count/1000).toFixed(1)}K` : ch.member_count) : '-', lbl: 'Üye' },
          ].map((s) => (
            <div key={s.lbl} className="bg-white/5 rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <div className="text-base font-bold text-slate-100">{s.val}</div>
              <div className="text-xs text-slate-600">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        {ch.description && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-slate-400 mb-2">Açıklama</h2>
            <p className="text-slate-300 leading-relaxed text-sm">{ch.description}</p>
          </div>
        )}

        {/* Tags */}
        {ch.tags && ch.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {ch.tags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-500 border border-white/5">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-600 mb-6 border-t border-white/5 pt-5">
          {ch.language && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {ch.language === 'tr' ? '🇹🇷 Türkçe' : ch.language}</span>}
          {ch.created_at && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(ch.created_at).toLocaleDateString('tr-TR')}</span>}
        </div>

        {/* CTA */}
        <a
          href={ch.telegram_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="btn-primary w-full justify-center text-base py-3"
        >
          <ExternalLink className="w-5 h-5" /> Telegram&apos;da Kanala Katıl
        </a>
      </div>

      {/* SEO ARTICLE BLOCK (Min 400 Words targeted dynamic injection) */}
      <div className="mt-10 glass-card p-6 sm:p-8 prose prose-invert prose-sm max-w-none text-slate-400">
        <h2 className="text-xl font-bold text-slate-200 !mt-0">{ch.name} İncelemesi ve Topluluk Analizi</h2>
        <p>
          Kripto para piyasalarında doğru zamanda doğru bilgiye erişmek, başarılı bir yatırım sürecinin temel taşıdır. İncelemekte olduğunuz <strong className="text-slate-200">{ch.name}</strong>, özellikle <strong className="text-slate-200">{ch.categories?.name ?? 'Kripto'}</strong> alanında faaliyet gösteren ve takipçilerine güncel içerikler sunmayı amaçlayan aktif bir Telegram kripto kanalıdır. Bu tür telegram kanalları, piyasadaki volatiliteden yararlanmak isteyen, grafik analizi veya temel analiz arayışında olan kripto yatırımcıları için vazgeçilmez bir kaynaktır. <strong className="text-slate-200">{ch.name}</strong> isimli telegram grubu da üyeleriyle etkileşime geçen, potansiyel fırsatları veya riskleri analiz eden popüler platformlardan biridir.
        </p>
        <p>
          Bir kripto telegram grubuna (örneğin {ch.name}) katılırken dikkat etmeniz gereken bazı temel metrikler bulunmaktadır. Kanalın genel üye sayısı başlangıçta etkileyici görünse de, asıl önemli olan paylaşılan analizlerin veya sinyallerin isabetlilik oranıdır (Win Rate). Topluluğumuz tarafından sitemizde <strong className="text-slate-200">{ch.votes} beğeni (oy)</strong> alan bu kanal, organik bir kitle tarafından takibe değer bulunmuş ve popülaritesini ispatlamıştır. {ch.is_premium ? 'VIP abonelik modeliyle premium sinyaller veren bu platform' : 'Ücretsiz şekilde genele açık bilgi paylaşımı yapan bu platform'}, risk ödül (Risk/Reward) oranını gözeten profesyonel yatırımcılar için değerli bir tartışma/takip ortamı sunabilir. Kripto piyasasında ister günlük alım satım (day trade) yapın, ister uzun vadeli yatırımlar (hold) kovalayın, {ch.name} gibi aktif kanallar üzerinden gelen haber akışı işlemlerinize yön vermede size ekstra bir teyit (konfirmasyon) katabilir.
        </p>
        <h3 className="text-lg font-bold text-slate-300">Neden {ch.name} Grubunu Takip Etmeliyim?</h3>
        <p>
          Telegram grupları sadece "al-sat" sinyalleri vermekle kalmaz; aynı zamanda küresel makroekonomik gelişmeleri (FED kararları, SEC davaları, ETF onayları), blockchain ağlarındaki güncellemeleri (hard fork, mainnet) ve devasa airdrop fırsatlarını ilk elden duyururlar. {ch.name} gibi kanallar bu haberleri dakikalar içerisinde süzerek topluluğuna aktarır. Unutmamalısınız ki {ch.name} tarafından paylaşılan hiçbir içerik %100 kesin bir yatırım tavsiyesi içermez. Zarar kes (stop loss) kullanımı kripto ticaretinde zorunludur. Platformumuzda bu kanalın sayfasını takip eden on binlerce ziyaretçi gibi, siz de öncelikle kanalın geçmişteki performansını gözlemlemeli, paylaşılan analizlerin sizin risk toleransınızla örtüşüp örtüşmediğini tartmalısınız.
        </p>
      </div>

      {/* BENZER KANALLAR (Internal Linking) */}
      {relatedChannels.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-violet-400" /> Benzer Kanallar ({ch.categories?.name})
          </h2>
          <div className="grid gap-3">
            {relatedChannels.map(rc => (
              <ChannelCard key={rc.id} channel={rc} />
            ))}
          </div>
        </div>
      )}

      <Link href="/kanallar" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mt-10 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tüm kanallara dön
      </Link>
    </div>
  )
}
