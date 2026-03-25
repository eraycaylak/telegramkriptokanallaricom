'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, AlertCircle } from 'lucide-react'

export default function KayitPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase().replace(/[^a-z0-9_]/g, '')
        }
      }
    })

    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
         setError('Çok fazla kayıt isteği gönderdiniz. Lütfen güvenlik sebebiyle bir süre bekleyip tekrar deneyiniz.')
      } else if (error.message.toLowerCase().includes('already registered')) {
         setError('Bu e-posta adresi zaten kayıtlı.')
      } else if (error.status === 504 || error.message.includes('504')) {
         // The GoTrue backend drops HTTP connections at exactly 10.0s if their mail queue is clogged,
         // but log traces reveal the email often still fires asynchronously ~600ms later.
         setError('Sunucu yoğunluğu nedeniyle bağlantı zaman aşımına uğradı. Ancak kayıt onay e-postanız arka planda gönderilmiş olabilir, lütfen e-posta veya spam kutunuzu 1-2 dakika içinde kontrol ediniz.')
      } else {
         setError(error.message)
      }
      setLoading(false)
    } else {
      setSuccess(true)
      // Supabase profiles table usually needs a trigger or we insert manually if not set up
      setLoading(false)
      setTimeout(() => {
        router.push('/giris')
      }, 3000)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Başarıyla Kayıt Olundu!</h2>
          <p className="text-slate-500 mb-4">Giriş sayfasına yönlendiriliyorsunuz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Kayıt Ol</h1>
          <p className="text-sm text-slate-500 mt-2">Dizine kendi kanalınızı eklemek için üye olun.</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> 
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kullanıcı Adı</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="kriptokrali"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-Posta</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="mail@ornek.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Şifre</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base shadow-md mt-2">
            {loading ? 'Kayıt Olunuyor...' : 'Hemen Kayıt Ol'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6 font-medium">
          Zaten hesabınız var mı? <Link href="/giris" className="text-blue-600 font-bold hover:underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  )
}
