'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Plus, Clock, CheckCircle, Info } from 'lucide-react'
import { Channel } from '@/lib/types'

export default function DashboardPage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/giris')
        return
      }
      
      setUser(session.user)

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (profile?.role === 'admin') {
        router.push('/admin')
        return
      }

      const { data: userChannels } = await supabase
        .from('channels')
        .select('*')
        .eq('submitted_by', session.user.id)
        .order('created_at', { ascending: false })
      
      setChannels((userChannels ?? []) as Channel[])
      setLoading(false)
    }
    
    fetchUserData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/giris')
    router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">👤 Kullanıcı Paneli</h1>
          <p className="text-slate-500 text-sm mt-1">Eklediğiniz kanalları ve onay durumlarını takip edin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/kanal-ekle" className="btn-primary py-2 px-4 shadow-sm text-sm gap-2">
            <Plus className="w-4 h-4" /> Yeni Kanal Ekle
          </Link>
          <button onClick={handleLogout} className="btn-secondary py-2 px-4 text-sm gap-2 border-red-200 text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Çıkış
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Gönderdiğim Kanallar</h2>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Kanallarınız yükleniyor...</p>
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-slate-800 font-bold mb-2">Henüz kanal eklemediniz.</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Telegram kanalınızı dizine ekleyerek daha fazla kitleye ulaşabilirsiniz.</p>
            <Link href="/kanal-ekle" className="btn-primary inline-flex py-2 px-5 text-sm shadow-md">
              Kanal Ekle
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {channels.map((ch) => (
              <div key={ch.id} className="border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-extrabold text-slate-900 text-base">{ch.name}</h3>
                    {ch.is_approved ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" /> Onaylandı
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> İnceleniyor
                      </span>
                    )}
                  </div>
                  <a href={ch.telegram_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline inline-block">{ch.telegram_url}</a>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Gönderim: {new Date(ch.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
                
                {ch.is_approved && (
                  <div>
                    <Link href={`/kanal/${ch.slug}`} className="btn-secondary py-1.5 px-4 text-xs bg-slate-50 text-slate-700 hover:bg-slate-100">
                      Sayfayı Gör
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
