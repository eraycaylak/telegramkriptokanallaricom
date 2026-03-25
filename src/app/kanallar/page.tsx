import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory, Category } from '@/lib/types'
import { Filter, Search } from 'lucide-react'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Telegram Kripto Kanalları</h1>
        <p className="text-slate-500 text-sm">
          {typedChannels.length} kanal listeleniyor
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <form method="GET" action="/kanallar" className="flex-1">
            <input
              name="q"
              defaultValue={q}
              placeholder="Kanal ara..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-600 outline-none"
            />
          </form>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-500" />
          {sortOptions.map((opt) => (
            <Link
              key={opt.val}
              href={`/kanallar?siralama=${opt.val}${kategori ? `&kategori=${kategori}` : ''}`}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${siralama === opt.val ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
            >
              {opt.lbl}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Kategoriler</h3>
            <div className="space-y-1">
              <Link
                href="/kanallar"
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${!kategori ? 'bg-violet-600/20 text-violet-300' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <span>🌐 Tümü</span>
              </Link>
              {typedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/kanallar?kategori=${cat.slug}`}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${kategori === cat.slug ? 'bg-violet-600/20 text-violet-300' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  <span>{cat.icon} {cat.name}</span>
                  <span className="text-xs text-slate-600">{cat.channel_count}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Channel List */}
        <div className="flex-1 space-y-3">
          {typedChannels.length > 0 ? (
            typedChannels.map((ch, i) => (
              <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
            ))
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-slate-500">Henüz bu kriterlerde kanal bulunamadı.</p>
              <Link href="/kanal-ekle" className="btn-primary mt-4 inline-flex">İlk Kanalı Ekle</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
