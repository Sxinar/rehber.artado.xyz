// api/invite.js
export default async function handler(req, res) {
  // CORS ayarları (Güvenlik ve erişim için)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnızca POST istekleri kabul edilir.' });
  }

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'GitHub kullanıcı adı zorunludur.' });
  }

  const token = process.env.GITHUB_INVITE_TOKEN;
  // Kendi GitHub kullanıcı adınızı ve deponuzu buraya yazın:
  const repo = "Sxinar/rehber.artado.xyz"; 

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/collaborators/${username.trim()}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ permission: 'write' })
    });

    if (response.status === 201 || response.status === 204) {
      return res.status(200).json({ success: true, message: 'Davetiye başarıyla gönderildi!' });
    } else {
      const errorData = await response.json();
      return res.status(400).json({ error: errorData.message || 'GitHub API hatası oluştu.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}
