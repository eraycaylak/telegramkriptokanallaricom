import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import { Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'En İyi Telegram Kripto Kanalları 2026',
  description: 'Kullanıcı değerlendirmelerine göre en iyi Telegram kripto kanalları. En güvenilir Bitcoin sinyal, Ethereum haber ve DeFi kanalları.',
  alternates: { canonical: '/en-iyi-kanallar' },
}

export default async function EnIyiKanallarPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('votes', { ascending: false }).order('views', { ascending: false }).limit(50)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Star className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">⭐ En İyi Telegram Kripto Kanalları 2026</h1>
          <p className="text-slate-500 text-sm">Topluluk oyları ve görüntülenme sayısına göre sıralanmış en iyi kanallar</p>
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
