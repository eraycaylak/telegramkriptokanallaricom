import fs from 'fs';

const results = JSON.parse(fs.readFileSync('fetch_results.json', 'utf-8'));

const appendText = `

Crypto, kripto para piyasasında altcoin sinyalleri, Bitcoin analizleri, teknik analiz paylaşımları ve güncel kripto haberleri sunan aktif bir Telegram kanalıdır. Kanalda paylaşılan analizler; grafik okumaları, destek-direnç seviyeleri, trend analizleri ve risk yönetimi odaklıdır.

📊 Bu kanalda bulabilecekleriniz:
• Günlük altcoin sinyalleri
• Bitcoin (BTC) teknik analizleri
• Ethereum ve popüler altcoin analizleri
• Kısa vadeli trade fırsatları
• Kripto piyasa yorumları
• Destek & direnç seviyeleri
• Risk yönetimi stratejileri

Kripto para yatırımcıları için hazırlanan bu kanalda paylaşılan tüm içerikler teknik analizlere dayalı şahsi görüşlerdir ve yatırım tavsiyesi değildir. Yeni başlayanlar ve profesyonel traderlar için düzenli içerik paylaşımı yapılmaktadır.`;

const tagsArray = [
  "altcoin sinyalleri", "kripto sinyal", "telegram kripto kanalları", 
  "bitcoin analiz", "altcoin analiz", "crypto sinyal", "btc analiz", 
  "trading sinyal", "kripto telegram", "yatırım sinyalleri"
];
// Format for postgres array
const tagsSql = `ARRAY[${tagsArray.map(t => `'${t}'`).join(', ')}]`;

let sqlCommands = [];

for (const item of results) {
  let logoUpdate = '';
  if (item.image) {
    logoUpdate = `logo_url = '${item.image.replace(/'/g, "''")}', `;
  }

  // we use coalesce(description, '') to safely append
  const updateQuery = `
UPDATE public.channels 
SET 
  ${logoUpdate}
  description = COALESCE(description, '') || ${"'" + appendText.replace(/'/g, "''") + "'"},
  tags = ${tagsSql}
WHERE id = '${item.id}';
  `.trim();
  
  sqlCommands.push(updateQuery);
}

fs.writeFileSync('update.sql', sqlCommands.join('\n\n'));
console.log('SQL generated!');
