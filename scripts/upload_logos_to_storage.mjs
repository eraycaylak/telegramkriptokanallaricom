/**
 * Tüm kanalların Telegram profil fotoğraflarını çeker,
 * Supabase Storage'a yükler ve DB'deki logo_url'ü günceller.
 * 
 * Kullanım: node scripts/upload_logos_to_storage.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bmvnmlbfozulqflkgdns.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY env variable gerekli!');
  console.error('Powershell: $env:SUPABASE_SERVICE_ROLE_KEY = "..."');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  // 1) Tüm onaylı kanalları çek
  const { data: channels, error } = await supabase
    .from('channels')
    .select('id, name, slug, logo_url, telegram_url')
    .eq('is_approved', true)
    .order('name');

  if (error) { console.error('DB hatası:', error); return; }
  console.log(`${channels.length} kanal bulundu.\n`);

  let updated = 0;
  let failed = 0;
  let skipped = 0;

  for (const ch of channels) {
    const storagePath = `logos/${ch.slug}.jpg`;

    // Zaten Supabase Storage'da mı kontrol et
    if (ch.logo_url && ch.logo_url.includes('supabase.co/storage')) {
      console.log(`✓ SKIP: ${ch.name} — zaten Storage'da`);
      skipped++;
      continue;
    }

    try {
      // 2) Telegram sayfasından og:image çek
      const username = ch.telegram_url?.replace('https://t.me/', '').replace('/', '');
      if (!username) { console.log(`⚠ ${ch.name} — telegram_url yok`); failed++; continue; }

      console.log(`→ ${ch.name} (${username}) işleniyor...`);

      const tgResp = await fetch(`https://t.me/${username}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'tr-TR,tr;q=0.9'
        }
      });
      const html = await tgResp.text();
      const ogMatch = html.match(/<meta property="og:image" content="(.*?)"/);
      
      if (!ogMatch || !ogMatch[1]) {
        console.log(`  ⚠ og:image bulunamadı`);
        failed++;
        continue;
      }

      const imageUrl = ogMatch[1];

      // 3) Görseli indir
      const imgResp = await fetch(imageUrl);
      if (!imgResp.ok) {
        console.log(`  ⚠ Görsel indirilemedi: ${imgResp.status}`);
        failed++;
        continue;
      }

      const imgBuffer = Buffer.from(await imgResp.arrayBuffer());
      const contentType = imgResp.headers.get('content-type') || 'image/jpeg';

      // 4) Supabase Storage'a yükle (varsa üzerine yaz)
      const { error: uploadErr } = await supabase.storage
        .from('channel-logos')
        .upload(storagePath, imgBuffer, {
          contentType,
          upsert: true,
          cacheControl: '31536000' // 1 yıl cache
        });

      if (uploadErr) {
        console.log(`  ⚠ Upload hatası: ${uploadErr.message}`);
        failed++;
        continue;
      }

      // 5) Public URL al
      const { data: urlData } = supabase.storage
        .from('channel-logos')
        .getPublicUrl(storagePath);

      const publicUrl = urlData.publicUrl;

      // 6) DB güncelle
      const { error: updateErr } = await supabase
        .from('channels')
        .update({ logo_url: publicUrl })
        .eq('id', ch.id);

      if (updateErr) {
        console.log(`  ⚠ DB güncelleme hatası: ${updateErr.message}`);
        failed++;
        continue;
      }

      console.log(`  ✅ Başarılı → ${publicUrl}`);
      updated++;

      // Rate limit: 500ms bekle
      await new Promise(r => setTimeout(r, 500));

    } catch (e) {
      console.log(`  ⚠ Hata: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n════════════════════════════════`);
  console.log(`Toplam: ${channels.length}`);
  console.log(`Güncellenen: ${updated}`);
  console.log(`Skip (zaten Storage): ${skipped}`);
  console.log(`Hata: ${failed}`);
}

main();
