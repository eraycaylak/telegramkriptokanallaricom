import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'En Çok Kazandıran Telegram Kanalları | Yüksek Win-Rate',
  description: 'Zarar kes (stop-loss) kurallarına uyan ve en çok kazanç sağlayan şeffaf geçmişe sahip kripto para telegram grupları.',
  alternates: { canonical: '/en-cok-kazanilan-telegram-kanallari' },
}

export default async function EnCokKazanilanTelegramKanallari() {
  const supabase = await createClient()
  // Oy sıralaması en yüksekleri çekiyoruz
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).order('votes', { ascending: false }).limit(20)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-4">🚀 En Çok Kazandıran Telegram Kanalları</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Kripto dünyasında kar elde etmenin en güvenli yollarından biri, win-rate oranı yüksek kanallara dahil olmaktır. Şeffaflığıyla bilinen, hedef ve zararkes paylaşımlarını dürüstçe yapan <strong className="text-slate-800">En Çok Kazandıran Telegram Kanalları</strong> listesi, sizlerden gelen on binlerce değerlendirmeyle oluşturuldu. Boğa veya ayı piyasası fark etmeksizin kazanç odaklı fırsatları değerlendirin.
        </p>
      </div>

      <div className="space-y-3">
        {channels.length > 0 ? channels.map((ch, i) => (
          <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
        )) : (
          <div className="glass-card p-12 text-center text-slate-500">Liste güncelleniyor...</div>
        )}
      </div>

      <div className="mt-12 text-center border-t border-white/5 pt-8">
        <Link href="/kanallar" className="btn-secondary px-6">Tüm Kanalları İncele</Link>
      </div>
    </div>
  )
}
