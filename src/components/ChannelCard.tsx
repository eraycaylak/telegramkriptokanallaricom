import Link from 'next/link'
import { Eye, Users, Crown, Star, ShieldCheck, HeartPulse, ChevronRight, MessageSquareQuote } from 'lucide-react'
import { ChannelWithCategory } from '@/lib/types'
import VoteButton from './VoteButton'

interface ChannelCardProps {
  channel: ChannelWithCategory
  rank?: number
}

export default function ChannelCard({ channel, rank }: ChannelCardProps) {
  const initials = channel.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  
  const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-slate-800', 'bg-cyan-600']
  const avatarColor = colors[channel.name.charCodeAt(0) % colors.length]

  return (
    <div className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-3 sm:p-4 flex flex-row items-center gap-3 transition-all shadow-sm hover:shadow-md group relative">
      {/* Rank (if provided) */}
      {rank && (
        <div className={`text-sm sm:text-base font-black min-w-[1.2rem] text-center ${rank <= 3 ? 'text-amber-500' : 'text-slate-400'}`}>
          #{rank}
        </div>
      )}

      {/* Logo */}
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${avatarColor} flex items-center justify-center flex-shrink-0 font-bold text-white text-xs sm:text-sm shadow-sm border border-slate-100 overflow-hidden`}>
        {channel.logo_url ? (
          <img src={channel.logo_url} alt={channel.name} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>

      {/* Main Content Block */}
      <div className="flex-1 min-w-0 pr-16 sm:pr-0">
        
        {/* Top Line: Title & Core Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          
          <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
            <Link href={`/kanal/${channel.slug}`} className="font-extrabold text-sm sm:text-base text-slate-900 hover:text-blue-700 transition-colors truncate max-w-full">
              {channel.name}
            </Link>
            {channel.is_verified && (
              <span title="Doğrulanmış Kanal" className="flex items-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              </span>
            )}
            {channel.is_premium && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold tracking-wide shrink-0">PREMIUM</span>
            )}
            {channel.trust_score > 0 && (
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1 shrink-0">
                <HeartPulse className="w-3 h-3" /> {channel.trust_score}
              </span>
            )}
          </div>

          {/* Desktop Only Stats Horizontal */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 flex-shrink-0 font-medium">
             <VoteButton channelId={channel.id} initialVotes={channel.votes} />
             <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{channel.views > 1000 ? `${(channel.views/1000).toFixed(1)}k` : channel.views}</span>
             {channel.member_count && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{channel.member_count >= 1000 ? `${(channel.member_count/1000).toFixed(1)}k` : channel.member_count}</span>}
          </div>

        </div>

        {/* Second Line: Description / Cats */}
        <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5 sm:mt-1 pr-2 sm:pr-24 leading-snug">
           <span className="font-semibold text-slate-600 mr-1 hidden sm:inline">{channel.categories?.name} •</span>
           {channel.description}
        </p>

        {/* Mobile Only Stats Line */}
        <div className="flex sm:hidden items-center gap-2 text-[10px] text-slate-400 mt-1.5">
          <VoteButton channelId={channel.id} initialVotes={channel.votes} />
          <span>•</span>
          {channel.member_count && <span className="flex items-center gap-0.5"><Users className="w-3 h-3" />{channel.member_count >= 1000 ? `${(channel.member_count/1000).toFixed(1)}k` : channel.member_count}</span>}
          {channel.trust_score > 0 && <span className="flex items-center gap-0.5 font-bold text-emerald-600"><HeartPulse className="w-3 h-3" />{channel.trust_score}</span>}
        </div>

      </div>

      {/* Button Positioned to far right */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 sm:flex-shrink-0">
        <Link
          href={`/git/${channel.slug}`}
          className="btn-primary py-1.5 px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 shadow-sm whitespace-nowrap"
        >
          Katıl <ChevronRight className="w-3 h-3 hidden sm:block" />
        </Link>
      </div>

    </div>
  )
}
