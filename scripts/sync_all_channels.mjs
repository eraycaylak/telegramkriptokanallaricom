import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const DESCRIPTION_SUFFIX = `

📊 Bu kanalda bulabilecekleriniz:
• Günlük altcoin sinyalleri
• Bitcoin (BTC) teknik analizleri
• Ethereum ve popüler altcoin analizleri
• Kısa vadeli trade fırsatları
• Kripto piyasa yorumları
• Destek & direnç seviyeleri
• Risk yönetimi stratejileri

Kripto para yatırımcıları için hazırlanan bu kanalda paylaşılan tüm içerikler teknik analizlere dayalı şahsi görüşlerdir ve yatırım tavsiyesi değildir. Yeni başlayanlar ve profesyonel traderlar için düzenli içerik paylaşımı yapılmaktadır.`;

function decodeHTMLEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'");
}

async function fetchTelegramData(telegramUrl) {
  try {
    const resp = await fetch(telegramUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });
    const html = await resp.text();

    const titleMatch = html.match(/<meta property="og:title" content="(.*?)"/);
    const descMatch = html.match(/<meta property="og:description" content="(.*?)"/);
    const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/);
    const extraMatch = html.match(/<div class="tgme_page_extra">(.*?)<\/div>/);

    let memberCount = 0;
    if (extraMatch) {
      const extraText = extraMatch[1].toLowerCase();
      if (extraText.includes('subscriber') || extraText.includes('member') || extraText.includes('abone') || extraText.includes('üye')) {
        const numericOnly = extraText.replace(/\D/g, '');
        if (numericOnly) memberCount = parseInt(numericOnly, 10);
      }
    }

    return {
      title: titleMatch ? decodeHTMLEntities(titleMatch[1]) : '',
      description: descMatch ? decodeHTMLEntities(descMatch[1]) : '',
      image: imageMatch ? imageMatch[1] : null,
      memberCount,
    };
  } catch (err) {
    console.error(`  ❌ Telegram fetch error for ${telegramUrl}:`, err.message);
    return { title: '', description: '', image: null, memberCount: 0 };
  }
}

async function downloadAndUploadImage(imageUrl, slug) {
  try {
    const imgResp = await fetch(imageUrl);
    if (!imgResp.ok) return null;

    const contentType = imgResp.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    const arrayBuffer = await imgResp.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const filePath = `${slug}.${ext}`;
    const { error } = await supabase.storage
      .from('channel-logos')
      .upload(filePath, buffer, { contentType, upsert: true });

    if (error) {
      console.error(`  ❌ Upload error for ${slug}:`, error.message);
      return null;
    }

    return `${SUPABASE_URL}/storage/v1/object/public/channel-logos/${filePath}`;
  } catch (err) {
    console.error(`  ❌ Download/upload error for ${slug}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Kanal verilerini güncelleme başlıyor...\n');

  const { data: channels, error } = await supabase
    .from('channels')
    .select('id, name, slug, telegram_url, logo_url, description')
    .eq('is_approved', true)
    .order('name');

  if (error || !channels) {
    console.error('Kanallar çekilemedi:', error);
    process.exit(1);
  }

  console.log(`📋 Toplam ${channels.length} kanal bulundu.\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < channels.length; i++) {
    const ch = channels[i];
    console.log(`[${i + 1}/${channels.length}] ${ch.name}`);
    console.log(`  🔗 ${ch.telegram_url}`);

    // 1. Telegram'dan veri çek
    const tgData = await fetchTelegramData(ch.telegram_url);
    console.log(`  📸 Fotoğraf: ${tgData.image ? 'bulundu' : 'yok'}`);
    console.log(`  📝 Açıklama: ${tgData.description ? tgData.description.slice(0, 60) + '...' : 'yok'}`);
    console.log(`  👥 Üye: ${tgData.memberCount || 'bilinmiyor'}`);

    // 2. Fotoğrafı Supabase Storage'a yükle
    let newLogoUrl = ch.logo_url;
    if (tgData.image) {
      const uploaded = await downloadAndUploadImage(tgData.image, ch.slug);
      if (uploaded) {
        newLogoUrl = uploaded;
        console.log(`  ✅ Fotoğraf yüklendi: ${uploaded.split('/').pop()}`);
      }
    }

    // 3. Açıklamayı güncelle (Telegram'dan çekilen + template)
    let newDescription = ch.description || '';
    if (tgData.description) {
      // Kanal adını ve "Telegram" kelimesini açıklamanın başına koy (SEO)
      newDescription = `${ch.name}, kripto para piyasasında aktif bir Telegram kanalıdır. ${tgData.description}${DESCRIPTION_SUFFIX}`;
    } else if (!newDescription.includes('Bu kanalda bulabilecekleriniz')) {
      // Mevcut açıklama varsa sadece template'i ekle
      newDescription = `${ch.name}, kripto para piyasasında aktif bir Telegram kanalıdır. ${newDescription}${DESCRIPTION_SUFFIX}`;
    }

    // 4. Veritabanını güncelle
    const updateData = {
      logo_url: newLogoUrl,
      description: newDescription,
    };

    // Üye sayısını da güncelle (varsa)
    if (tgData.memberCount > 0) {
      updateData.member_count = tgData.memberCount;
    }

    const { error: updateError } = await supabase
      .from('channels')
      .update(updateData)
      .eq('id', ch.id);

    if (updateError) {
      console.error(`  ❌ Güncelleme hatası:`, updateError.message);
      errorCount++;
    } else {
      console.log(`  ✅ Güncellendi!`);
      successCount++;
    }

    console.log('');

    // Rate limiting - Telegram'ı çok hızlı bombalamamak için
    await new Promise((r) => setTimeout(r, 800));
  }

  console.log('═'.repeat(50));
  console.log(`✅ Başarılı: ${successCount}`);
  console.log(`❌ Hatalı: ${errorCount}`);
  console.log(`📋 Toplam: ${channels.length}`);
}

main();
