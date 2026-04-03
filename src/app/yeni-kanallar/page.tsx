export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import { Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Yeni Telegram Kripto Kanalları',
  description: 'Dizine yeni eklenen ve editörlerimiz tarafından güvenilirlik onayından geçen en taze Telegram kripto kanalları.',
  alternates: { canonical: '/yeni-kanallar' },
}

export default async function YeniKanallarPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('approved_at', { ascending: false, nullsFirst: false }).limit(50)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">⚡ Yeni Doğrulanan Kanallar</h1>
          <p className="text-slate-500 text-sm">Sisteme en son eklenen ve onaydan geçen taze kripto toplulukları</p>
        </div>
      </div>
      <div className="space-y-3">
        {channels.map((ch, i) => (
          <ChannelCard key={ch.id} channel={ch} />
        ))}
      </div>
    </div>
  )
}
