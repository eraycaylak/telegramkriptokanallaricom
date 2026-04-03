export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Güvenilir Telegram Sinyal Kanalları | Doğrulanmış VIP Gruplar',
  description: 'Dolandırıcılık riski olmayan, şeffaf işlem geçmişi ve doğru analiz paylaşan en güvenilir Telegram sinyal kanalları listesi.',
  alternates: { canonical: '/guvenilir-telegram-sinyal-kanallari' },
}

export default async function GuvenilirTelegramSinyalKanallari() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('votes', { ascending: false }).limit(50)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-4">🛡️ Güvenilir Telegram Sinyal Kanalları</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Kripto para sektörünün en büyük dezavantajı olan sahte sinyal kanalları hesaplarından korunmak için, %100 doğrulanmış ve topluluk oylamasında yüksek puan alan <strong className="text-slate-800">Güvenilir Telegram Sinyal Kanalları</strong> listemizi kullanın. Başarılı trade süreçleri için stop-loss (zarar kes) kurallarını çiğnemeyen, vaat satmayan bu gruplar yatırım serüveninizde rehber niteliğindedir.
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
