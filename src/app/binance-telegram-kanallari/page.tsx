import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Binance Telegram Kanalları | Binance Sinyal ve Altcoin Grupları',
  description: 'Sadece Binance borsasında yer alan coinler (BTC, ETH ve Altcoinler) için analiz, sinyal ve haber veren en kaliteli Binance Telegram Kanalları.',
  alternates: { canonical: '/binance-telegram-kanallari' },
}

export default async function BinanceTelegramKanallari() {
  const supabase = await createClient()
  // "binance" kelimesi geçen kanalları filtreliyoruz
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).ilike('name', '%binance%').order('votes', { ascending: false }).limit(50)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-100 mb-4">🟡 Binance Telegram Kanalları</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Dünyanın en büyük borsası Binance üzerinde aktif işlem veriyorsanız, sadece Binance listelemesi olan coin ve tokenlara odaklanan <strong className="text-slate-200">Binance Telegram Kanalları</strong> arayışındasınız demektir. Vadeli (Futures) ve Spot piyasadaki en taze long / short sinyallerini yayınlayan, Binance Launchpool airdroplarını haber veren en isabetli Telegram kripto gruplarını keşfedin.
        </p>
      </div>

      <div className="space-y-3">
        {channels.length > 0 ? channels.map((ch, i) => (
          <ChannelCard key={ch.id} channel={ch} rank={i + 1} />
        )) : (
          <div className="glass-card p-12 text-center text-slate-500">Şu anda Binance etiketli özel kanal yok, genel listeyi incelemelisiniz.</div>
        )}
      </div>

      <div className="mt-12 text-center border-t border-white/5 pt-8">
        <Link href="/kanallar" className="btn-secondary px-6">Tüm Kanalları İncele</Link>
      </div>
    </div>
  )
}
