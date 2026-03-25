import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, ShieldAlert, ArrowLeft, Loader2, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Yönlendiriliyorsunuz... | Telegram Kripto Kanalları',
  robots: { index: false, follow: false }
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function RedirectPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data } = await supabase.from('channels').select('*').eq('slug', slug).single()
  
  if(!data) notFound()

  // Track the click asynchronously (fire and forget)
  supabase.rpc('increment_channel_clicks', { p_channel_id: data.id }).then(() => {})

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-lg w-full p-8 text-center bg-white shadow-xl border border-slate-200 rounded-2xl relative overflow-hidden">
        {/* Progress bar simulation with CSS animation */}
        <div className="absolute top-0 left-0 h-1.5 bg-blue-600 animate-[progress_3s_linear_forwards]" />
        
        <div className="w-20 h-20 rounded-2xl bg-slate-50 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
          {data.logo_url ? (
            <img src={data.logo_url} alt={data.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <ExternalLink className="w-8 h-8 text-blue-500" />
          )}
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-2">Telegram&apos;a Yönlendiriliyorsunuz</h1>
        <p className="text-slate-600 mb-8">
          <strong className="text-slate-900">{data.name}</strong> kanalına güvenli bağlantı kuruluyor...
        </p>
        
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl mb-8 flex items-start gap-3 text-left shadow-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
          <p className="leading-relaxed">
            Harici bir platform olan Telegram&apos;a gidiyorsunuz. Sitemizdeki kanalların paylaşımları <strong>yatırım tavsiyesi değildir</strong>, kendi araştırmanızı yapmayı (DYOR) unutmayın.
          </p>
        </div>

        {/* Sponsor Banner Placeholder */}
        <div className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-semibold tracking-wide mb-8">
          <Star className="w-4 h-4 mr-2 text-slate-300" /> SPONSOR REKLAM ALANI
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <a href={data.telegram_url} rel="noopener noreferrer nofollow" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
            Hemen Git <ExternalLink className="w-4 h-4" />
          </a>
          <Link href={`/kanal/${data.slug}`} className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Geri Dön
          </Link>
        </div>

        {/* Client-side auto redirect script */}
        <script dangerouslySetInnerHTML={{__html: `
          setTimeout(function() {
            window.location.href = "${data.telegram_url}";
          }, 3000);
        `}} />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}} />
      </div>
    </div>
  )
}
