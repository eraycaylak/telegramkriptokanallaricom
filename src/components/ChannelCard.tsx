import Link from 'next/link'
import { Eye, Users, ShieldCheck, HeartPulse, ChevronRight } from 'lucide-react'
import { ChannelWithCategory } from '@/lib/types'
import VoteButton from './VoteButton'

interface ChannelCardProps {
  channel: ChannelWithCategory
  rank?: number
  variant?: 'list' | 'grid'
}

export default function ChannelCard({ channel, rank, variant = 'list' }: ChannelCardProps) {
  const initials = channel.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-cyan-600', 'bg-rose-600']
  const avatarColor = colors[channel.name.charCodeAt(0) % colors.length]

  // GRID variant
  if (variant === 'grid') {
    return (
      <div className="premium-card p-3 sm:p-4 flex flex-col items-center text-center group" style={{ overflow: 'hidden' }}>
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${avatarColor} flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-md border border-[var(--border-default)] mb-2 sm:mb-3 group-hover:scale-105 transition-transform flex-shrink-0`} style={{ overflow: 'hidden' }}>
          {channel.logo_url ? (
            <img src={channel.logo_url} alt={channel.name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
          ) : (
            initials
          )}
        </div>
        <Link href={`/kanal/${channel.slug}`} className="font-bold text-xs sm:text-sm text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors mb-1 w-full" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
          {channel.name}
        </Link>
        {channel.categories && (
          <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-muted)] mb-2 w-full" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
            {channel.categories.icon} {channel.categories.name}
          </span>
        )}
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-[var(--text-muted)] mb-2 sm:mb-3 font-medium">
          <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{channel.member_count && channel.member_count >= 1000 ? `${(channel.member_count/1000).toFixed(1)}k` : channel.member_count || '—'}</span>
          <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{channel.views > 1000 ? `${(channel.views/1000).toFixed(1)}k` : channel.views}</span>
        </div>
        <Link href={`/git/${channel.slug}`} className="btn-primary py-1.5 px-3 text-[10px] sm:text-xs font-bold w-full justify-center">
          Katıl
        </Link>
      </div>
    )
  }

  // LIST variant
  return (
    <div className="premium-card p-3 sm:p-4 flex flex-row items-center gap-2 sm:gap-3 group" style={{ overflow: 'hidden', maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}>
      {/* Rank */}
      {rank && (
        <div className={`stat-number text-xs sm:text-base font-black flex-shrink-0 ${rank <= 3 ? 'text-amber-500' : 'text-[var(--text-muted)]'}`} style={{ width: '20px', textAlign: 'center' }}>
          #{rank}
        </div>
      )}

      {/* Logo */}
      <div className={`rounded-xl ${avatarColor} flex items-center justify-center flex-shrink-0 font-bold text-white text-[10px] sm:text-sm shadow-sm border border-[var(--border-default)]`} style={{ width: '36px', height: '36px', minWidth: '36px', overflow: 'hidden' }}>
        {channel.logo_url ? (
          <img src={channel.logo_url} alt={channel.name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          initials
        )}
      </div>

      {/* Content */}
      <div style={{ flex: '1 1 0%', minWidth: 0, overflow: 'hidden' }}>
        {/* Name row */}
        <div className="flex items-center gap-1" style={{ minWidth: 0, overflow: 'hidden' }}>
          <Link href={`/kanal/${channel.slug}`} className="font-extrabold text-xs sm:text-base text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: '1 1 0%' }}>
            {channel.name}
          </Link>
          {channel.is_verified && (
            <ShieldCheck className="w-3 h-3 text-[var(--brand-primary)] flex-shrink-0" />
          )}
          {channel.is_premium && (
            <span className="badge badge-premium text-[8px] flex-shrink-0">PRO</span>
          )}
        </div>

        {/* Description */}
        <p className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-0.5 leading-snug" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
          {channel.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-2 text-[9px] sm:text-[11px] text-[var(--text-muted)] mt-1 font-medium flex-wrap">
          <VoteButton channelId={channel.id} initialVotes={channel.votes} />
          {channel.member_count && (
            <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{channel.member_count >= 1000 ? `${(channel.member_count/1000).toFixed(1)}k` : channel.member_count}</span>
          )}
          <span className="hidden sm:flex items-center gap-0.5"><Eye className="w-3 h-3" />{channel.views > 1000 ? `${(channel.views/1000).toFixed(1)}k` : channel.views}</span>
          {channel.trust_score > 0 && (
            <span className="hidden sm:flex items-center gap-0.5 font-bold text-emerald-500"><HeartPulse className="w-3 h-3" />{channel.trust_score}</span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <Link
        href={`/git/${channel.slug}`}
        className="btn-primary py-1.5 px-2.5 sm:px-4 text-[10px] sm:text-sm font-bold flex items-center justify-center gap-0.5 shadow-sm flex-shrink-0"
        style={{ whiteSpace: 'nowrap' }}
      >
        Katıl <ChevronRight className="w-3 h-3 hidden sm:block" />
      </Link>
    </div>
  )
}
