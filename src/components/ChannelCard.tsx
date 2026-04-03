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

  if (variant === 'grid') {
    return (
      <div className="premium-card p-4 flex flex-col items-center text-center group">
        {/* Logo */}
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${avatarColor} flex items-center justify-center font-bold text-white text-sm shadow-md border border-[var(--border-default)] overflow-hidden mb-3 group-hover:scale-105 transition-transform`}>
          {channel.logo_url ? (
            <img src={channel.logo_url} alt={channel.name} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>

        {/* Name */}
        <Link href={`/kanal/${channel.slug}`} className="font-bold text-sm text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors line-clamp-1 mb-1 w-full">
          {channel.name}
        </Link>

        {/* Category */}
        {channel.categories && (
          <span className="text-[10px] font-semibold text-[var(--text-muted)] mb-2">
            {channel.categories.icon} {channel.categories.name}
          </span>
        )}

        {/* Trust score ring */}
        {channel.trust_score > 0 && (
          <div
            className="trust-ring bg-[var(--bg-card)] text-[var(--brand-success)] text-[10px] mb-3"
            style={{ '--score': channel.trust_score } as React.CSSProperties}
          >
            {channel.trust_score}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] mb-3 font-medium">
          <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{channel.views > 1000 ? `${(channel.views/1000).toFixed(1)}k` : channel.views}</span>
          {channel.member_count && <span className="flex items-center gap-0.5"><Users className="w-3 h-3" />{channel.member_count >= 1000 ? `${(channel.member_count/1000).toFixed(1)}k` : channel.member_count}</span>}
        </div>

        {/* CTA */}
        <Link
          href={`/git/${channel.slug}`}
          className="btn-primary py-1.5 px-4 text-xs font-bold w-full justify-center"
        >
          Katıl
        </Link>
      </div>
    )
  }

  // LIST variant (default)
  return (
    <div className="premium-card p-3 sm:p-4 flex flex-row items-center gap-3 group">
      {/* Rank */}
      {rank && (
        <div className={`stat-number text-sm sm:text-base font-black min-w-[1.5rem] text-center ${rank <= 3 ? 'text-amber-500' : 'text-[var(--text-muted)]'}`}>
          #{rank}
        </div>
      )}

      {/* Logo */}
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${avatarColor} flex items-center justify-center flex-shrink-0 font-bold text-white text-xs sm:text-sm shadow-sm border border-[var(--border-default)] overflow-hidden`}>
        {channel.logo_url ? (
          <img src={channel.logo_url} alt={channel.name} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-16 sm:pr-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
            <Link href={`/kanal/${channel.slug}`} className="font-extrabold text-sm sm:text-base text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors truncate max-w-full">
              {channel.name}
            </Link>
            {channel.is_verified && (
              <span title="Doğrulanmış Kanal" className="flex items-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              </span>
            )}
            {channel.is_premium && (
              <span className="badge badge-premium text-[9px] shrink-0">PRO</span>
            )}
            {channel.trust_score > 0 && (
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md ml-0.5 shrink-0">
                <HeartPulse className="w-3 h-3" /> {channel.trust_score}
              </span>
            )}
          </div>

          {/* Desktop Stats */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-[var(--text-muted)] flex-shrink-0 font-medium">
            <VoteButton channelId={channel.id} initialVotes={channel.votes} />
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{channel.views > 1000 ? `${(channel.views/1000).toFixed(1)}k` : channel.views}</span>
            {channel.member_count && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{channel.member_count >= 1000 ? `${(channel.member_count/1000).toFixed(1)}k` : channel.member_count}</span>}
          </div>
        </div>

        {/* Description */}
        <p className="text-[11px] sm:text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5 sm:mt-1 pr-2 sm:pr-24 leading-snug">
          <span className="font-semibold text-[var(--text-secondary)] mr-1 hidden sm:inline">{channel.categories?.name} •</span>
          {channel.description}
        </p>

        {/* Mobile Stats */}
        <div className="flex sm:hidden items-center gap-2 text-[10px] text-[var(--text-muted)] mt-1.5">
          <VoteButton channelId={channel.id} initialVotes={channel.votes} />
          <span>•</span>
          {channel.member_count && <span className="flex items-center gap-0.5"><Users className="w-3 h-3" />{channel.member_count >= 1000 ? `${(channel.member_count/1000).toFixed(1)}k` : channel.member_count}</span>}
          {channel.trust_score > 0 && <span className="flex items-center gap-0.5 font-bold text-emerald-500"><HeartPulse className="w-3 h-3" />{channel.trust_score}</span>}
        </div>
      </div>

      {/* CTA Button */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 sm:flex-shrink-0">
        <Link
          href={`/git/${channel.slug}`}
          className="btn-primary py-1.5 px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1 shadow-sm whitespace-nowrap"
        >
          Katıl <ChevronRight className="w-3 h-3 hidden sm:block" />
        </Link>
      </div>
    </div>
  )
}
