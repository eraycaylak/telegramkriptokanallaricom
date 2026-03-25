import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import { TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Trending Telegram Kripto Kanalları',
  description: 'Bu haftanın en popüler ve en çok oy alan Telegram kripto kanalları. Güncel trending Bitcoin, Ethereum ve altcoin takip kanalları.',
  alternates: { canonical: '/trending' },
}

export default async function TrendingPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('votes', { ascending: false }).limit(30)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">🔥 Trending Kanallar</h1>
          <p className="text-slate-500 text-sm">En çok oy alan ve konuşulan kanallar</p>
        </div>
      </div>
      <div className="space-y-3">
        {channels.map((ch, i) => (
          <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}
