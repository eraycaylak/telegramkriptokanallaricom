const fs = require('fs');

async function updateAuth() {
  const token = 'sbp_256c27f05c60db3641b6aec0ba0f0a169cb7b5f2';
  const ref = 'bmvnmlbfozulqflkgdns';
  const htmlContent = fs.readFileSync('C:\\Users\\ERAY\\.gemini\\antigravity\\brain\\27fe545e-e6cc-4a1a-a7cd-fef543453116\\email_template.html', 'utf8');

  const body = {
    "smtp_admin_email": "noreply@telegramkriptokanallari.com",
    "smtp_host": null,
    "smtp_port": null,
    "smtp_user": null,
    "smtp_pass": null,
    "smtp_sender_name": null,
    "mailer_autoconfirm": true,
    "mailer_subjects_confirmation": "Aramıza Hoş Geldiniz! Hesabınızı Onaylayın",
    "mailer_templates_confirmation_content": htmlContent
  };

  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    const json = await res.json();
    console.log("SUCCESS");
  } else {
    const text = await res.text();
    console.log("ERROR", res.status, text);
  }
}

updateAuth().catch(console.error);
