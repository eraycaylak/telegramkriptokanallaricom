'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'

export default function AdminBlogEkle() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({ title: '', excerpt: '', content: '', cover_image: '', tags: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/giris'); return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (profile?.role !== 'admin') { router.push('/dashboard'); return; }

      setUser(session.user)
      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    const slugBase = form.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 60)
    const slug = `${slugBase}-${Date.now()}`
    
    const { error: insertError } = await supabase
      .from('blogs')
      .insert({
        title: form.title,
        slug,
        excerpt: form.excerpt,
        content: form.content,
        cover_image: form.cover_image,
        tags: tagsArray,
        author_id: user.id,
        is_published: true
      })

    if (insertError) {
      setError('Kaydedilirken bir hata oluştu: ' + insertError.message)
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
          <h1 className="text-2xl font-black text-slate-900">Yeni Blog Yazısı Ekle</h1>
          <p className="text-slate-500 text-sm mt-1">Yazı eklendikten sonra taslak olarak kaydedilir.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Başlık *</label>
            <input value={form.title} onChange={(e) => setForm(p => ({...p, title: e.target.value}))} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kapak Görseli URL (Opsiyonel)</label>
            <input value={form.cover_image} onChange={(e) => setForm(p => ({...p, cover_image: e.target.value}))} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kısa Özet</label>
            <textarea value={form.excerpt} onChange={(e) => setForm(p => ({...p, excerpt: e.target.value}))} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">İçerik (HTML veya Düz Metin) *</label>
            <textarea value={form.content} onChange={(e) => setForm(p => ({...p, content: e.target.value}))} required rows={10} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Etiketler (Virgülle ayırın)</label>
            <input value={form.tags} onChange={(e) => setForm(p => ({...p, tags: e.target.value}))} placeholder="kripto, analiz, ether" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3 text-base mt-2 shadow-md">
            {saving ? 'Oluşturuluyor...' : <><Save className="w-5 h-5"/> Blog Yazısını Ekle</>}
          </button>
        </form>
      </div>
    </div>
  )
}
