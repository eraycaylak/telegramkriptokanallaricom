export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ücretsiz Telegram Kripto Kanalları | Para Ödemeden Sinyal Takibi',
  description: 'Hiçbir ücret ödemeden giriş yapabileceğiniz ücretsiz Telegram kripto kanalları ve sinyal grupları. Her gün bedava analiz paylaşan VIP kalitesindeki kanallar.',
  alternates: { canonical: '/ucretsiz-telegram-kripto-kanallari' },
}

export default async function UcretsizTelegramKriptoKanallari() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).eq('is_premium', false).order('votes', { ascending: false }).limit(50)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-4">🆓 Ücretsiz Telegram Kripto Kanalları</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Kripto para piyasasına yeni giren yatırımcıların binlerce dolar harcayarak paralı gruplara girmesine gerek yok. <strong className="text-slate-800">Ücretsiz telegram kripto kanalları</strong> sayesinde, piyasanın usta işlemcilerinden güncel analiz ve işlemleri bedavaya takip edebilirsiniz. Reklam veya sponsorluk modeliyle gelir elde eden bu kanallar, takipçilerine tamamı ile açık bir analiz servisi sunar. En güvenilir ve ücretsiz Telegram sinyal kanallarını aşağıda oylama sırasına göre bulabilirsiniz.
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
