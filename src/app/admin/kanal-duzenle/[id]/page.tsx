'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'

export default function AdminKanalDuzenle({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const supabase = createClient()

  const [form, setForm] = useState({ name: '', telegram_url: '', description: '', category_id: '', language: 'tr', tags: '', votes: 0, views: 0, logo_url: '', member_count: 0 })
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/giris'); return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (profile?.role !== 'admin') { router.push('/dashboard'); return; }

      const [catRes, channelRes] = await Promise.all([
        supabase.from('categories').select('id, name').order('name'),
        supabase.from('channels').select('*').eq('id', resolvedParams.id).single()
      ])

      setCategories((catRes.data ?? []))
      
      if (channelRes.data) {
        setForm({
          name: channelRes.data.name || '',
          telegram_url: channelRes.data.telegram_url || '',
          description: channelRes.data.description || '',
          category_id: channelRes.data.category_id || '',
          language: channelRes.data.language || 'tr',
          tags: channelRes.data.tags ? channelRes.data.tags.join(', ') : '',
          votes: channelRes.data.votes || 0,
          views: channelRes.data.views || 0,
          logo_url: channelRes.data.logo_url || '',
          member_count: channelRes.data.member_count || 0,
        })
      } else {
        setError('Kanal bulunamadı.')
      }
      setLoading(false)
    }

    fetchData()
  }, [resolvedParams.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    
    // Telegram URL format fix
    let url = form.telegram_url.trim()
    if (!url.startsWith('http') && !url.startsWith('@')) url = 'https://t.me/' + url
    if (url.startsWith('@')) url = 'https://t.me/' + url.substring(1)
    
    const { error: updateError } = await supabase
      .from('channels')
      .update({
        name: form.name,
        telegram_url: url,
        telegram_username: url.replace('https://t.me/', '').replace('@', '').split('/')[0],
        description: form.description,
        category_id: form.category_id || null,
        language: form.language,
        tags: tagsArray,
        votes: form.votes,
        views: form.views,
        logo_url: form.logo_url,
        member_count: form.member_count,
        updated_at: new Date().toISOString()
      })
      .eq('id', resolvedParams.id)

    if (updateError) {
      setError('Güncellenirken bir hata oluştu: ' + updateError.message)
      setSaving(false)
    } else {
      router.push('/admin')
    }
  }

  if (loading) return <div className="p-20 text-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Admin Paneline Dön
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 mb-8">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-black text-slate-900">Kanalı Düzenle</h1>
          <p className="text-slate-500 text-sm mt-1">Kanal ID: {resolvedParams.id}</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kanal Adı</label>
              <input value={form.name} onChange={(e) => setForm(p => ({...p, name: e.target.value}))} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                <span>Telegram Linki</span>
                <button type="button" onClick={async () => {
                  try {
                    let u = form.telegram_url.trim();
                    if (!u.startsWith('http') && !u.startsWith('@')) u = 'https://t.me/' + u;
                    if (u.startsWith('@')) u = 'https://t.me/' + u.substring(1);
                    const res = await fetch('/api/telegram-fetch?url=' + encodeURIComponent(u));
                    if (res.ok) {
                      const data = await res.json();
                      setForm(p => ({
                         ...p, 
                         name: data.title || p.name, 
                         description: data.description || p.description, 
                         logo_url: data.image || p.logo_url, 
                         member_count: data.memberCount || p.member_count 
                      }));
                      alert('Veriler başarıyla çekildi!');
                    } else {
                      alert('Veri çekilemedi. API hatası.');
                    }
                  } catch (e) { alert('Veri çekilemedi.'); }
                }} className="text-xs text-blue-600 hover:underline">Verileri Çek</button>
              </label>
              <input value={form.telegram_url} onChange={(e) => setForm(p => ({...p, telegram_url: e.target.value}))} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
              <select value={form.category_id} onChange={(e) => setForm(p => ({...p, category_id: e.target.value}))} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option value="">Seçiniz...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dil</label>
              <select value={form.language} onChange={(e) => setForm(p => ({...p, language: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option value="tr">Türkçe</option>
                <option value="en">İngilizce</option>
                <option value="both">İkisi de</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Oy Sayısı (Oylama Hilesi vb.)</label>
              <input type="number" value={form.votes} onChange={(e) => setForm(p => ({...p, votes: Number(e.target.value)}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Görüntülenme</label>
              <input type="number" value={form.views} onChange={(e) => setForm(p => ({...p, views: Number(e.target.value)}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kanal Logosu (URL)</label>
              <input value={form.logo_url} onChange={(e) => setForm(p => ({...p, logo_url: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Üye / Abone Sayısı</label>
              <input type="number" value={form.member_count} onChange={(e) => setForm(p => ({...p, member_count: Number(e.target.value)}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Açıklama</label>
            <textarea value={form.description} onChange={(e) => setForm(p => ({...p, description: e.target.value}))} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Etiketler (Virgülle ayırın)</label>
            <input value={form.tags} onChange={(e) => setForm(p => ({...p, tags: e.target.value}))} placeholder="sinyal, premium, btc" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3 text-base mt-2 shadow-md">
            {saving ? 'Kaydediliyor...' : <><Save className="w-5 h-5"/> Değişiklikleri Kaydet</>}
          </button>
        </form>
      </div>
    </div>
  )
}
