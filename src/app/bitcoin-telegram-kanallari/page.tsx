export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Bitcoin Telegram Kanalları | En İyi BTC Analiz Odaları',
  description: 'Sadece Bitcoin (BTC) yönü, likiditesi ve on-chain analizi paylaşan uzman Bitcoin Telegram Kanalları. Kaliteli BTC analiz gruplarını keşfedin.',
  alternates: { canonical: '/bitcoin-telegram-kanallari' },
}

export default async function BitcoinTelegramKanallari() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).ilike('name', '%bitcoin%').order('votes', { ascending: false }).limit(50)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-4">🟠 Bitcoin Telegram Kanalları</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Kriptonun kralı Bitcoin&apos;in yönü, tüm altcoin piyasasını doğrudan belirler. Sadece Bitcoin (BTC) paritelerine sadık kalan profesyonel <strong className="text-slate-800">Bitcoin Telegram Kanalları</strong>; zincir üstü (on-chain) veriler, balina transferleri, zorluk seviyeleri ve günlük kapanış destek/direnç analizlerini sizinle paylaşır. En saygın BTC analiz telegram gruplarını aşağıdan inceleyebilir ve aralarına katılabilirsiniz.
        </p>
      </div>

      <div className="space-y-3">
        {channels.length > 0 ? channels.map((ch, i) => (
          <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
        )) : (
          <div className="glass-card p-12 text-center text-slate-500">Şu anda Bitcoin etiketli özel kanal bulunmuyor.</div>
        )}
      </div>

      <div className="mt-12 text-center border-t border-white/5 pt-8">
        <Link href="/kanallar" className="btn-secondary px-6">Tüm Kanalları İncele</Link>
      </div>
    </div>
  )
}
