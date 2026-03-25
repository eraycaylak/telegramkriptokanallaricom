import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Türk Telegram Sinyal Kanalları | Yerli Analiz Toplulukları',
  description: 'Türkiye\'deki kripto para yatırımcılarına Türkçe sinyal ve analiz sağlayan en başarılı yerli telegram sinyal kanalları.',
  alternates: { canonical: '/turk-telegram-sinyal-kanallari' },
}

export default async function TurkTelegramSinyalKanallari() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).eq('language', 'tr').order('votes', { ascending: false }).limit(50)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-4">📈 Türk Telegram Sinyal Kanalları</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Yerli yatırımcının en büyük kozu kendi dilinde analiz takip edebilmektir. Listelediğimiz <strong className="text-slate-800">Türk Telegram Sinyal Kanalları</strong>, global trendleri Türkiye piyasasına uyarlayarak nokta atışı destek/direnç, spot alım hedefleri ve futures long/short bildirimleri atar. %100 yerli Türk Kripto gruplarına katılmak için aşağıdaki sıralamayı inceleyin.
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
