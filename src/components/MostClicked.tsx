import { createClient } from '@/lib/supabase/server'
import { ChannelWithCategory } from '@/lib/types'
import ChannelCard from './ChannelCard'
import { Flame } from 'lucide-react'
import Link from 'next/link'

export default async function MostClicked() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('channels')
    .select('*, categories(*)')
    .eq('is_approved', true)
    .eq('is_promoted', true)
    .order('promoted_order', { ascending: true })
    .order('views', { ascending: false })
    .limit(8)

  const channels = (data ?? []) as ChannelWithCategory[]

  if (channels.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-md">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">Çok Tıklananlar</h2>
            <p className="text-xs text-[var(--text-muted)] font-medium hidden sm:block">En çok ilgi gören kanallar</p>
          </div>
        </div>
        <Link href="/en-iyi-kanallar" className="text-xs font-bold text-[var(--brand-primary)] hover:underline">
          Tümü →
        </Link>
      </div>

      {/* 2x2 on mobile, 4 across on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
        {channels.map((ch) => (
          <ChannelCard key={ch.id} channel={ch} variant="grid" />
        ))}
      </div>
    </section>
  )
}
