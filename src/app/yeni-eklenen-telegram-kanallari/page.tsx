import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Yeni Eklenen Telegram Kanalları | Son Çıkan Gruplar',
  description: 'Dizin platformumuza saniyeler önce dahil onayı almış yeni eklenen Telegram kripto kanalları ve güncel taze sinyal listeleri.',
  alternates: { canonical: '/yeni-eklenen-telegram-kanallari' },
}

export default async function YeniEklenenTelegramKanallari() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('created_at', { ascending: false }).limit(50)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-100 mb-4">🆕 Yeni Eklenen Telegram Kanalları</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Onaylama kalkanımızdan henüz geçmiş, yepyeni stratejiler ve analiz metotları barındıran taze kanal listesidir. <strong>Yeni Eklenen Telegram Kanalları</strong> bölümünden erken fırsatları (airdrop, presale) sağlayan potansiyel liderleri önceden keşfedebilirsiniz.
        </p>
      </div>

      <div className="space-y-3">
        {channels.length > 0 ? channels.map((ch, i) => (
          <ChannelCard key={ch.id} channel={ch} />
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
