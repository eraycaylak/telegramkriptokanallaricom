import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'En İyi Telegram Kripto Kanalları 2026 | Top 10 Sinyal Grubu',
  description: '2026 yılının en başarılı, en çok takip edilen ve en yüksek isabet oranına sahip Top 10 Telegram Kripto Kanalları listesi.',
  alternates: { canonical: '/en-iyi-telegram-kripto-kanallari-2026' },
}

export default async function EnIyiTelegramKriptoKanallari2026() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('votes', { ascending: false }).limit(10)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 border-b border-white/10 pb-8 relative">
        <div className="absolute top-0 right-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
          <Calendar className="w-3 h-3" /> Son Güncelleme: 25 Mart 2026
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 mb-4 mt-8">🏆 En İyi Telegram Kripto Kanalları 2026</h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
          Kripto para piyasalarında başarı, sağlam bir analiz ve anlık bilgi akışı gerektirir. Sizin için derlediğimiz bu <strong className="text-slate-200">2026 yılına özel Top 10 listesi</strong>, hem ücretsiz hem de premium analizleriyle liderliğini koruyan en prestijli grupları listeler. Tüm sıralamalar tamamen gerçek kullanıcıların verdikleri şeffaf oylara dayanmaktadır.
        </p>
      </div>

      <div className="space-y-4">
        {channels.length > 0 ? channels.map((ch, i) => (
          <div key={ch.id} className="relative">
            <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center font-black text-white text-sm z-10 shadow-lg border-2 border-slate-950">
              {i + 1}
            </div>
            <ChannelCard channel={ch} rank={i + 1} />
          </div>
        )) : (
          <div className="glass-card p-12 text-center text-slate-500">Liste güncelleniyor...</div>
        )}
      </div>

      <div className="mt-12 text-center border-t border-white/5 pt-8">
        <Link href="/kanallar" className="btn-secondary px-6">Diğer Tüm Kanalları İncele</Link>
      </div>
    </div>
  )
}
