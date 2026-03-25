const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://bmvnmlbfozulqflkgdns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdm5tbGJmb3p1bHFmbGtnZG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTM5ODIsImV4cCI6MjA5MDAyOTk4Mn0.vdZ0VDjOf2vSD249z72wFkjN7-6eqVFFaNQWoaDX7Ys';
const supabase = createClient(supabaseUrl, supabaseKey);

const generateChannels = () => {
  const prefixes = ["Bitcoin", "Ethereum", "Binance", "Altcoin", "Kripto", "Crypto", "Coin", "Token", "DeFi", "Metaverse"];
  const suffixes = ["Sinyal", "Türkiye", "Analiz", "Bulls", "Bears", "VIP", "Premium", "Hunter", "Kazanç", "Trade"];
  let channels = [];
  
  for(let i=0; i<50; i++) {
    const p1 = prefixes[Math.floor(Math.random() * prefixes.length)];
    const p2 = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = `${p1} ${p2} ${i+1}`;
    channels.push({
      category_id: null,
      name,
      slug: name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
      description: `${name} kanalı, ücretsiz ve premium kripto para analizlerini anlık olarak paylaşır. Kripto piyasasında günlük kazanç (win-rate) hedeflerine ulaşmak için oluşturulmuş kapsamlı analiz grubudur. Spot alımlar, futures işlemler ve airdrop fırsatlarını anında öğrenmek için ${name} grubunu ücretsiz takip edin. Telegram kripto sinyal kanalları arasında en yüksek etkileşime ve başarı isabetine sahip, güvenilir uzman kadrosuyla yönetilmektedir.`,
      telegram_url: `https://t.me/${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      is_approved: true,
      is_premium: Math.random() > 0.8,
      is_featured: Math.random() > 0.9,
      votes: Math.floor(Math.random() * 5000),
      views: Math.floor(Math.random() * 200000),
      member_count: Math.floor(Math.random() * 100000),
      language: 'tr'
    });
  }
  return channels;
};

const blogs = [
  { title: 'En İyi Telegram Kripto Kanalları 2026', slug: 'en-iyi-telegram-kripto-kanallari-2026', content: '<h2>2026 Yılının En İyi Kripto Gruplarıyla Tanışın</h2><p>Piyasanın en oynak günlerinde doğru analiz hayat kurtarır. 2026 yılına özel derlediğimiz en isabetli Telegram kripto sinyal gruplarıyla yatırım portföyünüzü katlayın...</p>', excerpt: '2026 yılında takip etmeniz gereken, kazandırma oranı en yüksek Telegram kripto kanallarını inceliyoruz.', seo_title: 'En İyi Telegram Kripto Kanalları 2026 | Ücretsiz Liste', is_published: true, views: Math.floor(Math.random() * 5000) },
  { title: 'Telegram Sinyal Kanalları Ne Kadar Güvenilir?', slug: 'telegram-sinyal-kanallari', content: '<h2>Telegram Sinyal Kanalları Güvenli mi?</h2><p>Telegram kripto kanallarında dikkat etmeniz gereken asıl konu sinyallerin geçmişteki başarı oranının şeffaflığıdır...</p>', excerpt: 'Sinyal kanalları güvenilir mi? Dolandırıcılardan korunma yöntemleri ve doğru kanal seçme ipuçları.', seo_title: 'Telegram Sinyal Kanalları: Dolandırıcılık Mı Kazanç Kapısı Mı?', is_published: true, views: Math.floor(Math.random() * 5000) },
  { title: 'Türk Telegram Kripto Grupları Listesi', slug: 'turk-telegram-kanallari', content: '<h2>Türkiye Kripto Para Topluluğu</h2><p>Türkiye merkezli devasa kitlelere ulaşan kripto analiz sayfaları...</p>', excerpt: 'Türk yatırımcıların en çok kullandığı, analizlerin tamamen Türkçe paylaşıldığı telegram kanalları.', seo_title: 'Türk Telegram Kripto Kanalları | En İyi Yerli Analizler', is_published: true, views: Math.floor(Math.random() * 5000) },
  { title: 'Ücretsiz Telegram Kripto Sinyalleri Alabileceğiniz Yerler', slug: 'ucretsiz-telegram-kanallari', content: '<h2>Bedava VIP Sinyaller</h2><p>Bazı VIP gruplar ücretsiz promosyon sinyalleri atarak kitlesini genişletiyor...</p>', excerpt: 'Para ödemeden yüksek kaliteli ve ücretsiz VIP tarzı sinyaller alabileceğiniz kripto telegram grupları.', seo_title: 'Ücretsiz Telegram Kanalları ve Sinyal Grupları', is_published: true, views: Math.floor(Math.random() * 5000) }
];

async function seed() {
  const { data: cat } = await supabase.from('categories').select('id').limit(1);
  const catId = cat[0]?.id;
  
  if(!catId) { console.error("No categories found"); return; }
  
  const channels = generateChannels().map(c => ({...c, category_id: catId}));
  
  console.log("Inserting 50 channels...");
  const { error: chErr } = await supabase.from('channels').insert(channels);
  if(chErr) console.error("Channel Insert Error:", chErr);
  else console.log("Channels inserted successfully.");
  
  console.log("Inserting 4 blogs...");
  const { error: blgErr } = await supabase.from('blogs').insert(blogs);
  if(blgErr) console.error("Blog Insert Error:", blgErr);
  else console.log("Blogs inserted successfully.");
}

seed();
