import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Premium Telegram Kripto Kanalları ve Özel VIP Sinyal Grupları',
  description: 'Yüksek doğruluk oranı, net entry ve stop-loss ile profesyonel sinyal sağlayan ücretli / premium Telegram kripto kanalları incelemesi.',
  alternates: { canonical: '/premium-telegram-kripto-kanallari' },
}

export default async function PremiumTelegramKriptoKanallari() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).eq('is_premium', true).order('votes', { ascending: false }).limit(50)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-4">👑 Premium Telegram Kripto Kanalları</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Sadece kurumsal seviyede işlemler yapan ve 7/24 tam zamanlı destek sağlayan <strong className="text-slate-800">Premium Telegram Kripto Kanalları</strong>, yüksek kazanç oranları ve benzersiz analiz metodlarıyla ayrışır. Sadece sinyal atmakla kalmayıp risk ödül oranlarınızı koruyan, birebir mentörlük hizmeti verebilen VIP abonelik modelli Telegram gruplarının en güvenilir olanlarını sizler için derledik. Paranızı doğru yerde kullanmak ve SCAM VIP gruplardan kaçınmak için aşağıdaki kanallar listesine göz atın.
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
