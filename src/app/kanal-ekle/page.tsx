'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

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
  const [form, setForm] = useState({ name: '', telegram_url: '', description: '', categorySlug: '', language: 'tr' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const [fetchingTg, setFetchingTg] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFetchData = async () => {
    if (!form.telegram_url || (!form.telegram_url.includes('t.me') && !form.telegram_url.includes('@'))) {
      setError('Geçerli bir t.me linki veya @username giriniz.')
      return
    }
    setError('')
    setFetchingTg(true)
    try {
      const res = await fetch('/api/telegram-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.telegram_url })
      })
      const data = await res.json()
      if (res.ok && data.name) {
        setForm(prev => ({
          ...prev,
          name: data.name,
          description: data.description || prev.description
        }))
      } else {
        setError(data.error || 'Veri çekilemedi. Kanal gizli olabilir veya link hatalı.')
      }
    } catch (err) {
      setError('Veri çekilirken bağlantı hatası oluştu.')
    }
    setFetchingTg(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        <h1 className="text-3xl font-black text-slate-100 mb-2">📡 Kanal Ekle</h1>
        <p className="text-slate-500 text-sm">Telegram kripto kanalınızı dizine ekleyin. Admin onayından sonra yayınlanacaktır.</p>
      </div>

      {status === 'success' ? (
        <div className="glass-card p-10 text-center">
          <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Başvurunuz Alındı!</h2>
          <p className="text-slate-500 text-sm">Kanalınız inceleme sürecinden geçtikten sonra yayınlanacaktır. Genellikle 24 saat içinde onaylanır.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Kanal Adı *</label>
            <input
              name="name" value={form.name} onChange={handleChange} required
              placeholder="Örn: Binance Türkiye Sinyalleri"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Telegram Linki *</label>
            <div className="flex gap-2">
              <input
                name="telegram_url" value={form.telegram_url} onChange={handleChange} required
                placeholder="https://t.me/kanaladi"
                type="text"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
              <button 
                type="button" 
                onClick={handleFetchData} 
                disabled={fetchingTg}
                className="btn-secondary px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 flex-shrink-0"
              >
                {fetchingTg ? <RefreshCw className="w-4 h-4 animate-spin"/> : 'Verileri Çek'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 ml-1">Linki girip "Verileri Çek" butonuna basarak kanal adı ve açıklamasını otomatik doldurabilirsiniz.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Kategori *</label>
            <select
              name="categorySlug" value={form.categorySlug} onChange={handleChange} required
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-violet-500/50 transition-all"
            >
              <option value="">Kategori seçin...</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Açıklama</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="Kanalınızın içeriği ve özellikleri hakkında kısa bir açıklama yazın..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Dil</label>
            <select
              name="language" value={form.language} onChange={handleChange}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-violet-500/50 transition-all"
            >
              <option value="tr">🇹🇷 Türkçe</option>
              <option value="en">🇺🇸 İngilizce</option>
              <option value="both">🌐 İkisi de</option>
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center py-3 text-base">
            {status === 'loading' ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Gönderiliyor...</span>
            ) : (
              <><Send className="w-4 h-4" /> Kanal Başvurusu Gönder</>
            )}
          </button>

          <p className="text-xs text-slate-600 text-center">
            Kanal ekleyerek <a href="/kullanim-kosullari" className="text-violet-400 hover:underline">Kullanım Koşulları</a>&apos;nı kabul etmiş olursunuz.
          </p>
        </form>
      )}
    </div>
  )
}
