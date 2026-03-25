import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Yeni Telegram Kripto Kanalları | Yeni Kurulan Gruplar',
  description: 'Piyasaya yeni dahil olan, potansiyeli yüksek yeni telegram kripto kanalları ve taze analiz grupları.',
  alternates: { canonical: '/yeni-telegram-kripto-kanallari' },
}

export default async function YeniTelegramKriptoKanallari() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('created_at', { ascending: false }).limit(50)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-100 mb-4">✨ Yeni Telegram Kripto Kanalları</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Henüz keşfedilmemiş ancak yüksek getiri potansiyeli taşıyan en güncel analiz ve bilgi paylaşım platformları bu listede. Sürekli güncellenen <strong className="text-slate-200">Yeni Telegram Kripto Kanalları</strong> arşivimizle, kripto dünyasındaki en yeni topluluklara ilk girenlerden biri olun ve yeni nesil analiz şanslarını kaçırmayın.
        </p>
      </div>

      <div className="space-y-3">
        {channels.length > 0 ? channels.map((ch, i) => (
          <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
        )) : (
          <div className="glass-card p-12 text-center text-slate-500">Henüz kanal bulunamadı.</div>
        )}
      </div>

      <div className="mt-12 text-center border-t border-white/5 pt-8">
        <Link href="/kanallar" className="btn-secondary px-6">Tüm Kanalları İncele</Link>
      </div>
    </div>
  )
}
