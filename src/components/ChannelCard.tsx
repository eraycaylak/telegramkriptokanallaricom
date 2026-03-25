import Link from 'next/link'
import { ThumbsUp, Eye, Users, Crown, Star, ExternalLink, MessageCircle } from 'lucide-react'
import { ChannelWithCategory } from '@/lib/types'

interface ChannelCardProps {
  channel: ChannelWithCategory
  rank?: number
}

export default function ChannelCard({ channel, rank }: ChannelCardProps) {
  const initials = channel.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const gradients = [
    'from-violet-600 to-blue-500',
    'from-blue-600 to-cyan-500',
    'from-emerald-600 to-teal-500',
    'from-orange-600 to-amber-500',
    'from-pink-600 to-rose-500',
    'from-indigo-600 to-violet-500',
  ]
  const gradient = gradients[channel.name.charCodeAt(0) % gradients.length]

  return (
    <div className="glass-card p-4 flex items-start gap-4 group">
      {/* Rank */}
      {rank && (
        <div className={`text-lg font-black min-w-[2rem] text-center ${rank <= 3 ? 'text-amber-400' : 'text-slate-600'}`}>
          #{rank}
        </div>
      )}

      {/* Logo */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 font-bold text-white text-sm shadow-lg`}>
        {channel.logo_url ? (
          <img src={channel.logo_url} alt={channel.name} className="w-full h-full rounded-xl object-cover" />
        ) : (
          initials
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/kanal/${channel.slug}`} className="font-bold text-slate-100 hover:text-violet-400 transition-colors truncate text-sm">
                {channel.name}
              </Link>
              {channel.is_premium && (
                <span className="badge badge-premium text-xs">
                  <Crown className="w-3 h-3" /> Premium
                </span>
              )}
              {channel.is_featured && (
                <span className="badge" style={{background:'rgba(234,179,8,0.15)',color:'#eab308',border:'1px solid rgba(234,179,8,0.25)'}}>
                  <Star className="w-3 h-3" /> Öne Çıkan
                </span>
              )}
            </div>
            {channel.categories && (
              <span className="badge badge-category text-xs mt-1">{channel.categories.icon} {channel.categories.name}</span>
            )}
          </div>

          <a
            href={channel.telegram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 btn-primary py-1.5 px-3 text-xs"
          >
            <ExternalLink className="w-3 h-3" /> Katıl
          </a>
        </div>

        {channel.description && (
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {channel.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <ThumbsUp className="w-3 h-3 text-violet-400" />
            <span className="text-slate-300 font-medium">{channel.votes}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <MessageCircle className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-300">{Math.max(2, Math.floor(channel.votes / 10))} Yorum</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Eye className="w-3 h-3" />
            <span>{channel.views.toLocaleString('tr-TR')}</span>
          </span>
          {channel.member_count && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Users className="w-3 h-3" />
              <span>{channel.member_count >= 1000 ? `${(channel.member_count / 1000).toFixed(1)}K` : channel.member_count}</span>
            </span>
          )}
          {channel.language === 'tr' && (
            <span className="text-xs text-slate-600">🇹🇷 Türkçe</span>
          )}
        </div>
      </div>
    </div>
  )
}
