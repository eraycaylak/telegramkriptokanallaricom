import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import AdBanner from '@/components/AdBanner'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { ChannelWithCategory, Category } from '@/lib/types'
import { Filter, Search, LayoutGrid, List } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tüm Telegram Kripto Kanalları',
  description: 'Tüm Telegram kripto kanallarını inceleyin. Bitcoin, Ethereum, DeFi, NFT ve sinyal kanallarını kategori ve dil bazında filtreleyin.',
  alternates: { canonical: '/kanallar' },
}

interface Props {
  searchParams: Promise<{ kategori?: string; dil?: string; siralama?: string; q?: string }>
}

export default async function KanallarPage({ searchParams }: Props) {
  const params = await searchParams
  const { kategori, dil, siralama = 'votes', q } = params

  const supabase = await createClient()

  let query = supabase
    .from('channels')
    .select('*, categories(*)')
    .eq('is_approved', true)

  if (kategori) query = query.eq('categories.slug', kategori)
  if (dil) query = query.eq('language', dil)
  if (q) query = query.ilike('name', `%${q}%`)

  const orderField = siralama === 'yeni' ? 'created_at' : siralama === 'goruntulenme' ? 'views' : 'votes'
  query = query.order(orderField, { ascending: false })

  const { data: channels } = await query.limit(50)
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  const typedChannels = (channels ?? []) as ChannelWithCategory[]
  const typedCategories = (categories ?? []) as Category[]

  const sortOptions = [
    { val: 'votes', lbl: '🔥 En Popüler' },
    { val: 'yeni', lbl: '🆕 En Yeni' },
    { val: 'goruntulenme', lbl: '👁 En Çok Görüntülenen' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav items={[
        { label: 'Ana Sayfa', href: '/' },
        { label: 'Kanallar' },
      ]} />

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-2">Telegram Kripto Kanalları</h1>
        <p className="text-[var(--text-muted)] text-sm font-medium">
          {typedChannels.length} kanal listeleniyor {q && <span className="text-[var(--brand-primary)]">— "{q}" araması</span>}
        </p>
      </div>

      {/* Filters */}
      <div className="premium-card p-3 sm:p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
          <form method="GET" action="/kanallar" className="flex-1">
            <input
              name="q"
              defaultValue={q}
              placeholder="Kanal ara..."
              className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none font-medium"
            />
          </form>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-[var(--text-muted)]" />
          {sortOptions.map((opt) => (
            <Link
              key={opt.val}
              href={`/kanallar?siralama=${opt.val}${kategori ? `&kategori=${kategori}` : ''}${q ? `&q=${q}` : ''}`}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all font-semibold ${siralama === opt.val ? 'bg-[var(--brand-primary)] text-white shadow-sm' : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'}`}
            >
              {opt.lbl}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0 space-y-4">
          <div className="premium-card p-4">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Kategoriler</h3>
            <div className="space-y-1">
              <Link
                href="/kanallar"
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all font-medium ${!kategori ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'}`}
              >
                <span>🌐 Tümü</span>
              </Link>
              {typedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/kanallar?kategori=${cat.slug}`}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all font-medium ${kategori === cat.slug ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'}`}
                >
                  <span>{cat.icon} {cat.name}</span>
                  <span className="stat-number text-xs text-[var(--text-muted)]">{cat.channel_count}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar Ad */}
          <AdBanner position="sidebar_sticky" className="rounded-xl" />
        </aside>

        {/* Channel List */}
        <div className="flex-1 space-y-3 stagger-children">
          {typedChannels.length > 0 ? (
            typedChannels.map((ch, i) => (
              <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
            ))
          ) : (
            <div className="premium-card p-12 text-center">
              <p className="text-[var(--text-muted)] font-medium">Henüz bu kriterlerde kanal bulunamadı.</p>
              <Link href="/kanal-ekle" className="btn-primary mt-4 inline-flex">İlk Kanalı Ekle</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
