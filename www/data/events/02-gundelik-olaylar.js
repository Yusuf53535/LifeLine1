// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
const bd = (d) => () => {
  if (S.partner) S.partner.b = cl(S.partner.b + d);
};
EV.push(
  {
    a: [4, 10],
    t: "Parkta düştün",
    d: "Kaydıraktan düştün, dizin yandı.",
    c: [
      { t: "Ağla", m: "Annen koşup geldi, sarıldı.", fx: { m: -2, h: -2 } },
      { t: "Kalk, oynamaya devam et", m: "Yarayı umursamadın.", fx: { m: 3, h: -2 } },
    ],
  },
  {
    a: [5, 12],
    t: "Yeni bisiklet",
    d: "Doğum gününde sana bisiklet aldılar.",
    c: [
      {
        t: "Hızlı sür",
        m: "Hızlıydın ama düştün.",
        w: [0.5, "Mahallede kimse seni yakalayamadı!", { m: 8, h: 2 }],
        fx: { h: -8, m: -2 },
      },
      { t: "Dikkatli sür", m: "Güvenle tur attın.", fx: { m: 4, h: 2 } },
    ],
  },
  {
    a: [7, 17],
    t: "Karne günü",
    d: "Karneni almaya gidiyorsun.",
    c: [
      {
        t: "Gururla göster",
        m: "Notlar kötüydü, ailen üzüldü.",
        w: [() => S.z / 110, "Pekiyi aldın, ailen çok mutlu!", { m: 10, z: 2 }],
        fx: { m: -6 },
      },
      { t: "Çantanın dibine sakla", m: "Karneyi sakladın.", fx: { m: -2 } },
    ],
  },
  {
    a: [5, 16],
    t: "Doğum günü partisi",
    d: "Bu yıl doğum gününü nasıl kutlayacaksın?",
    c: [
      { t: "Arkadaşlarını çağır", m: "Evde çok eğlendiniz.", fx: { m: 9 } },
      { t: "Sadece ailenle", m: "Sakin bir pasta kestiniz.", fx: { m: 4 } },
    ],
  },
  {
    a: [8, 17],
    t: "Harçlık",
    d: "Bu hafta harçlığın biraz fazla çıktı.",
    c: [
      { t: "Biriktir", m: "Kumbarana attın.", fx: { p: 800, m: -1 } },
      { t: "Hemen harca", m: "Büfeden bir sürü şey aldın.", fx: { m: 5 } },
    ],
  },
  {
    a: [10, 24],
    t: "Oyun gecesi",
    d: "Arkadaşlar online, yeni bölüm çıktı.",
    c: [
      {
        t: "Sabaha kadar oyna",
        m: "Sabaha kadar oynadın, gözün şişti.",
        fx: { m: 7, h: -3, z: -1 },
      },
      { t: "Uyu", m: "Erkenden yattın.", fx: { h: 3 } },
    ],
  },
  {
    a: [13, 40],
    t: "Video çektin",
    d: "Komik bir video çektin, paylaşmak istiyorsun.",
    c: [
      {
        t: "Paylaş",
        m: "Kimse izlemedi, bir iki kişi dalga geçti.",
        w: [0.3, "Video viral oldu, herkes seni tanıyor!", { m: 12, g: 2, p: 15000 }],
        fx: { m: -6 },
      },
      { t: "Paylaşma", m: "Telefonda saklı kaldı.", fx: {} },
    ],
  },
  {
    a: [14, 26],
    t: "Sigara teklifi",
    d: "Bir arkadaşın sana sigara uzatıyor.",
    c: [
      { t: "İç", m: "Öksürerek içtin, hiç hoş değildi.", fx: { h: -8, m: 2 } },
      { t: "Hayır de", m: "Hayır dedin, kimse bir şey demedi.", fx: { m: 2, h: 1 } },
    ],
  },
  {
    a: [16, 35],
    t: "Ev partisi",
    d: "Hafta sonu için bir arkadaşın ev partisi veriyor.",
    c: [
      {
        t: "Sabaha kadar kal",
        m: "Çok eğlendin ama sabah yorgundun.",
        fx: { m: 9, h: -5, p: -4000 },
      },
      { t: "Erken ayrıl", m: "Biraz takılıp eve döndün.", fx: { m: 2 } },
    ],
  },
  {
    a: [18, 30],
    t: "Ehliyet sınavı",
    d: "Direksiyon sınavı için randevun var.",
    once: 1,
    c: [
      {
        t: "Sınava gir",
        m: "Ehliyet sınavına başvuruyorsun.",
        fx: {},
        run: () => openDrivingExam(),
      },
      { t: "Sonra bakarım", m: "Sınavı erteledin.", fx: {} },
    ],
  },
  {
    a: [20, 28],
    t: "Askerlik çağrısı",
    d: "Askerlik zamanın geldi.",
    once: 1,
    f: () => !S.f && (!S.home || S.home === "Türkiye"),
    c: [
      {
        t: "Askere git",
        m: "Bedelli ödemeden vatani görevini yaptın.",
        fx: { h: 4, m: -6, z: 2, g: 2 },
      },
      { t: "Bedelli öde", m: "Bedelli ödedin.", fx: { p: -450000, m: 2 } },
    ],
  },
  {
    a: [18, 80],
    t: "Piyango bileti",
    d: "Büfede bilet satıyorlar.",
    c: [
      {
        t: "Bilet al",
        m: "Bilet tutmadı.",
        w: [0.04, "Büyük ikramiye çıktı!!!", { p: 12000000, m: 20 }],
        fx: { p: -300 },
      },
      { t: "Almaktan vazgeç", m: "Geçtin gittin.", fx: {} },
    ],
  },
  {
    a: [8, 80],
    t: "Sokak kedisi",
    d: "Bir yavru kedi seni eve kadar takip etti.",
    c: [
      { t: "Sahiplen", m: "Kedin artık evinin bir parçası.", fx: { m: 9, p: -1500 } },
      { t: "Mama ver, yoluna devam et", m: "Mama verdin, kedi gitti.", fx: { m: 2 } },
    ],
  },
  {
    a: [20, 64],
    t: "Patronla tartışma",
    d: "Patron toplantıda seni herkesin önünde eleştirdi.",
    f: () => S.job,
    c: [
      { t: "Sus", m: "Sessiz kaldın, canın sıkıldı.", fx: { m: -4 } },
      {
        t: "Karşı çık",
        m: "Patron sinirlendi, ortam gerildi.",
        w: [0.5, "Patron haklı olduğunu kabul etti.", { m: 6 }],
        fx: { m: -6 },
      },
    ],
  },
  {
    a: [22, 60],
    t: "Terfi teklifi",
    d: "Müdür sana yeni bir pozisyon öneriyor.",
    f: () => S.job,
    c: [
      {
        t: "Kabul et",
        m: "Terfi aldın, maaşın %20 arttı.",
        fx: { m: 4, h: -2 },
        run: () => {
          S.job = { ...S.job, s: Math.round(S.job.s * 1.2) };
        },
      },
      { t: "Reddet", m: "Şimdilik kalmak istedin.", fx: { m: -2 } },
    ],
  },
  {
    a: [25, 60],
    t: "Şirket küçülüyor",
    d: "Şirkette işten çıkarmalar konuşuluyor.",
    f: () => S.job,
    c: [
      {
        t: "Kal",
        m: "Endişeyle çalışmaya devam ettin.",
        fx: { m: -3 },
        run: () => {
          if (Math.random() < 0.3) {
            S.job = null;
            line("İşten çıkarıldın.", "bad");
          }
        },
      },
      {
        t: "Kendin ayrıl",
        m: "Tazminat alıp ayrıldın.",
        fx: { p: 30000, m: -2 },
        run: () => {
          S.job = null;
        },
      },
    ],
  },
  {
    a: [18, 70],
    t: "Sevgiliyle tatil",
    d: "Sevgilin bir tatile çıkmayı teklif ediyor.",
    f: () => S.partner,
    c: [
      { t: "Git", m: "Harika bir tatil oldu.", fx: { m: 10, p: -90000 }, run: bd(12) },
      { t: "Gitme", m: "Tatil teklifini geri çevirdin.", fx: { m: -2 }, run: bd(-6) },
    ],
  },
  {
    a: [16, 60],
    t: "Sevgiliyle kavga",
    d: "Sevgilinle ufak bir konu yüzünden tartıştınız.",
    f: () => S.partner,
    c: [
      { t: "Özür dile", m: "Barıştınız.", fx: { m: -1 }, run: bd(5) },
      { t: "Israr et", m: "Tartışma büyüdü.", fx: { m: -4 }, run: bd(-15) },
    ],
  },
  {
    a: [22, 85],
    t: "Evlilik yıldönümü",
    d: "Bugün evlilik yıldönümünüz.",
    f: () => S.married,
    c: [
      { t: "Sürpriz yap", m: "Eşin çok mutlu oldu.", fx: { m: 8, p: -25000 }, run: bd(10) },
      { t: "Unut gitsin", m: "Eşin bozuldu.", fx: { m: -4 }, run: bd(-10) },
    ],
  },
  {
    a: [16, 80],
    t: "Telefon çalındı",
    d: "Otobüste telefonun yok oldu.",
    c: [
      { t: "Polise bildir", m: "Şikayet ettin, telefon bulunamadı.", fx: { m: -3 } },
      { t: "Yenisini al", m: "Yeni bir telefon aldın.", fx: { p: -45000, m: -2 } },
    ],
  },
  {
    a: [12, 60],
    t: "Maç bileti",
    d: "Takımın derbiye çıkıyor.",
    c: [
      { t: "Tribüne git", m: "Tribünde tüm gece bağırdın.", fx: { m: 9, p: -3500, h: -1 } },
      { t: "Evde izle", m: "Koltukta sakin sakin izledin.", fx: { m: 4 } },
    ],
  },
  {
    a: [14, 60],
    t: "Dedikodu",
    d: "Bir arkadaşın hakkında dedikodu duydun.",
    c: [
      {
        t: "Dedikoduya katıl",
        m: "Birkaç kişiyle konuştun, içini rahat bırakmadı.",
        fx: { m: -3 },
      },
      { t: "Karışma", m: "Ortamdan uzak durdun.", fx: { z: 1, m: 1 } },
    ],
  },
  {
    a: [3, 80],
    t: "Grip oldun",
    d: "Boğazın yanıyor, ateşin çıkmış.",
    c: [
      { t: "Yat dinlen", m: "İki gün dinlendin, iyileştin.", fx: { h: 4, m: -1 } },
      { t: "Aldırma", m: "Dinlenmeden günlük işlerine devam ettin, hastalığın uzadı.", fx: { h: -6, m: -1 } },
    ],
  },
  {
    a: [20, 55],
    t: "Girişim fikri",
    d: "Aklında harika bir iş fikri var.",
    c: [
      {
        t: "Dene",
        m: "Fikir tutmadı, para kaybettin.",
        w: [0.25, "İşin tuttu, kazanç sağladın!", { p: 800000, m: 12, z: 3 }],
        fx: { p: -150000, m: -6 },
      },
      { t: "Vazgeç", m: "Riske girmedin.", fx: {} },
    ],
  },
  {
    a: [30, 80],
    t: "Miras",
    d: "Uzak bir akrabadan sana miras kaldı.",
    c: [{ t: "Kabul et", m: "Beklemediğin bir para geldi.", fx: { p: 1500000, m: 4 } }],
  },
  {
    a: [20, 60],
    t: "Trafik",
    d: "Yolda bir saattir hiç ilerlemiyorsun.",
    c: [
      { t: "Sakin kal", m: "Radyoyu açıp şarkı söyledin.", fx: { z: 1 } },
      { t: "Korna çal", m: "Sinirlendin, kimseyi umursatmadın.", fx: { m: -3, h: -1 } },
    ],
  },
  {
    a: [18, 45],
    t: "Kafede tanışma",
    d: "Kafede yanındaki masadan biri sana gülümsüyor.",
    f: () => !S.partner,
    c: [
      {
        t: "Merhaba de",
        m: "Sohbet ettiniz, numaraları aldınız.",
        fx: { m: 7 },
        run: () => {
          const pf = pickG(),
            n = FN(pf).split(" ")[0];
          S.partner = { n, b: 50, f: pf };
          line(n + " ile çıkmaya başladınız.", "gold");
        },
      },
      { t: "Gülümse, geç", m: "Kafenden çıkıp yoluna gittin.", fx: {} },
    ],
  },
  {
    a: [16, 60],
    t: "Spor salonu üyeliği",
    d: "Yeni bir spor salonu açıldı.",
    c: [
      { t: "Üye ol", m: "Düzenli gitmeye başladın.", fx: { h: 5, g: 3, p: -18000 } },
      { t: "Hayır", m: "Şimdilik geçtin.", fx: {} },
    ],
  },
  {
    a: [20, 50],
    t: "Eski sevgili",
    d: "Eski sevgilin sana mesaj attı.",
    c: [
      { t: "Cevapla", m: "Biraz konuştunuz, kafan karıştı.", fx: { m: -2 } },
      { t: "Engelle", m: "Mesajı sildin, rahatladın.", fx: { m: 2 } },
    ],
  },
  {
    a: [5, 80],
    t: "Köye gidiş",
    d: "Hafta sonu köye gitmek ister misin?",
    c: [
      { t: "Git", m: "Temiz hava, taze ekmek ve sofra.", fx: { m: 6, h: 3 } },
      { t: "Şehirde kal", m: "Şehirde kaldın.", fx: {} },
    ],
  },
  {
    a: [60, 85],
    t: "Kahvehane",
    d: "Mahalledeki arkadaşların tavla oynamaya çağırıyor.",
    c: [
      { t: "Git", m: "Çaylar eşliğinde tavla oynadın.", fx: { m: 6 } },
      { t: "Evde dinlen", m: "Evde sakin bir gün geçirdin.", fx: { h: 1 } },
    ],
  },
  {
    a: [50, 85],
    t: "Doktor kontrolü",
    d: "Yıllık kontrol zamanı geldi.",
    c: [
      { t: "Kontrole git", m: "Her şey yolunda gitti.", fx: { h: 5, p: -4000 } },
      { t: "Ertele", m: "Kontrolü erteledin.", fx: { h: -4 } },
    ],
  },
  {
    a: [6, 80],
    t: "Sürpriz hediye",
    d: "Kapıda senin adına bir paket var.",
    c: [{ t: "Aç", m: "Çok güzel bir hediyeymiş.", fx: { m: 6 } }],
  },
  {
    a: [20, 70],
    t: "Komşu şikayet etti",
    d: "Üst kat gece gürültüden şikayet ediyor.",
    c: [
      { t: "Özür dile", m: "Konuyu tatlıya bağladın.", fx: { m: -1, z: 1 } },
      { t: "Aldırma", m: "Umursamadın ama gerginlik arttı.", fx: { m: -2 } },
    ],
  },
);
