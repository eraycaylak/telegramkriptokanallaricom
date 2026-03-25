const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data } = await supabase.from('channels').select('name, description, telegram_url').order('created_at', { ascending: false }).limit(20);
  data.forEach(ch => {
    if (ch.description && ch.description.includes('Ekmei')) {
      console.log("FOUND IN DB:", ch.name, ch.telegram_url, ch.description);
    }
  });
  console.log("LAST 5 CHANNELS:");
  data.slice(0,5).forEach(ch => console.log(ch.name, "->", ch.description));
}
check();
