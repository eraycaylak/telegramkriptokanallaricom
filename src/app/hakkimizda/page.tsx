import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'Telegram Kripto Kanalları dizini projesinin amacı, hikayesi ve kuruluş manifestosu.',
}

export default function HakkimizdaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 prose prose-slate max-w-none text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8">Biz Kimiz?</h1>
        
        <p className="text-lg font-medium text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          TelegramKriptoKanallari.com, Türkiye'nin en organik ve dürüst kripto Telegram yayıncılarını listelemeyi ve derecelendirmeyi amaçlayan öncü bir dijital keşif platformudur.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-6">Vizyonumuz</h2>
        <p className="text-slate-600 leading-relaxed text-left">
          Kripto para piyasalarında çok fazla gürültü ve dolandırıcılık vakası mevcut. Kullanıcıların güvenilir Bitcoin analizi veya piyasa duyumları için girdikleri yüzlerce kanalda manipülasyonlarla karşılaştığını anladık. Vizyonumuz; bu gürültüyü profesyonel kriterlerle denetleyip, sahte oylamaları (Trust Score/Güven Skoru sistemimizle) önleyerek tamamen "kullanıcı şeffaflığına" hizmet eden büyük bir kütüphane olmak.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-6 text-left">Nasıl Çalışıyoruz?</h2>
        <ul className="text-slate-600 leading-relaxed text-left list-disc list-inside">
          <li><strong>Bağımsız Listeleme:</strong> Sitemize eklenen her kanal 24-48 saatlik profesyonel admin denetiminden geçer. Spam/Porno/Yasadışı içerik barındıran hiçbir Telegram kanalı oylama tablosuna alınmaz.</li>
          <li><strong>Topluluk Oylaması:</strong> Onaylı üyelerimiz hangi kanalın "Faydalı", hangisinin "Sadece reklam" içerdiğine organik oylarla karar verir.</li>
          <li><strong>Aktif İzleme:</strong> Şikayet alan, dolandırıcılık vakasına karışan (VIP Grup vs) veya botlarla şişirilen kanallar anında sistemden izole edilir.</li>
        </ul>

      </div>
    </div>
  )
}
