# Oyun verilerini düzenleme

Asıl kaynaklar kökteki **index.html** ve **data/** klasörüdür. Event ve meslek tanımlarını artık index.html içinde aramanız gerekmez.

## Dosyalar

- **events/**: gündelik olaylar, aile, ilişkiler, sağlık, dünya, iş ve işletme olayları.
- **careers/**: tam zamanlı ve yarı zamanlı işler, askerlik, spor meslekleri, ligler, işletmeler ve terfi rütbeleri.
- **events/11-olay-cevirileri*.js**: mevcut eventlerin İngilizce çevirileri.

Dosyalar bağımlılık sırası korunarak index.html içindeki klasik script etiketleriyle yüklenir. Scriptlere async/defer eklemeyin; dosyaların sırasını değiştirmeyin. Aynı konu birden fazla aşamada tanımlanıyorsa -2, -3 gibi dosyalar vardır.

## Yeni event eklemek

Örneğin events/02-gundelik-olaylar.js dosyasının EV.push listesine aşağıdaki nesneyi ekleyebilirsiniz:

```js
{
  a: [18, 65],
  t: "Yeni bir hobi",
  d: "Bir arkadaşın seni resim yapmaya davet ediyor.",
  c: [
    { t: "Katıl", m: "Resim yaptın.", fx: { m: 5, z: 1 } },
    { t: "Vazgeç", m: "Evde kalmayı seçtin.", fx: {} }
  ]
}
```

| Alan | Anlamı |
| --- | --- |
| a | Minimum ve maksimum yaş |
| t | Event başlığı |
| d | Açıklama; metin veya fonksiyon |
| c | Seçenekler listesi |
| c[].t | Seçenek metni |
| c[].m | Olay akışına yazılan sonuç |
| c[].fx | h: sağlık, m: mutluluk, z: zeka, g: görünüm, p: para |
| f | Eventin çıkabilmesi için ek koşul fonksiyonu |
| once | true ise aynı hayatta bir kez çıkar |
| costsMoney | Para harcatan olay: çocuk yaşlarda engellenir |
| worldEvent | Dünya olayı: çocuk yaşlarda engellenir |
| c[].run | Seçimden sonra çalışan ek oyun işlemi |

Mevcut başlıklar kayıtların seen/once listelerinde kullanılır. Başlık değişikliği eski kayıtların aynı olayı tekrar görmesine yol açabilir. Çevirilerde bazı listeler sırayla eşleştirilir; mevcut sırayı koruyun. Türkçe sosyal olay listesine event eklerseniz İngilizce FE listesine karşılığını aynı sırada ekleyin.

## Meslek eklemek

careers/01-tam-zamanli.js içindeki JOBS listesine ekleyin:

```js
{ n: "Yeni meslek", z: 40, s: 480000 }
```

- n: meslek adı; mevcut kariyer kayıtları ve rütbe sisteminde kullanılır.
- z: gereken zeka.
- s: yıllık **brüt** temel maaş; net aylık maaş değildir.
- u: 1 ise üniversite mezuniyeti gerekir.
- d: kabul edilen bölüm kimlikleri (isteğe bağlı).
- Yarı zamanlı işler PART listesinde; spor meslekleri SPORTS / TEAM_SPORTS listelerinde bulunur.
- Futbol ve basketbol/voleybol takımları ilgili lig dosyalarında; rütbeler kariyer-rutbeleri dosyasında bulunur.

## Değişiklikleri paketlere aktarmak

Kökteki dosyaları düzenledikten sonra çalıştırın:

```sh
node scripts/sync-game-data.cjs
```

Kontrol etmek için (DOM, bu kontrolde taklit edilir; görsel tarayıcı testi değildir):

```sh
npm run check:game
```

Eşitleme komutu web dosyasıyla birlikte data/ klasörünü Android (www/) ve iOS (LifeLine/Resources/) kopyalarına aktarır. GitHub Pages kökteki dosyaları kullanır. Artık index.html tek başına taşınmamalı; data/ klasörü yanında bulunmalıdır.

## Yüklenen dosyalar

- careers/01-tam-zamanli.js
- events/01-temel-olaylar.js
- events/02-gundelik-olaylar.js
- careers/04-askerlik.js
- careers/02-yari-zamanli.js
- careers/03-ozel-kariyerler.js
- careers/05-futbol-ligleri.js
- careers/05-futbol-ligleri-2.js
- careers/05-futbol-ligleri-3.js
- careers/05-futbol-pozisyonlari.js
- careers/06-basketbol-voleybol-ligleri.js
- careers/06-basketbol-voleybol-branslari.js
- careers/07-spor-meslekleri.js
- events/03-macera.js
- events/04-aile.js
- events/05-ulke-kosullari.js
- events/06-iliskiler.js
- events/07-sosyal-olaylar.js
- events/08-saglik.js
- events/08-saglik-2.js
- events/09-hukuk.js
- careers/08-isletmeler-eski.js
- careers/09-terfi-unvanlari.js
- events/10-dunya-olaylari.js
- events/08-saglik-yillik.js
- events/11-olay-cevirileri.js
- events/14-arac-kosullari.js
- events/12-is-olaylari.js
- careers/08-isletmeler.js
- events/13-isletme-olaylari.js
- careers/09-kariyer-rutbeleri.js

## Aktivite, ekonomi ve ilişkiler

- `gameplay/01-limits-and-balance.js`: yıllık aktivite sınırları, yaşam gider oranları ve LifeFans abone büyümesi/iptalleri.
- `gameplay/02-relationship-pages.js`: kişi sayfası ve ilişki eylemleri.
- Yıllık kullanım sayaçları kayıt dosyasında saklanır; oyunu kapatıp açmak sınırları sıfırlamaz.

- `gameplay/03-friend-approval.js`: rastgele karşılaşılan arkadaş adayları kabul edilmeden ilişkilere eklenmez.

- `gameplay/04-family-tree.js`: soy ağacının kişi kartları ve kuşak bağlantıları.

- `gameplay/05-sports-contracts.js`: Futbol, basketbol ve voleybolda sezon performansına göre transfer teklifleri ve tek seferlik %10/%20/%30 maaş pazarlığı. Bekleyen teklif İşim sayfasından tekrar açılır; sonraki sezon sona erer.

- `gameplay/06-sports-statistics.js`: Branşa ve pozisyona göre kişisel sezon istatistikleri, kalıcı kariyer toplamları ve İşim sayfasındaki istatistik kartları. Eski sezonların kişisel verileri mevcut olmadığından yalnızca son oynanmış sezon içeri alınır.

- `gameplay/07-football-league-browser.js`: Futbol kariyerinden ülke/lig seçerek diğer puan tablolarına bakma. Tablolar yıl boyunca sabit kalır; oyuncunun ligi gerçek sezon sonuçlarını kullanır.

Türkiye futboluna Süper Lig eklendi (`05-futbol-ligleri.js`, `super`). Eski kayıtlarla uyum için tier=0; 1. Lig tier=1, 2. Lig tier=2. Seçmelerde yaklaşık %90 2. Lig, %8 1. Lig, %2 Süper Lig; 1. Lig oyuncularına 80+ sezon puanında Süper Lig teklifi gelebilir.

- `gameplay/08-european-cups.js`: Şampiyonlar Ligi ve Avrupa Ligi. Oyun formatı: 32 takım / 8 grup, ilk 2 son 16, çift maçlı elemeler, tek maç final; beraberlikte penaltı. Avrupa ülkelerindeki üst liglerde ilk 2 ŞL, 3-4 Avrupa Ligi; kazanılan hak gelecek yıl kullanılır. ABD/Japonya/BAE ve alt ligler katılmaz. Transferde hak yeni takıma göre belirlenir, kupa sonuçları kayıtla korunur.

- `gameplay/09-game-audio.js`: Web Audio ile üretilen özgün tıklama, kapatma, yaş ilerletme ve pop-up sesleri. Menü > Ayarlar > Oyun sesleri ile açılıp kapanır; tercih cihazda saklanır. İlk kullanıcı tıklamasından önce ses çalmaz, uygulama arka plana alındığında durur. Ses dosyası veya harici bağımlılık gerektirmez.

- `careers/10-club-strengths.js`: Tüm kulüplerin yaklaşık güçleri (0–100); üst lig takım puanları tek tek, alt futbol liglerinde puanlar sabit taban + isim varyasyonu. Puanlar resmî canlı veri değil, ayarlanabilir oyun dengesi.
- `gameplay/10-sports-match-engine.js`: Futbol gol dağılımı, basketbol skorları ve voleybol setleri güç farkından etkilenir. Avrupa kupaları ve diğer lig tabloları da aynı motoru kullanır.
- `events/15-mizah-ve-sosyal-medya.js`: 22 günlük mizah olayı + 10 sosyal medya olayı; dört hafif yetişkin şakası 18+ ile sınırlı.
- `gameplay/11-social-surprises.js`: İçerik paylaşınca %30 ihtimalle ek sosyal olay, yılda en fazla 1; takipçi etkileri küçük ve parasal ödül yok.

- `gameplay/12-club-applications.js`: Futbol ve basketbol oyuncuları ülke/lig/kulüp seçerek başvurabilir. Yılda 3, aynı kulübe 1 başvuru; o ülkede bulunma şartı vardır. Kabul şansı performans, son sezon puanı ve kulüp gücüne bağlıdır. Teklif kabul edilene kadar mevcut takım korunur; aynı branşta transfer için istifa gerekmez.

- `gameplay/13-fame-growth.js`: Şöhret sosyal medyadaki toplam takipçi/aboneler ve işletmenin şube, çalışan, ciro, itibar ve kârlı faaliyet süresine göre hesaplanır. İki kaynak birlikte katkı verir; işletme sahiplerinde de ana ekrandaki bar görünür. Takipçi hedefleri `FAME_BALANCE.socialMilestones` üzerinden değiştirilebilir.

## Birbirine bağlı hayat sistemleri
- `gameplay/14-life-choices.js`: Yıl/hayat/hedef denetimli karar kuyruğu.
- `15-fame-events.js`: Röportaj, reklam, hayran karşılaşması ve ufak skandal. Tanınırlık etkisi zamanla azalır, etkinlikler en fazla yılda bir.
- `16-relationship-invitations.js`: Arkadaş daveti, partner konuşması ve aile yardım/buluşma isteği; hedef ölmüş veya değişmişse eski seçim uygulanmaz.
- `17-business-management.js`: Kalite, müşteri yorumları, çalışan eğitimi ve rakipler. Kalite/rekabet gelecek yılın gelirini etkiler; yatırımlar yıllık sınırlıdır.
- `18-athlete-lifecycle.js`: Sakatlık ve yedeklik maç sayısını azaltır; sözleşme, yenileme, emeklilik ve antrenörlük.
- `19-league-movement.js`: Tüm futbol/basketbol/voleybol liglerinde yükselme/düşme, yavaş kulüp gelişimi. Yeni kadrolar gelecek sezon uygulanır; takım sayıları korunur. Ülkeler arasında takım geçişi yoktur.
- `20-connected-year.js`: Yeni sistemlerin yıllık akışı. Sözleşmesi yenilenmeyen oyuncu sonraki yıl ücret almadan takımından ayrılır.
