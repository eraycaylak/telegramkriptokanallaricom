import { createClient } from '@/lib/supabase/server'

interface AdBannerProps {
  position: 'hero_banner' | 'sidebar_sticky' | 'interleave_list' | 'channel_detail' | 'footer_sponsors'
  className?: string
}

interface AdData {
  isActive: boolean
  imageUrl: string
  link: string
  altText?: string
}

const positionKeys: Record<string, string> = {
  hero_banner: 'home_banner_ad',
  sidebar_sticky: 'ad_sidebar',
  interleave_list: 'ad_interleave',
  channel_detail: 'ad_channel_detail',
  footer_sponsors: 'ad_footer_sponsors',
}

export default async function AdBanner({ position, className = '' }: AdBannerProps) {
  const supabase = await createClient()
  const key = positionKeys[position]
  if (!key) return null

  const { data } = await supabase.from('site_settings').select('value').eq('key', key).single()
  const ad = data?.value as AdData | null

  if (!ad?.isActive || !ad.imageUrl) return null

  const sizeClasses: Record<string, string> = {
    hero_banner: 'w-full max-h-[120px]',
    sidebar_sticky: 'w-full max-h-[300px]',
    interleave_list: 'w-full max-h-[100px]',
    channel_detail: 'w-full max-h-[120px]',
    footer_sponsors: 'w-full max-h-[90px]',
  }

  return (
    <div className={`ad-container ${className}`}>
      <a
        href={ad.link || '#'}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="block w-full overflow-hidden flex items-center justify-center"
      >
        <img
          src={ad.imageUrl}
          alt={ad.altText || 'Sponsor'}
          className={`${sizeClasses[position]} object-contain sm:object-cover`}
          loading="lazy"
        />
      </a>
      <span className="ad-label">AD</span>
    </div>
  )
}

/* ── Google AdSense Slot (for future use) ── */
export function AdSenseSlot({ slot, format = 'auto', className = '' }: { slot: string; format?: string; className?: string }) {
  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <span className="ad-label">AD</span>
    </div>
  )
}
