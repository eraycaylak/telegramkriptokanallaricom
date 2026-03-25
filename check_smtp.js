async function check() {
  const token = 'sbp_256c27f05c60db3641b6aec0ba0f0a169cb7b5f2';
  const ref = 'bmvnmlbfozulqflkgdns';
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  console.log("SMTP HOST:", json.smtp_host);
  console.log("SMTP USER:", json.smtp_user);
}
check().catch(console.error);
