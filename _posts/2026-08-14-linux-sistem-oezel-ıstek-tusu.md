---
layout: post
title: Linux Sistem Özel İstek Tuşu
description: ''
date: 2026-08-14 12:18:00 +03:00
categories:
  - linux
tags:
  - linux
  - döküman
image: null
published: true
pin: false
math: false
toc: true
---

Bu yazı [Sysrq dökümanı](https://docs.kernel.org/admin-guide/sysrq.html)'nın Türkçe'ye uyarlanmış hâlidir (kısaltılmış).

Bu yazıda **Sysrq** derken **sistem özel istek tuşu** kastedilmiştir.

### Sysrq Tuşu nedir?

**Çekirdeğin** o anki durumu ne olursa olsun (tamamen kilitlenmediyse) tepki verdiği "özel" tuş kombinasyonudur.

### Sysrq Tuşu nasıl açılır?

Öncelikle çekirdek derlenirken sistem özel istek tuşu (Magic SysRq key) (`CONFIG_MAGIC_SYSRQ`) seçeneğini "YES" olarak işaretlemelisiniz. Sysrq ile derlenmiş bir çekirdek kullanırken `/proc/sys/sysrq` dosyası Sysrq tuşunun işlem düzeyini belirtir; varsayılan olarak `CONFIG_MAGIC_SYSRQ_DEFAULT_ENABLE` değerini kullanır ki onun varsayılan değeri `1` olarak ayarlanmıştır. Aşağıda `/proc/sys/kernel/sysrq` dosyasına girilebilecek değerlerin listesi bulunmaktadır.

* 0 - sysrq'yi tamamen kapatır
* 1 - sysrq'nin bütün özelliklerini açar
* > 1 - izin verilen Sysrq özelliklerinin bitmaskesi (detaylı bilgi için aşağıya bakın):

| Değer | Hex | Açıklama |
| --- | --- | --- |
| 2 | 0x2 | konsol günlük kaydı seviyesinin kontrolünü etkinleştir |
| 4 | 0x4 | klavyenin kontrolünü etkinleştir (SAK, unraw) |
| 8 | 0x8 | süreçlerin vb. hata ayıklama dökümlerini etkinleştir |
| 16 | 0x10 | senkronizasyon (sync) komutunu etkinleştir |
| 32 | 0x20 | salt okunur (ro) yeniden bağlamayı etkinleştir |
| 64 | 0x40 | süreçlerin sinyalleşmesini etkinleştir (term, kill, oom-kill) |
| 128 | 0x80 | yeniden başlatmaya/gücü kapatmaya izin ver |
| 256 | 0x100 | tüm RT görevlerinin önceliğini ayarlamaya (nicing) izin ver |

Değeri dosyada şu komutla ayarlayabilirsiniz:

`echo "değer" >/proc/sys/kernel/sysrq`

Değer buraya ondalık veya 0x önekiyle onaltılık olarak yazılabilir. `CONFIG_MAGIC_SYSRQ_DEFAULT_ENABLE` her zaman onaltılık olarak yazılmalıdır.

**NOT:** `/proc/sys/kernel/sysrq` sadece klavye içindir, `/proc/sysrq-trigger` hala tüm fonksiyonları destekler.

### Sysrq nasıl kullanılır?

#### X86'da:

`alt + SysRq + <komut tuşu>` şeklinde kullanılır.

> 
> Not
> 
> Bazı klavyelerde Sysrq tuşu **belirtilmemistir**. SysRq tuşu aynı zamanda 'Print Screen' tuşu dur.
> Ayrıca bazı klavyeler çok fazla tusun aynı anda basılmasını kaldıramaz böyle bi durumda Sansınızı söyle deneye bilirsiniz: `Alt` tuşuna basın `SysRq` tuşuna basın ardından `SysRq` tuşunu bırakın ve hızlı bi sekilde `<Komut tuşu>` tuşuna basın ve herseyi bırakın 

#### SPARC'da:

`Alt` + `STOP` + `<komut tuşu>` şeklinde kullanılır.

> sanırım **--** dökümanda böyle geçiyo .d **--**

#### Seri konsol'da (Kişisel bilgisayar tipi seri portlara özel):

Tek bir `BREAK` gönderirsiniz, ardından **5 saniye** içinde `<komut tuşu>` gönderilir.

> Not:
> İki kere `BREAK` göndermek normal `BREAK` olarak işlenir.

#### PowerPC'de:

`ALT` + `Print Screen` (veya `F13`) tuşu + `<komut tuşu>` şeklinde kullanılır.

> Not:
> `Print Screen` (veya `F13`) + ` <komut tuşu>` bazen yeterli olur.

#### Diğerleri:

Diğer cihazlar için tuş kombinasyonlarını biliyorsanız lütfen bu bölüme güncelleme yapın.

#### Hepsinde:

`/proc/sysrq-trigger` dosyasına karakter yazılır. Bu dosyaya yazılan ilk karakter geçerli sayılır, ancak birden fazla karakter göndermek yine de önerilmez çünkü öngörülemez durumlara neden olabilir veya gelecek sürümlerde değiştirilebilir.

##### Örnek komut:

```bash
echo t > /proc/sysrq-trigger
```

##### Alternatif olarak (önerilmez):

Birden fazla karakterin geçerli olması için harf dizgisinin başına alt tire (`_`) konur.
Böylece sayı dizisindeki bütün harfler işlenir.

```plain
echo _reisub > /proc/sysrq-trigger
```

> <komut tuşu> büyük harfe duyarlıdır

### Komut tablosu:

| Komut | İşlev |
| --- | --- |
| b | Disklerinizi senkronize etmeden veya unmount etmeden sistemi hemen yeniden başlatır. |
| c | Sistem çökmesi gerçekleştirir ve yapılandırılmışsa bir crashdump alınır. |
| d | Tutulan tüm kilitleri gösterir. |
| e | init hariç tüm süreçlere bir SIGTERM gönderir. |
| f | Bir bellek tüketicisi süreci öldürmek için oom killer'ı çağırır, ancak hiçbir şey öldürülemezse panik yapmaz. |
| g | kgdb (çekirdek hata ayıklayıcısı) tarafından kullanılır. |
| h | Yardım görüntüler (aslında burada listelenenler dışındaki herhangi bir tuş yardım görüntüler, ancak h'yi hatırlamak kolaydır :-). |
| i | init hariç tüm süreçlere bir SIGKILL gönderir. |
| j | Zorla "Just thaw it" - FIFREEZE ioctl tarafından dondurulan dosya sistemleri. |
| k | Güvenli Erişim Anahtarı (SAK) Geçerli sanal konsoldaki tüm programları öldürür. NOT: SAK bölümündeki aşağıdaki önemli yorumlara bakın. |
| l | Tüm aktif CPU'lar için bir yığın geri izlemesi (stack backtrace) gösterir. |
| m | Geçerli bellek bilgilerini konsolunuza döker. |
| n | RT görevlerinin önceliğini (nice) ayarlamak için kullanılır. |
| o | Sisteminizi kapatır (yapılandırılmış ve destekleniyorsa). |
| p | Geçerli yazmaçları (registers) ve bayrakları (flags) konsolunuza döker. |
| q | Tüm etkin hrtimer'ların CPU başına listelerini (ancak düzenli timer_list zamanlayıcılarını DEĞİL) ve tüm clockevent cihazları hakkında ayrıntılı bilgileri döker. |
| r | Klavye ham modunu kapatır ve XLATE olarak ayarlar. |
| s | Bağlı tüm dosya sistemlerini senkronize etmeye çalışır. |
| t | Geçerli görevlerin bir listesini ve bilgilerini konsolunuza döker. |
| u | Bağlı tüm dosya sistemlerini salt okunur (read-only) olarak yeniden bağlamaya çalışır. |
| v | Çerçeve arabelleği (framebuffer) konsolunu zorla geri yükler |
| v | ETM arabellek dökümüne neden olur [ARM'ye özgü] |
| w | Kesintisiz (engellenmiş) durumdaki görevleri döker. |
| x | ppc/powerpc platformlarında xmon arayüzü tarafından kullanılır. sparc64 üzerinde genel PMU Yazmaçlarını gösterir. MIPS üzerinde tüm TLB girdilerini döker. |
| y | Genel CPU Yazmaçlarını Göster [SPARC-64'e özgü] |
| z | ftrace arabelleğini döker |
| 0-9 | Konsolunuza hangi çekirdek mesajlarının yazdırılacağını kontrol eden konsol günlük seviyesini ayarlar. (Örneğin 0, yalnızca PANIC veya OOPS gibi acil durum mesajlarının konsolunuza ulaşmasını sağlar.) |
| R | Konsollardaki çekirdek günlüğü mesajlarını yeniden oynatır. |

Ve buraya kadar umarım bu belge sizin işinize yaramıştır; detaylı bilgi için [Sysrq dökümanı](https://docs.kernel.org/admin-guide/sysrq.html)'na bakınız.

(kısaltılmış)
