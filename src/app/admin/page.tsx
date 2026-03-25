'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Trash2, Eye, Users, TrendingUp, BookOpen, RefreshCw } from 'lucide-react'
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

  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)
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

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'bekleyenler', label: '⏳ Onay Bekleyenler', count: stats.pending },
    { key: 'kanallar', label: '📡 Aktif Kanallar', count: stats.total },
    { key: 'bloglar', label: '📝 Blog Yazıları', count: stats.blogs },
    { key: 'kullanicilar', label: '👤 Kullanıcılar', count: stats.users },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-100">🛡️ Admin Paneli</h1>
          <p className="text-slate-500 text-sm mt-1">Telegram Kripto Kanalları yönetim merkezi</p>
        </div>
        <button onClick={fetchData} className="btn-secondary py-2 text-sm gap-2">
          <RefreshCw className="w-4 h-4" /> Yenile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: <TrendingUp className="w-5 h-5 text-violet-400" />, label: 'Aktif Kanal', val: stats.total },
          { icon: <Eye className="w-5 h-5 text-amber-400" />, label: 'Onay Bekleyen', val: stats.pending },
          { icon: <BookOpen className="w-5 h-5 text-blue-400" />, label: 'Blog Yazısı', val: stats.blogs },
          { icon: <Users className="w-5 h-5 text-emerald-400" />, label: 'Kullanıcı', val: stats.users },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">{s.icon}</div>
            <div>
              <div className="text-xl font-black text-slate-100">{s.val}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
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
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${tab === t.key ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            {t.label}
            {t.count !== undefined && <span className={`px-1.5 py-0.5 rounded-full text-xs ${tab === t.key ? 'bg-white/20' : 'bg-white/10'}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Yükleniyor...</p>
        </div>
      ) : (
        <>
          {/* Pending Channels */}
          {tab === 'bekleyenler' && (
            <div className="space-y-3">
              {pendingChannels.length === 0 ? (
                <div className="glass-card p-10 text-center"><p className="text-slate-500 text-sm">Onay bekleyen kanal yok. 🎉</p></div>
              ) : (
                pendingChannels.map((ch) => (
                  <div key={ch.id} className="glass-card p-4 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-200 text-sm">{ch.name}</p>
                      <a href={ch.telegram_url} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-400 hover:underline">{ch.telegram_url}</a>
                      {ch.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ch.description}</p>}
                      <p className="text-xs text-slate-600 mt-1">{new Date(ch.created_at).toLocaleDateString('tr-TR')}</p>
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
                <div key={ch.id} className="glass-card p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-200 text-sm">{ch.name}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                      <span>👍 {ch.votes}</span>
                      <span>👁 {ch.views}</span>
                      <span>{new Date(ch.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteChannel(ch.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400/70 hover:bg-red-500/20 hover:text-red-400 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Blogs */}
          {tab === 'bloglar' && (
            <div className="space-y-3">
              {blogs.map((blog) => (
                <div key={blog.id} className="glass-card p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-200 text-sm">{blog.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{new Date(blog.created_at).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <button
                    onClick={() => toggleBlogPublish(blog.id, blog.is_published)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${blog.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}
                  >
                    {blog.is_published ? '✔ Yayında' : 'Taslak'}
                  </button>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="glass-card p-10 text-center"><p className="text-slate-500 text-sm">Henüz blog yazısı yok.</p></div>
              )}
            </div>
          )}

          {/* Users */}
          {tab === 'kullanicilar' && (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                    {(user.display_name ?? user.username ?? 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-200 text-sm">{user.display_name ?? user.username}</p>
                    <p className="text-xs text-slate-600">@{user.username}</p>
                  </div>
                  <span className={`badge text-xs ${user.role === 'admin' ? 'badge-premium' : 'badge-free'}`}>{user.role}</span>
                </div>
              ))}
              {users.length === 0 && (
                <div className="glass-card p-10 text-center"><p className="text-slate-500 text-sm">Henüz kullanıcı yok.</p></div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
