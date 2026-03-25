

async function getAuthConfig() {
  const token = 'sbp_256c27f05c60db3641b6aec0ba0f0a169cb7b5f2';
  const ref = 'bmvnmlbfozulqflkgdns';

  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

getAuthConfig().catch(console.error);
