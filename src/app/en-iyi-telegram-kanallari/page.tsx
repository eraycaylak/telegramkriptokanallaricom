import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'
import { Calendar, Crown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'En İyi Telegram Kanalları | Kesin Top 10 Listesi',
  description: 'Türkiye ve küresel pazardaki en iyi, en büyük ve en hızlı kripto para telegram kanalları listesi. Kriptoda başarı için takip etmeniz gereken dev liste.',
  alternates: { canonical: '/en-iyi-telegram-kanallari' },
}

export default async function EnIyiTelegramKanallari() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('votes', { ascending: false }).limit(10)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 border-b border-white/10 pb-8 relative">
        <div className="absolute top-0 right-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
          <Calendar className="w-3 h-3" /> Son Güncelleme: 25 Mart 2026
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 mt-8 flex items-center gap-3">
          <Crown className="w-8 h-8 text-amber-400" /> En İyi Telegram Kanalları
        </h1>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6">
          Sadece kripto dünyasının elit gruplarının seçildiği, sahte kullanıcıların ve vaatlerin olmadığı, tamamen gerçek üye etkileşimine ve kazanç oranlarına (win-rate) göre filtrelenmiş <strong>En İyi Telegram Kanalları Top 10</strong> listesi içerisindesiniz. Bu liste, kullanıcı geri dönüşleriyle canlı olarak ve düzenli güncellenmektedir.
        </p>
      </div>

      <div className="space-y-4">
        {channels.length > 0 ? channels.map((ch, i) => (
          <div key={ch.id} className="relative">
            <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-black text-slate-900 text-sm z-10 shadow-lg shadow-amber-500/20 border border-amber-300">
              #{i + 1}
            </div>
            <ChannelCard channel={ch} rank={i + 1} />
          </div>
        )) : (
          <div className="glass-card p-12 text-center text-slate-500">Liste oluşturuluyor...</div>
        )}
      </div>

      <div className="mt-12 text-center border-t border-white/5 pt-8">
        <Link href="/kanallar" className="btn-secondary px-6">Tümünü Kesfet</Link>
      </div>
    </div>
  )
}
