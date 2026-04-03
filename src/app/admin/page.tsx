'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Trash2, Eye, Users, TrendingUp, BookOpen, RefreshCw, PenTool, LogOut, Plus, ThumbsUp } from 'lucide-react'
import { Channel, Blog, Profile } from '@/lib/types'

type Tab = 'kanallar' | 'bekleyenler' | 'bloglar' | 'kullanicilar' | 'hizliekle' | 'reklamlar' | 'coktiklanan'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('bekleyenler')
  const [form, setForm] = useState({ name: '', telegram_url: '', description: '', categorySlug: '', language: 'tr', logo_url: '', member_count: 0 })
  const [fetchingTg, setFetchingTg] = useState(false)
  const [addStatus, setAddStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [addError, setAddError] = useState('')
  const [channels, setChannels] = useState<Channel[]>([])
  const [pendingChannels, setPendingChannels] = useState<Channel[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [stats, setStats] = useState({ total: 0, pending: 0, blogs: 0, users: 0 })
  const [banner, setBanner] = useState({ isActive: false, imageUrl: '', link: '' })
  const router = useRouter()

  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/giris')
      return
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    if (profile?.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    setAuthChecked(true)

    const [chRes, pendRes, blogRes, usrRes, bannerRes] = await Promise.all([
      supabase.from('channels').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(50),
      supabase.from('channels').select('*').eq('is_approved', false).order('created_at', { ascending: false }),
      supabase.from('blogs').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('site_settings').select('value').eq('key', 'home_banner_ad').single(),
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
    if (bannerRes.data?.value) setBanner(bannerRes.data.value)
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

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('channels').update({ is_featured: !current }).eq('id', id)
    fetchData()
  }

  const updateTrendingScore = async (id: string) => {
    const val = prompt('Bu kanala kaç Trend Skoru vermek istiyorsunuz? (Boş veya Harf: 0, Büyük olan daha üstte çıkar):')
    if (val === null) return
    const score = parseInt(val, 10) || 0
    await supabase.from('channels').update({ trending_score: score }).eq('id', id)
    fetchData()
  }

  const saveBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddStatus('loading')
    const { error } = await supabase.from('site_settings').update({ value: banner }).eq('key', 'home_banner_ad')
    if (error) setAddError('Reklam güncellenemedi: ' + error.message)
    else { setAddError(''); alert('Reklam afişi kaydedildi!') }
    setAddStatus('idle')
  }

  const toggleBlogPublish = async (id: string, current: boolean) => {
    await supabase.from('blogs').update({ is_published: !current, published_at: !current ? new Date().toISOString() : null }).eq('id', id)
    fetchData()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/giris')
  }

  const handleFetchData = async () => {
    let url = form.telegram_url.trim()
    if (!url) {
      setAddError('Geçerli bir t.me linki girin.')
      return
    }
    if (!url.startsWith('http') && !url.startsWith('@')) url = 'https://t.me/' + url
    if (url.startsWith('@')) url = 'https://t.me/' + url.substring(1)

    setAddError('')
    setFetchingTg(true)
    try {
      const res = await fetch('/api/telegram-fetch?url=' + encodeURIComponent(url))
      const data = await res.json()
      if (res.ok && data.title) {
        setForm(prev => ({
          ...prev,
          telegram_url: url,
          name: data.title || prev.name,
          description: data.description || prev.description,
          logo_url: data.image || prev.logo_url,
          member_count: data.memberCount || prev.member_count
        }))
      } else {
        setAddError(data.error || 'Veri çekilemedi. Kanal gizli olabilir.')
      }
    } catch (err) {
      setAddError('Veri çekilirken hata oluştu.')
    }
    setFetchingTg(false)
  }

  const handleFastAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddStatus('loading')
    setAddError('')

    const { data: { session } } = await supabase.auth.getSession()

    const { data: cat } = await supabase.from('categories').select('id').eq('slug', form.categorySlug).single()
    const slugBase = form.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 60)
    const slug = `${slugBase}-${Date.now()}`

    const { error: insertError } = await supabase.from('channels').insert({
      name: form.name,
      slug,
      description: form.description,
      telegram_url: form.telegram_url,
      telegram_username: form.telegram_url.replace('https://t.me/', '').replace('@', '').split('/')[0],
      category_id: cat?.id ?? null,
      language: form.language,
      logo_url: form.logo_url,
      member_count: form.member_count,
      is_approved: true,
      is_featured: false,
      is_premium: false,
      votes: 0,
      views: 0,
      submitted_by: session?.user.id,
      approved_at: new Date().toISOString(),
      last_verified_at: new Date().toISOString()
    })

    if (insertError) {
      if (insertError.code === '23505') {
        setAddError('Bu kanal zaten dizinde mevcut. Aynı Telegram URL\'si tekrar eklenemez.')
      } else if (insertError.message.includes('out of range')) {
        setAddError('Üye sayısı çok büyük — veri tabanı sınırını aşıyor. Değeri düzeltin ve tekrar deneyin.')
      } else {
        setAddError('Kanal eklenirken hata: ' + insertError.message)
      }
      setAddStatus('error')
    } else {
      setAddStatus('success')
      setForm({ name: '', telegram_url: '', description: '', categorySlug: '', language: 'tr', logo_url: '', member_count: 0 })
      fetchData()
      setTimeout(() => setAddStatus('idle'), 3000)
    }
  }

  const togglePromoted = async (id: string, current: boolean) => {
    await supabase.from('channels').update({ is_promoted: !current }).eq('id', id)
    fetchData()
  }

  const updatePromotedOrder = async (id: string) => {
    const val = prompt('Sıralama numarası girin (küçük = üstte):')
    if (val === null) return
    const order = parseInt(val, 10) || 0
    await supabase.from('channels').update({ promoted_order: order }).eq('id', id)
    fetchData()
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'bekleyenler', label: '⏳ Onay Bekleyenler', count: stats.pending },
    { key: 'kanallar', label: '📡 Aktif Kanallar', count: stats.total },
    { key: 'coktiklanan', label: '🎯 Çok Tıklananlar' },
    { key: 'reklamlar', label: '📢 Reklam Yönetimi' },
    { key: 'hizliekle', label: '⚡ Hızlı Ekle' },
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
                      <p className="text-[10px] uppercase font-bold text-slate-500 mt-2">{new Date(ch.created_at).toLocaleDateString('tr-TR')}</p>
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
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-slate-500"/> {ch.views}</span>
                      <span>{new Date(ch.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center justify-end">
                    <button onClick={() => toggleFeatured(ch.id, !!ch.is_featured)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${ch.is_featured ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`} title="Sponsor/Öne Çıkan Yap">
                      ⭐ Sponsor
                    </button>
                    <button onClick={() => updateTrendingScore(ch.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${(ch.trending_score||0) > 0 ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`} title="Trend Skoru Ver">
                      🔥 Trend
                    </button>
                    <Link href={`/admin/kanal-duzenle/${ch.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200 hover:bg-blue-100 transition-all">
                      <PenTool className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={() => deleteChannel(ch.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-bold text-xs border border-red-200 hover:bg-red-100 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hızlı Ekle Tab */}
          {tab === 'hizliekle' && (
            <form onSubmit={handleFastAdd} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm max-w-2xl max-w-full overflow-hidden">
              <div className="mb-4">
                <h2 className="text-xl font-black text-slate-900 break-words">⚡ Hızlı Onaylı Kanal Ekle</h2>
                <p className="text-slate-500 text-sm mt-1 break-words">Girdiğiniz veriler kanal onay sırasına girmeden doğrudan yayınlanır.</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telegram Linki *</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={form.telegram_url} onChange={(e) => setForm(p => ({...p, telegram_url: e.target.value}))} required
                    placeholder="https://t.me/kanaladi"
                    className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button type="button" onClick={handleFetchData} disabled={fetchingTg} className="btn-secondary px-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 flex-shrink-0 font-bold whitespace-nowrap justify-center">
                    {fetchingTg ? <RefreshCw className="w-4 h-4 animate-spin"/> : 'Verileri Çek'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kanal Adı *</label>
                <input
                  value={form.name} onChange={(e) => setForm(p => ({...p, name: e.target.value}))} required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori *(Slug girin)</label>
                  <input
                    value={form.categorySlug} onChange={(e) => setForm(p => ({...p, categorySlug: e.target.value}))} required
                    placeholder="sinyal, haber, altcoin vb."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dil</label>
                  <select
                    value={form.language} onChange={(e) => setForm(p => ({...p, language: e.target.value}))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="tr">🇹🇷 Türkçe</option>
                    <option value="en">🇺🇸 İngilizce</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Açıklama</label>
                <textarea
                  value={form.description} onChange={(e) => setForm(p => ({...p, description: e.target.value}))}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>

              {addError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-200">{addError}</div>}
              {addStatus === 'success' && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-200">Kanal başarıyla doğrudan yayına alındı!</div>}

              <button type="submit" disabled={addStatus === 'loading'} className="btn-primary w-full justify-center py-3 text-base shadow-md">
                {addStatus === 'loading' ? 'Kaydediliyor...' : 'Doğrudan Yayına Al'}
              </button>
            </form>
          )}

          {/* Reklamlar Tab */}
          {tab === 'reklamlar' && (
            <form onSubmit={saveBanner} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm max-w-2xl max-w-full overflow-hidden">
              <div className="mb-4">
                <h2 className="text-xl font-black text-slate-900 break-words">📢 Ana Sayfa Banner Reklamı</h2>
                <p className="text-slate-500 text-sm mt-1 break-words">Ana sayfanın üstünde yer alacak olan özel afişi (Sponsoru) buradan yönetebilirsiniz.</p>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="ad_active" checked={banner.isActive} onChange={(e) => setBanner(p => ({...p, isActive: e.target.checked}))} className="w-5 h-5 text-blue-600 rounded border-slate-300" />
                <label htmlFor="ad_active" className="font-bold text-slate-800">Reklam Yayında Olsun</label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Görsel URL (JPG/PNG/GIF) *</label>
                <input
                  value={banner.imageUrl} onChange={(e) => setBanner(p => ({...p, imageUrl: e.target.value}))}
                  placeholder="https://resim-urlsi.com/banner.jpg" required={banner.isActive}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tıklanma Linki (Yönlendirilecek URL) *</label>
                <input
                  value={banner.link} onChange={(e) => setBanner(p => ({...p, link: e.target.value}))}
                  placeholder="https://t.me/sponsor-kanal" required={banner.isActive}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {banner.imageUrl && (
                <div className="mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50 text-center">
                   <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Önizleme</p>
                   <img src={banner.imageUrl} alt="preview" className="max-h-24 mx-auto object-contain" />
                </div>
              )}

              {addError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-200">{addError}</div>}

              <button type="submit" disabled={addStatus === 'loading'} className="btn-primary w-full justify-center py-3 text-base shadow-md">
                {addStatus === 'loading' ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </form>
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
                    <Link href={`/admin/blog-duzenle/${blog.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200 hover:bg-orange-100 transition-all">
                      <PenTool className="w-3.5 h-3.5" /> Düzenle
                    </Link>
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

          {/* Çok Tıklananlar Tab */}
          {tab === 'coktiklanan' && (
            <div className="space-y-3">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-4">
                <h2 className="text-xl font-black text-slate-900 mb-2">🎯 Çok Tıklananlar Yönetimi</h2>
                <p className="text-slate-500 text-sm">Ana sayfada "Çok Tıklananlar" bölümünde gösterilecek kanalları yönetin. Promoted olan kanallar 2x2 grid formatında görüntülenir.</p>
              </div>
              {channels.filter((ch: any) => ch.is_promoted).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-emerald-600 mb-2">✅ Aktif Promoted Kanallar</h3>
                  {channels.filter((ch: any) => ch.is_promoted).sort((a: any, b: any) => (a.promoted_order || 0) - (b.promoted_order || 0)).map((ch: any) => (
                    <div key={ch.id} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">{ch.name}</p>
                        <p className="text-xs text-slate-500">Sıra: {ch.promoted_order || 0} | Oy: {ch.votes} | Görüntülenme: {ch.views}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updatePromotedOrder(ch.id)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">Sıra Değiştir</button>
                        <button onClick={() => togglePromoted(ch.id, true)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-bold border border-red-200">Kaldır</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <h3 className="text-sm font-bold text-slate-700 mb-2">Tüm Kanallar (Promoted yapmak için tıklayın)</h3>
              {channels.filter((ch: any) => !ch.is_promoted).map((ch: any) => (
                <div key={ch.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm hover:border-blue-300 transition-colors">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">{ch.name}</p>
                    <p className="text-xs text-slate-500">Oy: {ch.votes} | Görüntülenme: {ch.views}</p>
                  </div>
                  <button onClick={() => togglePromoted(ch.id, false)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 hover:bg-emerald-100">🎯 Promote Et</button>
                </div>
              ))}
            </div>
          )}

          {/* Users */}
          {tab === 'kullanicilar' && (
            <div className="space-y-3">
              {users.map((user) => (
                <Link href={`/admin/kullanici/${user.id}`} key={user.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-blue-300 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-sm font-black text-white shadow-sm ring-2 ring-white">
                    {(user.display_name ?? user.username ?? 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-slate-900 text-sm">{user.display_name ?? user.username}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">@{user.username}</p>
                    {(user as any).email && <p className="text-xs text-blue-500 font-mono mt-0.5">{(user as any).email}</p>}
                  </div>
                  <span className={`badge text-[10px] px-2 py-0.5 ${user.role === 'admin' ? 'bg-violet-100 text-violet-700 border border-violet-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{user.role}</span>
                </Link>
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
