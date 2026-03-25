import Link from 'next/link'
import { ThumbsUp, Eye, Users, Crown, Star, ShieldCheck, HeartPulse, ChevronRight, MessageSquareQuote } from 'lucide-react'
import { ChannelWithCategory } from '@/lib/types'

interface ChannelCardProps {
  channel: ChannelWithCategory
  rank?: number
}

export default function ChannelCard({ channel, rank }: ChannelCardProps) {
  const initials = channel.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  
  // A simple deterministic color for avatars if no logo
  const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-slate-800', 'bg-cyan-600']
  const avatarColor = colors[channel.name.charCodeAt(0) % colors.length]

  return (
    <div className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 sm:gap-5 transition-all shadow-sm hover:shadow-md group">
      {/* Rank (if provided) */}
      {rank && (
        <div className={`text-xl font-black min-w-[2rem] text-center pt-2 ${rank <= 3 ? 'text-amber-500' : 'text-slate-400'}`}>
          #{rank}
        </div>
      )}

      {/* Logo */}
      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${avatarColor} flex items-center justify-center flex-shrink-0 font-bold text-white text-lg shadow-sm border border-slate-100 overflow-hidden`}>
        {channel.logo_url ? (
          <img src={channel.logo_url} alt={channel.name} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          
          {/* Title & Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Link href={`/kanal/${channel.slug}`} className="font-bold text-lg text-slate-900 hover:text-blue-700 transition-colors truncate">
                {channel.name}
              </Link>
              {channel.is_verified && (
                <span title="Doğrulanmış Kanal" className="flex items-center">
                  <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                </span>
              )}
              {channel.is_premium && (
                <span className="badge badge-premium text-[10px] px-2 py-0.5">
                  <Crown className="w-3 h-3" /> Premium
                </span>
              )}
              {channel.is_featured && (
                <span className="badge bg-amber-50 text-amber-600 border border-amber-200 text-[10px] px-2 py-0.5">
                  <Star className="w-3 h-3" /> Öne Çıkan
                </span>
              )}
            </div>

            {/* Category & Trust Score */}
            <div className="flex items-center gap-3 flex-wrap">
              {channel.categories && (
                <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                  {channel.categories.icon} {channel.categories.name}
                </span>
              )}
              {channel.trust_score > 0 && (
                <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <HeartPulse className="w-3 h-3" /> Trust: {channel.trust_score}/100
                </div>
              )}
            </div>
            
            {/* Description */}
            {channel.description && (
              <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {channel.description}
              </p>
            )}
          </div>

          {/* Action Button & Main Stat */}
          <div className="flex sm:flex-col items-center justify-between sm:items-end gap-3 sm:gap-2 flex-shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 w-full sm:w-auto">
            <div className="flex items-center gap-1 text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
               <span className="text-xs text-slate-500 font-normal mr-1">Tepki:</span>
               <ThumbsUp className="w-4 h-4 text-blue-600" />
               <span>{channel.votes}</span>
            </div>
            {/* Redirect to /git inside Katıl */}
            <Link
              href={`/git/${channel.slug}`}
              className="btn-primary py-2 px-6 text-sm flex items-center justify-center gap-1 w-full sm:w-auto"
            >
              Katıl <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Bottom Stats Meta */}
        <div className="flex items-center gap-4 mt-4 flex-wrap text-xs font-medium text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
          <span className="flex items-center gap-1.5" title="Görüntülenme">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            {channel.views.toLocaleString('tr-TR')}
          </span>
          {channel.member_count && channel.member_count > 0 && (
             <span className="flex items-center gap-1.5" title="Tahmini Üye">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {channel.member_count >= 1000 ? `${(channel.member_count / 1000).toFixed(1)}K` : channel.member_count}
             </span>
          )}
           <span className="flex items-center gap-1.5" title="Topluluk Tartışmaları">
            <MessageSquareQuote className="w-3.5 h-3.5 text-slate-400" />
            <span>{Math.max(2, Math.floor(channel.votes / 10))} Yorum</span>
          </span>
          {channel.language === 'tr' && (
            <span className="ml-auto bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-500 shadow-sm">
              TR
            </span>
          )}
        </div>

      </div>
    </div>
  )
}
