'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, List, Clock, CheckCircle } from 'lucide-react'
import { Channel, Profile } from '@/lib/types'

export default function AdminKullaniciDetay({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const supabase = createClient()

  const [targetUser, setTargetUser] = useState<Profile | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/giris'); return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (profile?.role !== 'admin') { router.push('/dashboard'); return; }

      const [userRes, channelRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', resolvedParams.id).single(),
        supabase.from('channels').select('*').eq('submitted_by', resolvedParams.id).order('created_at', { ascending: false })
      ])

      if (userRes.data) setTargetUser(userRes.data as Profile)
      if (channelRes.data) setChannels(channelRes.data as Channel[])
      
      setLoading(false)
    }

    fetchData()
  }, [resolvedParams.id, router])

  if (loading) return <div className="p-20 text-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>

  if (!targetUser) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <Link href="/admin" className="text-blue-600 font-bold hover:underline mb-4 inline-block">&larr; Admin Paneline Dön</Link>
      <h1 className="text-2xl font-bold text-slate-800">Kullanıcı bulunamadı.</h1>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Admin Paneline Dön
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-3xl font-black text-white shadow-sm ring-4 ring-slate-50">
           {(targetUser.display_name ?? targetUser.username ?? 'U')[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
             {targetUser.display_name ?? 'İsimsiz Kullanıcı'} 
             <span className={`text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider ${targetUser.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>{targetUser.role}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">@{targetUser.username}</p>
          <div className="flex gap-4 mt-3 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> ID: {targetUser.id.split('-')[0]}...</span>
            <span className="flex items-center gap-1.5"><List className="w-4 h-4" /> Toplam Eklediği Kanal: <strong>{channels.length}</strong></span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Kullanıcının Kanalları</h2>
        
        {channels.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-medium">Bu kullanıcı henüz hiç kanal eklememiş.</div>
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
                  <p className="text-xs text-slate-500 mt-2 font-medium">Kayıt: {new Date(ch.created_at).toLocaleDateString('tr-TR')} • {ch.votes} Oy</p>
                </div>
                
                <div>
                  <Link href={`/admin/kanal-duzenle/${ch.id}`} className="btn-secondary py-1.5 px-4 text-xs font-bold">
                    Kanalı Yöney (Düzenle)
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
