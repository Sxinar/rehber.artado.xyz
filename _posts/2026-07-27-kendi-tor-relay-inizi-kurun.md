---
layout: post
title: Kendi Tor Relay’inizi Kurun!
description: Bildiğiniz üzere internette gerçek anlamda anonim olmak için tek seçeneğimiz Tor. Tor’un bağımsız kalabilmesi içinse sizin ve benim gibi insanlara ihtiyaç var.
date: 2026-07-28 00:10:00 +03:00
categories:
  - İnceleme
  - Güvenlik
tags:
  - güvenlik
  - rehber
image: null
published: true
pin: false
math: false
toc: true
---

#### Tor’u Yıllarca Bedava Kullandım, Şimdi Sıra Bende: Kendi Tor Relay’inizi Kurun!

Bildiğiniz üzere internette gerçek anlamda anonim olmak için tek seçeneğimiz Tor. Tor’un bağımsız kalabilmesi içinse sizin ve benim gibi insanlara ihtiyaç var.
Bu rehberde, Tor’un bağımsız kalması için nasıl kendi Tor relay’inizi (düğümünüzü) kurabileceğinizi göstereceğim. Evinizde boşta duran bir bilgisayarda, Raspberry Pi gibi küçük bir cihazda veya ayda yaklaşık 150-200 TL’ye kiraladığınız bir sunucuda bile bunu kolayca yapabileceksiniz.

## Tor’u Sadece Hacker’lar mı Kullanıyor?

Kuruluma geçmeden önce şu soruyu soruyor olabilirsiniz: _"Abi Tor’u hacker’lar kullanmıyor muydu, biz bu adamlara niye yardım edelim?"_
Eğer böyle düşünüyorsanız yanılıyorsunuz. Yapılan araştırmalara baktığımızda Tor’u kullanan insanların büyük çoğunluğunun sansürden kaçmak veya anonim bilgi paylaşımı yapmak için bu ağı kullandığını görüyoruz. Tor kullanan insanların büyük kısmı Dark Web’deki sitelere değil, normal tarayıcıdan girdiğimiz sitelere erişiyor.

> **İstatistik:** 2020 yılında yapılan bir araştırmaya göre Tor kullanıcılarının sadece **%6,7’si** .onion uzantılı Dark Web sitelerine girerken, **%93,3’ü** normal internet sitelerine girmiş. Yani yasa dışı aktiviteler için Tor’u kullanan insan sayısı çoğunlukta değil, oldukça azınlıkta.
> 
> İnternetin özgür kalması için Tor gibi bir aracın kesinlikle var olması lazım ve bu yüzden bizim gibi insanların bu ağa katkıda bulunması gerekiyor.

## Tor Nasıl Çalışır ve Relay (Düğüm) Türleri Nelerdir?

Tor ağının nasıl çalıştığını basitçe anlamak önemli. Tor tarayıcısından bir arama yaptığınızda (örneğin DuckDuckGo üzerinden), bağlantınız hedef siteye ulaşana kadar **3 farklı relay (düğüm)** üzerinden geçer:

1. **Guard (Giriş) Relay:** Ağa ilk girdiğiniz noktadır.
2. **Middle (Orta) Relay:** Trafiği şifreli olarak ileten ara düğümdür.
3. **Exit (Çıkış) Relay:** Trafiğin Tor ağından çıkıp hedef web sitesine bağlandığı son noktadır.

```plain
[Kullanıcı] ---> [Guard Relay] ---> [Middle Relay] ---> [Exit Relay] ---> [Hedef Web Sitesi]
```

Tor’un çalışma şeklinden dolayı bu 3 relay’in hiçbiri sizin bilginizin tamamına sahip değildir. Siz bu üç relay’den herhangi birisini çalıştırabilirsiniz ancak benim tavsiyem **Middle (Orta) Relay** çalıştırmaktır.

### Neden Çıkış (Exit) Relay Kurmamalısınız?

Birisi sizin Exit Relay’inizi kullandığında, bağlandığı web sitesi Exit Relay’in IP adresini görür. Eğer o kişi yasa dışı bir işlem yaparsa, çıkış IP’si sizin sunucunuza ait olacağı için telif veya yasal şikayetler doğrudan sizin kapınıza gelecektir.
Oysa **Middle (Orta) Relay** çalıştırdığınızda şikayet gelme ihtimali imkansıza yakındır. Çünkü ne web sitesi sizin IP’nizi bilir ne de siz kullanıcının kim olduğunu bilirsiniz.

### Neden Doğrudan Guard Relay Olunamaz?

Kurduğunuz bir relay ilk günden Guard Relay olamaz. Tor’un yapısına göre (_The Life Cycle of a New Relay_):

* **0 - 3 Gün:** Yeni kurulan relay dinlenme aşamasındadır, pek trafik almaz.
* **3 - 8 Gün:** Ağ tarafından hız testleri yapılır ve kullanılmaya başlar.
* **8 - 68 Gün:** Yeterince stabil çalışırsa ağ tarafından otomatik olarak **Guard** statüsüne yükseltilebilir.

## Sistem Gereksinimleri

Kendi Orta Relay’inizi kurabilmek için sistem gereksinimleri oldukça düşüktür:

* **RAM:** En az 512 MB (Günümüzdeki en zayıf bilgisayarlarda bile fazlasıyla var).
* **Disk:** 200 MB’tan fazla bir depolama alanına ihtiyacınız yok.
* **İnternet Hızı:** En az 10 Mbps Download / Upload (Önerilen: 16 Mbps).
* **Bant Genişliği:** Ayda en az 100 GB kota ayırabilmelisiniz.
* **Çalışma Süresi:** 7/24 açık kalma zorunluluğu yoktur ancak işe yaraması için günde en az 2 saat açık kalması önerilir.

## Adım Adım Tor Relay Kurulum Rehberi

Bu kurulumu evinizdeki boş bir bilgisayarda yapabileceğiniz gibi kiralık bir Linux (Ubuntu/Debian) VPS sunucusunda da yapabilirsiniz.

### 1. Otomatik Güncellemeleri Açın

Güvenlik açısından Tor sunucumuzun güncel kalması şarttır. Öncelikle sistemimizi güncelleyelim ve otomatik güncelleme paketlerini kuralım:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install unattended-upgrades apt-listchanges -y
```

Ardından otomatik güncellemelerin aktif olup olmadığını kontrol etmek için şu komutu çalıştırabilirsiniz:

```bash
sudo unattended-upgrade --debug
```

### 2. Tor Paketini Yükleyin

Sisteminize temel Tor paketini kurun:

```bash
sudo apt install tor -y
```

### 3. Konfigürasyon Dosyasını (torrc) Düzenleyin

Tor’un nasıl çalışacağını belirlemek için konfigürasyon dosyasını açıyoruz (nano veya vim kullanabilirsiniz):

```bash
sudo nano /etc/tor/torrc
```

Dosyanın en altındaki boş bir yere şu ayarları ekleyin:

```text
Nickname midetRelay                 # Relay'inize vermek istediğiniz isim
ContactInfo anonim@eposta.com        # İletişim e-postanız (Anonim kalmak için ikincil bir e-posta yazın)
ORPort 443                           # Standart HTTPS portu (Değiştirebilirsiniz)
ExitRelay 0                          # Çıkış düğümü olmamak için 0 yapıyoruz
SocksPort 0                          # SOCKS portunu kapatıyoruz

ControlPort 9051                     # İzleme araçları (Nyx) için kontrol portu
CookieAuthentication 1               # Güvenli doğrulama
```

> **Kota Sınırı Koymak İstiyorsanız:**
> Eğer internetiniz kotalıysa veya sunucunuza sınır koymak istiyorsanız torrc dosyasına şu satırları da ekleyebilirsiniz:
> \`\`\`text
> AccountingMax 900 GB
> AccountingStart month 1 00:00
> 
> \`\`\`
> 
> Ayar dosyasını kaydedip çıktıktan sonra Tor servisini yeniden başlatın:

```bash
sudo systemctl restart tor
```

Çalışıp çalışmadığını kontrol etmek için:

```bash
sudo systemctl status tor
```

### 4. Nyx ile Sunucu Trafiğini Anlık İzleyin

Düğümünüzün ne kadar veri aktardığını, kaç kişi tarafından kullanıldığını terminal üzerinden görsel olarak takip etmek için **Nyx** aracını kurabilirsiniz:

```bash
sudo apt install nyx -y
```

Arayüzü açmak için sadece komut satırına yazmanız yeterlidir:

```bash
nyx
```

_Açılan ekranda anlık indirme/yükleme hızlarınızı, toplam kullanılan bant genişliğini ve bağlantı durumlarını görebilirsiniz._

### 5. Tor Depolarını Güncelleyin (Önemli)

Ubuntu/Debian’ın kendi paket depolarındaki Tor sürümü eski olabilir. En güncel güvenlik yamalarına sahip olmak için Tor Project’in resmi depolarını sisteminize ekleyip Tor’u en son sürüme güncellemeniz önerilir.

## Özet ve Son Sözler

İşte bu kadar! Sadece birkaç basit komutla internetin özgür ve anonim kalmasına doğrudan katkıda bulunan bir Tor Relay çalıştırmış oldunuz.
Eğer Tor ağını kullanırken Dark Web tarafına merak duyuyorsanız ve oralarda nasıl güvende kalacağınızı öğrenmek istiyorsanız, daha önce Yusuf ipeğin çektiği **"Dark Web'e Erişmenin 4 Seviyesi"** videosunu da izleyebilirsiniz.

Bu Rehber Yusuf İpek TOR Relay kurma videosundan alınmıştır.Tamamen Yusuf İpek anlatımıdır.

Yazılı rehber isteyen arkadaşlar için ve Açık kaynak dünyasına katkı sağlamak amacıyla Teknolojirehberleri üzerinde paylaşılmıştır.


## Credit: Yusuf İpek

## WebSite: https://yusufipek.me

## İlgili Youtube Videosu: https://youtu.be/b7i-832Ffsw
