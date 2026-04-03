export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Trending Telegram Kanalları | Yükselişteki Kripto Gruplar',
  description: 'Son günlerde popülaritesi hızla artan, en çok aranan ve Google üzerinden en çok tıklanan Trending Telegram Kripto Kanalları listesi.',
  alternates: { canonical: '/trending-telegram-kanallari' },
}

export default async function TrendingTelegramKanallariPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('votes', { ascending: false }).limit(30)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-4">🔥 Trending Telegram Kanalları</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Kitlelerin dikkatini kısa sürede üzerine çeken ve <strong>Trend</strong> olan en popüler Telegram kripto kanalları. Hızlı üye ivmesi ve isabetli sinyal bildirimleriyle sektörün gündeminde olan topluluklara siz de katılın.
        </p>
      </div>

      <div className="space-y-3">
        {channels.length > 0 ? channels.map((ch, i) => (
          <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
        )) : (
          <div className="glass-card p-12 text-center text-slate-500">Şu anda listede veri bulunmuyor.</div>
        )}
      </div>

      <div className="mt-12 text-center border-t border-white/5 pt-8">
        <Link href="/kanallar" className="btn-secondary px-6">Tümünü Kesfet</Link>
      </div>
    </div>
  )
}
