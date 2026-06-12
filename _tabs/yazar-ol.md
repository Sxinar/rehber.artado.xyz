---
layout: page
title: Yazar Ol
permalink: /yazar-ol/
icon: fas fa-user-plus
order: 5
---

Rehber kadromuza katılarak Sveltia CMS panelimiz üzerinden içerik üretmek ister misiniz? Aşağıdaki alana **GitHub kullanıcı adınızı** yazarak saniyeler içinde otomatik davetiye alabilirsiniz.

<div style="background: var(--card-bg); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid var(--main-border-color);">
  <form id="inviteForm" onsubmit="sendInvite(event)">
    <div style="margin-bottom: 15px;">
      <label for="ghUsername" style="display: block; font-weight: bold; margin-bottom: 8px;">GitHub Kullanıcı Adınız:</label>
      <input type="text" id="ghUsername" placeholder="Örn: Sxinar" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--input-border-color); background: var(--input-bg); color: var(--text-color);">
    </div>
    <button type="submit" id="submitBtn" style="background: #2ba24c; color: white; border: none; padding: 12px 20px; font-weight: bold; border-radius: 6px; cursor: pointer; width: 100%;">
      🚀 Davetiye Gönder
    </button>
  </form>
  <div id="resultMessage" style="margin-top: 15px; font-weight: bold; display: none;"></div>
</div>

### 💡 Davet Geldikten Sonra Ne Yapmalıyım?
1. Formu gönderdikten sonra GitHub hesabınıza bağlı e-postaya bir davet maili gelecektir. Ya da doğrudan **[github.com/Sxinar/rehber.artado.xyz/invitations](https://github.com/Sxinar/rehber.artado.xyz/invitations)** adresine giderek daveti onaylayabilirsiniz.
2. Daveti kabul ettikten sonra direkt `/admin/` panelimize giderek kendi hesabınızla içerik yazmaya başlayabilirsiniz! yazılar bize taslak olarak düşecektir.

<script>
async function sendInvite(event) {
  event.preventDefault();
  const username = document.getElementById('ghUsername').value;
  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('resultMessage');

  btn.disabled = true;
  btn.innerText = 'Gönderiliyor...';
  msg.style.display = 'none';

  try {
    const response = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await response.json();

    if (response.ok) {
      msg.style.color = '#2ba24c';
      msg.innerText = '🎉 Davetiye başarıyla gönderildi! Lütfen GitHub bildirimlerinizi veya e-postanızı kontrol edin.';
    } else {
      msg.style.color = '#e03e3e';
      msg.innerText = '❌ Hata: ' + (data.error || 'Bir sorun oluştu.');
    }
  } catch (err) {
    msg.style.color = '#e03e3e';
    msg.innerText = '❌ Sunucuyla iletişim kurulamadı.';
  } finally {
    msg.style.display = 'block';
    btn.disabled = false;
    btn.innerText = '🚀 Davetiye Gönder';
  }
}
</script>
