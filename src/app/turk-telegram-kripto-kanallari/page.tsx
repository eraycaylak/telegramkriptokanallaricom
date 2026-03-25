import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ChannelCard from '@/components/ChannelCard'
import { ChannelWithCategory } from '@/lib/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Türk Telegram Kripto Kanalları | En İyi 2026 Listesi',
  description: 'Türkiye\'nin en iyi ve en aktif Türk Telegram Kripto Kanalları listesi. Türkçe sinyal, analiz ve kripto para haber paylaşımları yapan yerli telegram grupları.',
  alternates: { canonical: '/turk-telegram-kripto-kanallari' },
}

export default async function TurkTelegramKriptoKanallari() {
  const supabase = await createClient()
  const { data } = await supabase.from('channels').select('*, categories(*)').eq('is_approved', true).eq('language', 'tr').order('votes', { ascending: false }).limit(50)
  const channels = (data ?? []) as ChannelWithCategory[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-100 mb-4">🇹🇷 Türk Telegram Kripto Kanalları</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Kripto para piyasasını takip ederken kendi dilinizde anlık haber almak, teknik analizleri Türkçe olarak detaylıca incelemek ve yerel toplulukların fikirlerini öğrenmek büyük bir avantajdır. Aşağıdaki liste, %100 Türkçe yayın yapan, tamamen <strong className="text-slate-200">Türk Telegram Kripto Kanalları</strong> arasından en iyilerini kullanıcı oylarıyla karşınıza getirmektedir. Ücretsiz veya premium seçeneklerle en aktif Türk Telegram sinyal kanallarına hemen katılın.
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
