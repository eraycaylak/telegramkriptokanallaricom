import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description: 'Telegram Kripto Kanalları platformu kullanıcı sözleşmesi ve kullanım şartları.',
}

export default function KullanimKosullariPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 prose prose-slate max-w-none">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8">Kullanım Koşulları</h1>
        
        <p className="text-lg font-medium text-slate-600 mb-8">
          Son güncellenme tarihi: {new Date().toLocaleDateString('tr-TR')}
        </p>

        <h2>1. Kabul Edilen Şartlar</h2>
        <p>
          TelegramKriptoKanallari.com ("Platform") web sitesine erişim sağlayarak veya hizmetleri kullanarak, bu Kullanım Koşulları'nı okuduğunuzu, anladığınızı ve bunlara bağlı kalmayı kabul ettiğinizi beyan edersiniz.
        </p>

        <h2>2. Hizmetin Niteliği</h2>
        <p>
          Platformumuz bağımsız bir Telegram kanal rehberidir. Listelenen Telegram kanalları ile herhangi bir ortaklığımız, bağımız veya yasal sorumluluğumuz bulunmamaktadır. Sağlanan veriler bilgi amaçlıdır ve hiçbir şekilde yatırım tavsiyesi (YTD) değildir.
        </p>

        <h2>3. Yatırım Riski Reddi</h2>
        <p>
          Kripto para piyasaları ("Kripto", "Bitcoin", "Altcoin") ve bu piyasalardaki kaldıraçlı işlemler yüksek volatilite (oynaklık) ve sermaye kaybı riski taşır. Platformda listelenen sinyal veya haber kanallarına dayanarak yapacağınız finansal işlemlerden veya doğacak zararlardan TelegramKriptoKanallari sorumlu tutulamaz.
        </p>

        <h2>4. Kanal Ekleme ve Onaylama</h2>
        <p>
          Kullanıcılar tarafından Platform'a eklenen Telegram kanalları editör kontrolünden geçmektedir. Ancak kanalların içerikleri, zaman içinde değişiklik gösterebilir veya dolandırıcılık amaçlı eylemlere (scam, pump & dump) dönüşebilir. Kullanıcılar kanallara katılırken tüm sorumluluğu kendi üzerlerine alır.
        </p>

        <h2>5. Yorum ve Puanlama</h2>
        <p>
          Sahte puanlama (bot veya multi-hesap) ile kanal Güven Skoru'nu maniple etmeye çalışan kullanıcıların erişimi sınırsız olarak engellenebilir ve ilgili kanal dizinden kalıcı olarak çıkartılabilir.
        </p>
      </div>
    </div>
  )
}
