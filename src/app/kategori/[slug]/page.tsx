import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ChannelCard from '@/components/ChannelCard'
import AdBanner from '@/components/AdBanner'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { ChannelWithCategory, Category } from '@/lib/types'
import Link from 'next/link'

interface Props { params: Promise<{ slug: string }> }

const BASE_URL = 'https://www.telegramkriptokanallari.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').eq('slug', slug).single()
  if (!data) return { title: 'Kategori Bulunamadı' }
  const cat = data as Category
  return {
    title: `${cat.name} Telegram Kanalları | En İyi ${cat.name} Kanalları 2026`,
    description: `${cat.name} kategorisindeki en iyi Telegram kripto kanalları. Güvenilir ${cat.name.toLowerCase()} kanallarını keşfet. ${cat.description ?? ''}`,
    keywords: [`${cat.name.toLowerCase()} telegram kanalları`, `telegram ${cat.name.toLowerCase()}`, `kripto ${cat.name.toLowerCase()} grupları`],
    openGraph: {
      title: `${cat.name} Telegram Kanalları | En İyi ${cat.name} Kanalları 2026`,
      description: `${cat.name} kategorisindeki en iyi Telegram kripto kanalları. Güvenilir ${cat.name.toLowerCase()} kanallarını keşfet.`,
      url: `${BASE_URL}/kategori/${cat.slug}`,
      type: 'website',
    },
    alternates: { canonical: `${BASE_URL}/kategori/${cat.slug}` },
  }
}

export default async function KategoriPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: catData } = await supabase.from('categories').select('*').eq('slug', slug).single()
  if (!catData) notFound()
  const cat = catData as Category

  const { data: channels } = await supabase
    .from('channels')
    .select('*, categories(*)')
    .eq('is_approved', true)
    .eq('category_id', cat.id)
    .order('votes', { ascending: false })
  const typedChannels = (channels ?? []) as ChannelWithCategory[]

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.name} Telegram Kripto Kanalları`,
    description: cat.description,
    url: `${BASE_URL}/kategori/${cat.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Kategoriler', item: `${BASE_URL}/kategoriler` },
        { '@type': 'ListItem', position: 3, name: cat.name },
      ],
    },
  }

  const itemListSchema = typedChannels.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.name} Telegram Kripto Kanalları Listesi`,
    description: `En iyi ${cat.name.toLowerCase()} Telegram kanalları`,
    numberOfItems: typedChannels.length,
    itemListElement: typedChannels.slice(0, 20).map((ch, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/kanal/${ch.slug}`,
      name: ch.name,
    })),
  } : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}

      <BreadcrumbNav items={[
        { label: 'Ana Sayfa', href: '/' },
        { label: 'Kategoriler', href: '/kategoriler' },
        { label: cat.name },
      ]} />

      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">{cat.icon}</div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">{cat.name} Telegram Kanalları</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1 font-medium">{cat.description} • {typedChannels.length} kanal</p>
        </div>
      </div>

      {/* SEO Content Block */}
      <div className="premium-card p-6 mb-6">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
          {cat.name} kategorisindeki en güvenilir <strong className="text-[var(--text-primary)]">Telegram kripto kanallarını</strong> keşfedin.
          {' '}En iyi <strong className="text-[var(--text-primary)]">kripto telegram grupları</strong> arasından seçilen bu kanallar,{' '}
          {cat.name.toLowerCase()} alanında uzmanlaşmış ve topluluğumuzun güven skorlarıyla derecelendirilmiş kaliteli grupları içerir.{' '}
          Tüm kanallar editör kadromuz tarafından doğrulanmıştır.
        </p>
      </div>

      {/* Interleave channels with ads */}
      <div className="space-y-3 stagger-children">
        {typedChannels.length > 0 ? (
          typedChannels.map((ch, i) => (
            <div key={ch.id}>
              <ChannelCard channel={ch} rank={i + 1} />
              {/* Ad after every 5th channel */}
              {(i + 1) % 5 === 0 && i < typedChannels.length - 1 && (
                <div className="my-3">
                  <AdBanner position="interleave_list" className="rounded-xl" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="premium-card p-12 text-center">
            <p className="text-[var(--text-muted)] font-medium">Bu kategoride henüz onaylı kanal yok.</p>
            <Link href="/kanal-ekle" className="btn-primary mt-4 inline-flex">Kanal Ekle</Link>
          </div>
        )}
      </div>

      <Link href="/kanallar" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mt-8 transition-colors font-semibold">
        ← Tüm kanallara dön
      </Link>
    </div>
  )
}

