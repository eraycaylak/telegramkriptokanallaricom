import Link from 'next/link'
import { Eye, Users, ShieldCheck, HeartPulse, ChevronRight } from 'lucide-react'
import { ChannelWithCategory } from '@/lib/types'
import VoteButton from './VoteButton'

interface ChannelCardProps {
  channel: ChannelWithCategory
  rank?: number
  variant?: 'list' | 'grid'
}

/*
 * Mobilde overflow sorunu:
 * - Kart max-width:100% ve overflow:hidden
 * - İç yapı: [rank?] [logo] [content] [buton]
 * - content: flex-1 + min-w-0 + overflow-hidden (zorunlu)
 * - Tüm text elemanları: truncate (CSS değil, inline style)
 */
export default function ChannelCard({ channel, rank, variant = 'list' }: ChannelCardProps) {
  const initials = channel.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['#2563eb', '#059669', '#7c3aed', '#0891b2', '#e11d48']
  const avatarBg = colors[channel.name.charCodeAt(0) % colors.length]

  if (variant === 'grid') {
    return (
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: '12px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: 48, height: 48, borderRadius: 12,
            backgroundColor: avatarBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 12,
            overflow: 'hidden', flexShrink: 0, marginBottom: 8,
          }}
        >
          {channel.logo_url ? (
            <img src={channel.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" referrerPolicy="no-referrer" />
          ) : initials}
        </div>
        <Link href={`/kanal/${channel.slug}`} style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', display: 'block', textDecoration: 'none', marginBottom: 4 }}>
          {channel.name}
        </Link>
        {channel.categories && (
          <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', display: 'block' }}>
            {channel.categories.icon} {channel.categories.name}
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, color: 'var(--text-muted)', marginBottom: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}><Users style={{ width: 10, height: 10 }} />{channel.member_count && channel.member_count >= 1000 ? `${(channel.member_count/1000).toFixed(1)}k` : channel.member_count || '—'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}><Eye style={{ width: 10, height: 10 }} />{channel.views > 1000 ? `${(channel.views/1000).toFixed(1)}k` : channel.views}</span>
        </div>
        <Link href={`/git/${channel.slug}`} style={{ background: 'var(--brand-primary)', color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700, textDecoration: 'none', width: '100%', textAlign: 'center', display: 'block' }}>
          Katıl
        </Link>
      </div>
    )
  }

  // LIST variant — tüm stiller inline, Tailwind/CSS override yok
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        padding: '10px 12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Rank */}
      {rank && (
        <div style={{ fontWeight: 900, fontSize: 12, minWidth: 20, textAlign: 'center', flexShrink: 0, color: rank <= 3 ? '#f59e0b' : 'var(--text-muted)' }}>
          #{rank}
        </div>
      )}

      {/* Logo */}
      <div style={{ width: 36, height: 36, minWidth: 36, borderRadius: 10, backgroundColor: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, color: '#fff', fontWeight: 700, fontSize: 10, marginTop: 2 }}>
        {channel.logo_url ? (
          <img src={channel.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" referrerPolicy="no-referrer" />
        ) : initials}
      </div>

      {/* Content — MUST have min-width:0 to truncate in flex */}
      <div style={{ flex: '1 1 0%', minWidth: 0, overflow: 'hidden' }}>
        {/* Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
          <Link
            href={`/kanal/${channel.slug}`}
            style={{
              fontWeight: 800,
              fontSize: 13,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: '1 1 0%',
              minWidth: 0,
            }}
          >
            {channel.name}
          </Link>
          {channel.is_verified && <ShieldCheck style={{ width: 12, height: 12, flexShrink: 0, color: 'var(--brand-primary)' }} />}
        </div>

        {/* Description — 2 satır, sonra ... */}
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, lineHeight: 1.4, wordBreak: 'break-word' as const }}>
          {channel.description}
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
          <VoteButton channelId={channel.id} initialVotes={channel.votes} />
          {channel.member_count ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}><Users style={{ width: 10, height: 10 }} />{channel.member_count >= 1000 ? `${(channel.member_count/1000).toFixed(1)}k` : channel.member_count}</span>
          ) : null}
        </div>
      </div>

      {/* Katıl Button — flex-shrink-0, her zaman görünür */}
      <Link
        href={`/git/${channel.slug}`}
        style={{
          background: 'var(--brand-primary)',
          color: '#fff',
          padding: '6px 10px',
          borderRadius: 8,
          fontSize: 10,
          fontWeight: 700,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        Katıl
      </Link>
    </div>
  )
}
