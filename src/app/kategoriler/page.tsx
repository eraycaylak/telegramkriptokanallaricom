import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Category } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Tüm Telegram Kategorileri',
  description: 'Kripto Para, Bitcoin Sinyal, DeFi, Airdrop, Haber yayınları gibi tüm kripto Telegram kanal kategorilerini inceleyin.',
}

export default async function KategorilerPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('channel_count', { ascending: false })
  const categories = (data ?? []) as Category[]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Telegram Kanal Kategorileri</h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
          İlgi alanınıza en uygun kripto yayınını bulmak için ana kategorilerimizi keşfedin. Günlük day-trade sinyallerinden uzun vadeli zincir üstü analiz gruplarına her şey burada.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/kategori/${cat.slug}`}
            className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center justify-center text-center h-56"
          >
            <div className="w-16 h-16 bg-blue-50/80 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              {cat.icon}
            </div>
            <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">{cat.name}</h2>
            <div className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{cat.channel_count} KANAL</div>
            {cat.description && (
              <p className="text-xs text-slate-500 mt-3 line-clamp-2">{cat.description}</p>
            )}
          </Link>
        ))}
      </div>
      
    </div>
  )
}
