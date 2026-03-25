import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'Telegram Kripto Kanalları gizlilik politikası ve kişisel verilerin korunması kanunu aydınlatma metni.',
}

export default function GizlilikPolitikasiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 prose prose-slate max-w-none">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8">Gizlilik Politikası</h1>
        
        <p className="text-lg font-medium text-slate-600 mb-8">
          Son güncellenme tarihi: {new Date().toLocaleDateString('tr-TR')}
        </p>

        <h2>1. Toplanan Veriler</h2>
        <p>
          TelegramKriptoKanallari.com, site trafiğini incelemek ve kullanıcı deneyimini iyileştirmek amacıyla temel anonim analitik verileri, tarayıcı türlerini, IP adreslerini çerezler (cookies) aracılığıyla toplayabilir.
        </p>

        <h2>2. Çerez Kullanımı (Cookies)</h2>
        <p>
          Platformumuz Google Analytics, Google AdSense veya üçüncü taraf izleme yöntemlerini kullanır. Çerez kullanımını tarayıcı ayarlarınızdan iptal edebilir veya yönetebilirsiniz.
        </p>

        <h2>3. Kişisel Veriler</h2>
        <p>
          Üye olmanız halinde E-posta, Kullanıcı Adı veya Telegram hesap bilginiz sistem veritabanımızda şifrelenerek güvende tutulur. Asla üçüncü taraf şirketlere veya pazarlamacılara satılmaz, devredilmez.
        </p>

        <h2>4. Üçüncü Taraf Linkleri</h2>
        <p>
          Web sitemizden Telegram'a ait (t.me uzantılı) bağlantılara sıklıkla yönlendirilmektesiniz. Ziyaret edeceğiniz ve dışarı çıktığınız an itibariyle Telegram'ın kendi Gizlilik İlkeleri ve sözleşmeleri devreye girmektedir.
        </p>

        <h2>5. Değişiklikler</h2>
        <p>
          Gizlilik politikamızı önceden bildirmeksizin zaman zaman değiştirme hakkını saklı tutarız. Hüküm ve şartlarda önemli güncellemeler ana sitemizde duyurulabilir.
        </p>
      </div>
    </div>
  )
}
