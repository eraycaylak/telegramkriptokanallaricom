export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import BreadcrumbNav from '@/components/BreadcrumbNav'
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav items={[
        { label: 'Ana Sayfa', href: '/' },
        { label: 'En İyi Kanallar' },
      ]} />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-md">
          <Star className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">⭐ En İyi Telegram Kripto Kanalları 2026</h1>
          <p className="text-[var(--text-muted)] text-sm font-medium">Topluluk oyları ve görüntülenme sayısına göre sıralanmış</p>
        </div>
      </div>
      <div className="space-y-3 stagger-children">
        {channels.map((ch, i) => (
          <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}
