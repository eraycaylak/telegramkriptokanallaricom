'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Trash2, Eye, Users, TrendingUp, BookOpen, RefreshCw, PenTool, LogOut, Plus, ThumbsUp } from 'lucide-react'
import { Channel, Blog, Profile } from '@/lib/types'

type Tab = 'kanallar' | 'bekleyenler' | 'bloglar' | 'kullanicilar'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('bekleyenler')
  const [channels, setChannels] = useState<Channel[]>([])
  const [pendingChannels, setPendingChannels] = useState<Channel[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, blogs: 0, users: 0 })
  const router = useRouter()

  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/giris')
      return
    }

    const [chRes, pendRes, blogRes, usrRes] = await Promise.all([
      supabase.from('channels').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(50),
      supabase.from('channels').select('*').eq('is_approved', false).order('created_at', { ascending: false }),
      supabase.from('blogs').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(50),
    ])
    setChannels((chRes.data ?? []) as Channel[])
    setPendingChannels((pendRes.data ?? []) as Channel[])
    setBlogs((blogRes.data ?? []) as Blog[])
    setUsers((usrRes.data ?? []) as Profile[])
    setStats({
      total: (chRes.data ?? []).length,
      pending: (pendRes.data ?? []).length,
      blogs: (blogRes.data ?? []).length,
      users: (usrRes.data ?? []).length,
    })
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const approveChannel = async (id: string) => {
    await supabase.from('channels').update({ is_approved: true, approved_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  const deleteChannel = async (id: string) => {
    if (!confirm('Kanalı silmek istediğinizden emin misiniz?')) return
    await supabase.from('channels').delete().eq('id', id)
    fetchData()
  }

  const toggleBlogPublish = async (id: string, current: boolean) => {
    await supabase.from('blogs').update({ is_published: !current, published_at: !current ? new Date().toISOString() : null }).eq('id', id)
    fetchData()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/giris')
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'bekleyenler', label: '⏳ Onay Bekleyenler', count: stats.pending },
    { key: 'kanallar', label: '📡 Aktif Kanallar', count: stats.total },
    { key: 'bloglar', label: '📝 Blog Yazıları', count: stats.blogs },
    { key: 'kullanicilar', label: '👤 Kullanıcılar', count: stats.users },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">🛡️ Admin Paneli</h1>
          <p className="text-slate-500 text-sm mt-1">Telegram Kripto Kanalları yönetim merkezi</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="btn-secondary py-2 text-sm gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700">
            <RefreshCw className="w-4 h-4 text-blue-600" /> Yenile
          </button>
          <button onClick={handleLogout} className="btn-secondary py-2 text-sm gap-2 border-red-200 text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Çıkış
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: <TrendingUp className="w-5 h-5 text-violet-400" />, label: 'Aktif Kanal', val: stats.total },
          { icon: <Eye className="w-5 h-5 text-amber-400" />, label: 'Onay Bekleyen', val: stats.pending },
          { icon: <BookOpen className="w-5 h-5 text-blue-400" />, label: 'Blog Yazısı', val: stats.blogs },
          { icon: <Users className="w-5 h-5 text-emerald-400" />, label: 'Kullanıcı', val: stats.users },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">{s.icon}</div>
            <div>
               <div className="text-xl font-black text-slate-900">{s.val}</div>
               <div className="text-xs text-slate-500 font-semibold">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 border ${tab === t.key ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {t.label}
            {t.count !== undefined && <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${tab === t.key ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Veriler yükleniyor...</p>
        </div>
      ) : (
        <>
          {/* Pending Channels */}
          {tab === 'bekleyenler' && (
            <div className="space-y-3">
              {pendingChannels.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm"><p className="text-slate-500 text-sm font-medium">Onay bekleyen kanal yok. 🎉</p></div>
              ) : (
                pendingChannels.map((ch) => (
                  <div key={ch.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-4 shadow-sm hover:border-blue-300 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-slate-900 text-sm">{ch.name}</p>
                      <a href={ch.telegram_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline inline-block mt-0.5">{ch.telegram_url}</a>
                      {ch.description && <p className="text-xs text-slate-600 mt-2 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">{ch.description}</p>}
                      <p className="text-[10px] uppercase font-bold text-slate-400 mt-2">{new Date(ch.created_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approveChannel(ch.id)} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all" title="Onayla">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteChannel(ch.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all" title="Sil">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Active Channels */}
          {tab === 'kanallar' && (
            <div className="space-y-3">
              {channels.map((ch) => (
                <div key={ch.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-blue-300 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-slate-900 text-sm">{ch.name}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-blue-500"/> {ch.votes}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-slate-400"/> {ch.views}</span>
                      <span>{new Date(ch.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 transition-all" title="Düzenle">
                      <PenTool className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteChannel(ch.id)} className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all" title="Sil">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Blogs */}
          {tab === 'bloglar' && (
            <div className="space-y-3">
              <div className="flex justify-end mb-4">
                <Link href="/admin/blog-ekle" className="btn-primary text-sm py-2 px-4 shadow-sm text-white bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4" /> Yeni Blog Yazısı
                </Link>
              </div>
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm hover:border-blue-300">
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-slate-900 text-sm truncate">{blog.title}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{new Date(blog.created_at).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 transition-all" title="Düzenle">
                      <PenTool className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleBlogPublish(blog.id, blog.is_published)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-bold border transition-all ${blog.is_published ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                    >
                      {blog.is_published ? '✔ Yayında' : 'Taslak'}
                    </button>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm"><p className="text-slate-500 text-sm font-medium">Henüz blog yazısı yok.</p></div>
              )}
            </div>
          )}

          {/* Users */}
          {tab === 'kullanicilar' && (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-blue-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-sm font-black text-white shadow-sm ring-2 ring-white">
                    {(user.display_name ?? user.username ?? 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-slate-900 text-sm">{user.display_name ?? user.username}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">@{user.username}</p>
                  </div>
                  <span className={`badge text-[10px] px-2 py-0.5 ${user.role === 'admin' ? 'bg-violet-100 text-violet-700 border border-violet-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{user.role}</span>
                </div>
              ))}
              {users.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm"><p className="text-slate-500 text-sm font-medium">Henüz kullanıcı yok.</p></div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
