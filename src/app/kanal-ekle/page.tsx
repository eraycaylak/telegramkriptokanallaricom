'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const categories = [
  { slug: 'sinyal', name: '📊 Sinyal Kanalları' },
  { slug: 'haber', name: '📰 Haber Kanalları' },
  { slug: 'bitcoin', name: '₿ Bitcoin Kanalları' },
  { slug: 'altcoin', name: '🪙 Altcoin Kanalları' },
  { slug: 'defi', name: '⚡ DeFi Kanalları' },
  { slug: 'nft', name: '🖼️ NFT Kanalları' },
  { slug: 'ucretsiz', name: '🆓 Ücretsiz Kanallar' },
  { slug: 'turkce', name: '🇹🇷 Türkçe Kanallar' },
]

export default function KanalEklePage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', telegram_url: '', description: '', categorySlug: '', language: 'tr' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/giris')
      } else {
        setUser(session.user)
      }
    }
    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('İşlemi tamamlamak için giriş yapmalısınız.')
      return
    }
    
    setStatus('loading')
    setError('')

    const supabase = createClient()

    // Get category id
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', form.categorySlug).single()

    // Generate slug from name
    const slugBase = form.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 60)
    const slug = `${slugBase}-${Date.now()}`

    const { error: insertError } = await supabase.from('channels').insert({
      name: form.name,
      slug,
      description: form.description,
      telegram_url: form.telegram_url,
      telegram_username: form.telegram_url.replace('https://t.me/', '').replace('@', ''),
      category_id: cat?.id ?? null,
      language: form.language,
      is_approved: false,
      is_featured: false,
      is_premium: false,
      votes: 0,
      views: 0,
      submitted_by: user.id,
    })

    if (insertError) {
      setError('Kanal eklenirken bir hata oluştu. Lütfen tekrar deneyin.')
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-2">📡 Kanal Ekle</h1>
        <p className="text-slate-500 text-sm">Telegram kripto kanalınızı dizine ekleyin. Admin onayından sonra yayınlanacaktır.</p>
      </div>

      {status === 'success' ? (
        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-10 text-center">
          <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Başvurunuz Alındı!</h2>
          <p className="text-slate-500 text-sm">Kanalınız inceleme sürecinden geçtikten sonra yayınlanacaktır. Genellikle 24 saat içinde onaylanır.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-10 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kanal Adı *</label>
            <input
              name="name" value={form.name} onChange={handleChange} required
              placeholder="Örn: Binance Türkiye Sinyalleri"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telegram Linki *</label>
            <input
              name="telegram_url" value={form.telegram_url} onChange={handleChange} required
              placeholder="https://t.me/kanaladi"
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori *</label>
            <select
              name="categorySlug" value={form.categorySlug} onChange={handleChange} required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="">Kategori seçin...</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Açıklama</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="Kanalınızın içeriği ve özellikleri hakkında kısa bir açıklama yazın..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dil</label>
            <select
              name="language" value={form.language} onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="tr">🇹🇷 Türkçe</option>
              <option value="en">🇺🇸 İngilizce</option>
              <option value="both">🌐 İkisi de</option>
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full shadow-md justify-center py-3.5 text-base mt-2">
            {status === 'loading' ? (
              <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Gönderiliyor...</span>
            ) : (
              <><Send className="w-5 h-5" /> Kanal Başvurusu Gönder</>
            )}
          </button>

          <p className="text-sm text-slate-500 text-center font-medium mt-4">
            Kanal ekleyerek <Link href="/kullanim-kosullari" className="text-blue-600 font-bold hover:underline">Kullanım Koşulları</Link>&apos;nı kabul etmiş olursunuz.
          </p>
        </form>
      )}
    </div>
  )
}
