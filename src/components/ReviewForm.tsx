'use client'

import { useState } from 'react'
import { Star, Send, Loader2, CheckCircle2 } from 'lucide-react'

interface ReviewFormProps {
  channelId: string
  channelName: string
}

export default function ReviewForm({ channelId, channelName }: ReviewFormProps) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || name.trim().length < 2) {
      setError('Lütfen geçerli bir isim girin (en az 2 karakter).')
      return
    }
    if (rating === 0) {
      setError('Lütfen puan verin.')
      return
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setError('Yorumunuz en az 10 karakter olmalıdır.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: channelId,
          user_name: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Bir hata oluştu.')
        return
      }

      setSuccess(true)
      setName('')
      setRating(0)
      setComment('')

      // Sayfayı 2 saniye sonra yenile (yeni yorum görünsün)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-emerald-800 mb-1">Yorumunuz Eklendi!</h3>
        <p className="text-sm text-emerald-600 font-medium">Değerli görüşünüz için teşekkür ederiz. Sayfa yenileniyor…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5">
      <h3 className="font-bold text-slate-900 text-lg">
        {channelName} Hakkında Yorumunuz
      </h3>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm font-medium px-4 py-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* İsim */}
      <div>
        <label htmlFor="review-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
          İsminiz <span className="text-red-500">*</span>
        </label>
        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn: Mehmet A."
          maxLength={30}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Puan */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Puanınız <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 transition-transform hover:scale-110"
              aria-label={`${star} yıldız`}
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm font-bold text-slate-600 ml-2">{rating}/5</span>
          )}
        </div>
      </div>

      {/* Yorum */}
      <div>
        <label htmlFor="review-comment" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Yorumunuz <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bu kanal hakkındaki deneyiminizi paylaşın… (en az 10 karakter)"
          maxLength={500}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        />
        <div className="text-right text-[10px] text-slate-400 mt-1 font-medium">
          {comment.length}/500
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 text-sm justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Gönderiliyor…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Yorum Gönder
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-400 text-center font-medium leading-relaxed">
        Yorumunuz topluluk kurallarına uygun olmalıdır. Hakaret ve spam içerikli yorumlar kaldırılır.
      </p>
    </form>
  )
}
