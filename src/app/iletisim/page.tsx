import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'İletişim & Destek',
  description: 'Telegram Kripto Kanalları reklam, sponsorluk ve şikayet destek talepleri için iletişim sayfası.',
}

export default function IletisimPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 prose prose-slate max-w-none text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8">Bizimle İletişime Geçin</h1>
        
        <p className="text-lg font-medium text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
          Reklam, Sponsorlu yayın, Şikayet Bildirimi veya Proje ortaklığı için aşağıdaki kanalları kullanarak yöneticilerimizle iletişime geçebilirsiniz.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 text-left mt-8">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-800 mb-4">📧 E-Posta Desteği</h3>
            <p className="text-slate-600 font-medium mb-2">Her türlü işbirliği (Business/Ads) için doğrudan yazabilirsiniz.</p>
            <a href="mailto:admin@telegramkriptokanallari.com" className="text-blue-600 font-bold hover:underline">
              admin@telegramkriptokanallari.com
            </a>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-800 mb-4">✈️ Telegram Destek Hattı</h3>
            <p className="text-slate-600 font-medium mb-2">Acil şikayetler, kanal onay durumları ve anında yanıtlar için.</p>
            <a href="https://t.me/admin_destek_ornek" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">
              @admin_destek_ornek
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
