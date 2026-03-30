import fs from 'fs';

const results = JSON.parse(fs.readFileSync('fetch_results.json', 'utf-8'));

const appendText = `\n\nCrypto, kripto para piyasasında altcoin sinyalleri, Bitcoin analizleri, teknik analiz paylaşımları ve güncel kripto haberleri sunan aktif bir Telegram kanalıdır. Kanalda paylaşılan analizler; grafik okumaları, destek-direnç seviyeleri, trend analizleri ve risk yönetimi odaklıdır.\n\n📊 Bu kanalda bulabilecekleriniz:\n• Günlük altcoin sinyalleri\n• Bitcoin (BTC) teknik analizleri\n• Ethereum ve popüler altcoin analizleri\n• Kısa vadeli trade fırsatları\n• Kripto piyasa yorumları\n• Destek & direnç seviyeleri\n• Risk yönetimi stratejileri\n\nKripto para yatırımcıları için hazırlanan bu kanalda paylaşılan tüm içerikler teknik analizlere dayalı şahsi görüşlerdir ve yatırım tavsiyesi değildir. Yeni başlayanlar ve profesyonel traderlar için düzenli içerik paylaşımı yapılmaktadır.`;

const tagsArray = [
  "altcoin sinyalleri", "kripto sinyal", "telegram kripto kanalları", 
  "bitcoin analiz", "altcoin analiz", "crypto sinyal", "btc analiz", 
  "trading sinyal", "kripto telegram", "yatırım sinyalleri"
];
const tagsSql = `ARRAY[${tagsArray.map(t => `'${t}'`).join(', ')}]`;

const valuesStrings = results.map(item => {
    let logoStr = item.image ? `'${item.image.replace(/'/g, "''")}'` : 'NULL';
    return `('${item.id}'::uuid, ${logoStr})`;
}).join(',\n  ');

const query = `
UPDATE public.channels c
SET 
  logo_url = COALESCE(v.logo_url, c.logo_url),
  description = COALESCE(c.description, '') || ${"'" + appendText.replace(/'/g, "''") + "'"},
  tags = ${tagsSql}
FROM (VALUES
  ${valuesStrings}
) AS v(id, logo_url)
WHERE c.id = v.id;
`;

fs.writeFileSync('update_compressed.sql', query.trim());
console.log('Compressed SQL generated!');
