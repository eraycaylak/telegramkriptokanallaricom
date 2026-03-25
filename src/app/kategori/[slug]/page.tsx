import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory, Category } from '@/lib/types'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').eq('slug', slug).single()
  if (!data) return { title: 'Kategori Bulunamadı' }
  const cat = data as Category
  return {
    title: `${cat.name} Telegram Kanalları`,
    description: `${cat.name} kategorisindeki en iyi Telegram kripto kanalları. ${cat.description ?? ''}`,
    alternates: { canonical: `/kategori/${cat.slug}` },
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

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.name} Telegram Kripto Kanalları`,
    description: cat.description,
    url: `https://www.telegramkriptokanallari.com/kategori/${cat.slug}`,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <nav className="flex items-center gap-2 text-xs text-slate-600 mb-6">
        <Link href="/" className="hover:text-slate-400">Ana Sayfa</Link>
        <span>/</span>
        <span className="text-slate-400">Kategoriler</span>
        <span>/</span>
        <span className="text-slate-400">{cat.name}</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <div className="text-4xl">{cat.icon}</div>
        <div>
          <h1 className="text-2xl font-black text-slate-100">{cat.name} Telegram Kanalları</h1>
          <p className="text-slate-500 text-sm mt-1">{cat.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {typedChannels.length > 0 ? (
          typedChannels.map((ch, i) => (
            <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
          ))
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-500">Bu kategoride henüz onaylı kanal yok.</p>
            <Link href="/kanal-ekle" className="btn-primary mt-4 inline-flex">Kanal Ekle</Link>
          </div>
        )}
      </div>

      <Link href="/kanallar" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mt-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tüm kanallara dön
      </Link>
    </div>
  )
}
