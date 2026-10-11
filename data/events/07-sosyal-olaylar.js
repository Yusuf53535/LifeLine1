// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
EV.push(
  {
    a: [18, 45],
    t: "Yanlış kişiye mesaj",
    d: "Sevgiline yazdığın o fazla samimi mesajı yanlışlıkla iş grubuna attın.",
    c: [
      {
        t: "Hemen sil",
        m: "Silmeden önce yirmi kişi görmüştü. Ertesi gün herkes sana gülümsüyor.",
        fx: { m: -6, g: 1 },
      },
      {
        t: "Şaka olduğunu söyle",
        m: "Kimse inanmadı ama cesaretine hayran kaldılar.",
        w: [0.4, "Ofiste efsane oldun, herkes seni sevdi.", { m: 7 }],
        fx: { m: -4 },
      },
      {
        t: "Telefonu denize at",
        m: "Yeni telefon aldın ama utancın geçmedi.",
        fx: { p: -45000, m: -2 },
      },
    ],
  },
  {
    a: [18, 60],
    t: "Eczanede utanç",
    d: "Eczanede korunma malzemesi alırken sıra sana geldi, arkandaki kişi annenin komşusu.",
    c: [
      {
        t: "Sakin davran",
        m: "Kendinden emin şekilde aldın, komşu bile selam verdi.",
        fx: { m: 3, p: -400 },
      },
      {
        t: "Çikolata da al, kaç",
        m: "Garip bir kombinasyon oldu, eczacı gülmemek için kendini zor tuttu.",
        fx: { m: -2, p: -600 },
      },
      { t: "Başka eczaneye git", m: "Yarım saat yürüdün ama rahatladın.", fx: { h: 1, p: -400 } },
    ],
  },
  {
    a: [18, 40],
    t: "İlk buluşta pantolon",
    d: "Restoranda kalkarken pantolonun arkadan sonuna kadar yırtıldı.",
    c: [
      {
        t: "Montu belinde bağla",
        m: "Montla çıktın, karşındakinin kahkahası bütün restoranı güldürdü.",
        w: [0.45, "Karşındaki bu halini çok sevdi, ikinci buluşma garanti!", { m: 8 }],
        fx: { m: -5 },
      },
      { t: "Gülüp geç", m: "Özgüvenin herkesi etkiledi.", fx: { m: 4, g: 1 } },
    ],
  },
  {
    a: [18, 60],
    t: "Duvardan gelen sesler",
    d: "Alt komşunun gece yarısı sesleri duvardan net şekilde geliyor.",
    c: [
      { t: "Tavanı vur", m: "Sustular, sonra sabaha kadar fısıldaştılar.", fx: { m: -2 } },
      { t: "Kulaklık tak", m: "Playlist'in hiç bu kadar işe yaramamıştı.", fx: { m: 1, z: 1 } },
      {
        t: "Sabah kahve ısmarla",
        m: "Komşuyla göz göze gelince ikiniz de kızardınız.",
        fx: { m: 3, p: -300 },
      },
    ],
  },
  {
    a: [18, 50],
    t: "Mayo kazası",
    d: "Dalgalı denizde atlarken mayon aşağı kaydı.",
    c: [
      {
        t: "Suya gömül",
        m: "Bir saat sudan çıkmadın, parmakların kuruyup buruştu.",
        fx: { m: -4, h: -1 },
      },
      {
        t: "Gülüp çık",
        m: "Plaj alkışladı, kimse seni unutmadı.",
        w: [0.5, "Plajdaki biri senden numara istedi!", { m: 7, g: 1 }],
        fx: { m: -3 },
      },
    ],
  },
  {
    a: [22, 55],
    t: "Eski sevgilinin düğünü",
    d: "Eski sevgilin düğün davetiyesi gönderdi, 'artı bir' yazıyor.",
    c: [
      {
        t: "Yalnız git",
        m: "Bütün akrabalar sana acıyarak baktı, sofraya iki kez gittin.",
        fx: { m: -3 },
      },
      {
        t: "Yakışıklı/güzel birini bul",
        m: "Bir arkadaşını ikna ettin, düğünün konuşulan çifti siz oldunuz.",
        w: [0.5, "Gecenin sonunda arkadaşınla gerçekten tanışmış gibi oldunuz.", { m: 9, g: 1 }],
        fx: { m: 2, p: -5000 },
      },
      { t: "Gitme", m: "Gül bahçesinde kedi yavrusu gibi sakin kaldın.", fx: { m: 1 } },
    ],
  },
  {
    a: [20, 55],
    t: "Ofis aşkı",
    d: "Yan masadaki iş arkadaşı sana göz kırptı, kahve molası teklif etti.",
    f: () => S.job && !S.partner,
    c: [
      {
        t: "Kahveye git",
        m: "Kahve uzadı, herkes ne olduğunu anladı.",
        w: [0.5, "Gerçekten çok iyi vakit geçirdiniz, çıkmaya başladınız.", { m: 9 }],
        fx: { m: 2 },
        run: () => {
          if (Math.random() < 0.4) newP();
        },
      },
      { t: "Profesyonel kal", m: "Mesafeli davrandın, ofiste her şey normal.", fx: { z: 1 } },
      { t: "İK'ya söyle", m: "İK dosyayı açtı, ortam gerildi.", fx: { m: -4 } },
    ],
  },
  {
    a: [22, 50],
    t: "Bekarlığa veda",
    d: "En yakın arkadaşının bekarlığa veda partisi Bodrum'da.",
    c: [
      {
        t: "Sonuna kadar eğlen",
        m: "Sabaha kadar eğlendin, telefonda anlamadığın fotoğraflar var.",
        fx: { m: 10, h: -5, p: -30000 },
        run: () => {
          if (S.partner && Math.random() < 0.5) {
            S.partner.b = cl(S.partner.b - 12);
            line(S.partner.n + " bir fotoğrafı fark etti, ilişkiniz sarsıldı.", "bad");
          }
        },
      },
      {
        t: "Makul davran",
        m: "Erken yattın, sabah herkesten önce kalkıp kahvaltı hazırladın.",
        fx: { m: 4, h: 1 },
      },
    ],
  },
  {
    a: [18, 50],
    t: "Spor salonunda flört",
    d: "Spor salonunda biri sana ekipmanı gösterme bahanesiyle çok yaklaşıyor.",
    c: [
      {
        t: "Flört et",
        m: "İkiniz de aynı aleti dakikalarca kullanmaya çalıştınız.",
        w: [
          () => 0.25 + S.g / 220,
          "Telefon numaranı verdi, şimdi mesajlaşıyorsunuz.",
          { m: 8, g: 1 },
        ],
        fx: { m: -2 },
      },
      { t: "Kulaklıkla kaç", m: "Müzik sesini açıp antrenmanına döndün.", fx: { h: 3 } },
    ],
  },
  {
    a: [20, 60],
    t: "Sunumda yanlış dosya",
    d: "Toplantıda ekranı yansıtırken bilgisayardaki gündelik fotoğrafların açıldı.",
    f: () => S.job,
    c: [
      {
        t: "Çabuk kapat",
        m: "Üç saniye sürdü ama herkes gördü.",
        fx: { m: -6 },
        run: () => {
          S.perf = cl(S.perf - 6);
        },
      },
      {
        t: "Mizah yap",
        m: "Salon kahkahaya boğuldu, ortamı kurtardın.",
        w: [0.5, "Müdür bile güldü, ekibin gözdesi oldun.", { m: 8 }],
        fx: { m: -3 },
        run: () => {
          S.perf = cl(S.perf + 3);
        },
      },
    ],
  },
  {
    a: [18, 45],
    t: "Gece kulübü",
    d: "Kulüpte DJ seni sahneye çağırdı, herkes seni izliyor.",
    c: [
      {
        t: "Çık ve dans et",
        m: "Dans ettin ama ayağın takılıp düştün.",
        w: [
          0.45,
          "Salon seni alkışladı, bir sürü kişi seninle fotoğraf çektirdi.",
          { m: 11, g: 1 },
        ],
        fx: { m: -5, h: -2 },
      },
      { t: "Hayır de", m: "Barda içeceğini yudumlayıp izledin.", fx: { m: 1, p: -1500 } },
    ],
  },
  {
    a: [22, 80],
    t: "Romantik akşam",
    d: "Evde mum ışığında akşam yemeği hazırladın.",
    f: () => S.partner,
    c: [
      {
        t: "Her şeyi ayarla",
        m: "Mumlar, müzik ve şarap... Gece uzun sürdü, sabah ikiniz de gülümsüyordunuz.",
        fx: { m: 10, p: -6000 },
        run: bd(10),
      },
      {
        t: "Sipariş ver",
        m: "Paket servisle de olur dediniz, film izlediniz.",
        fx: { m: 4, p: -1500 },
        run: bd(3),
      },
    ],
  },
  {
    a: [22, 70],
    t: "Banyoda şarkı",
    d: "Banyoda bağıra bağıra şarkı söylerken kapı açıldı.",
    f: () => S.partner || S.married,
    c: [
      {
        t: "Perdeyi çek",
        m: "Perdenin arkasından hâlâ şarkı söylemeye devam ettin.",
        fx: { m: 2 },
      },
      {
        t: "Birlikte söyle",
        m: "İkiniz de düet yaptınız, komşular alkışladı.",
        fx: { m: 6 },
        run: bd(6),
      },
    ],
  },
  {
    a: [18, 50],
    t: "Kamp çadırı",
    d: "Arkadaşlarla kampa gittiniz, çadır duvarı kağıt gibi ince.",
    c: [
      {
        t: "Kulaklık tak",
        m: "Gece boyu yan çadırdan duyduklarınla uyumaya çalıştın.",
        fx: { m: -2, h: -2 },
      },
      { t: "Sabah dalga geç", m: "Sabah herkes birbirine kıskıs güldü.", fx: { m: 5 } },
    ],
  },
  {
    a: [20, 45],
    t: "Randevuda eski öğretmen",
    d: "Tanıştığın kişi, çocukken sana ders veren öğretmenin çıktı.",
    f: () => !S.partner,
    c: [
      {
        t: "Muhabbet et",
        m: "Bir saat eski günlerden konuştunuz, çok eğlendiniz.",
        w: [0.25, "Sohbet çok güzeldi, çıkmaya başladınız.", { m: 8 }],
        fx: { m: 3 },
        run: () => {
          if (Math.random() < 0.25) newP();
        },
      },
      {
        t: "Çekil, kaç",
        m: "Mazeret uydurdun, ertesi gün utançla mesajlarına cevap vermedin.",
        fx: { m: -3 },
      },
    ],
  },
  {
    a: [18, 40],
    t: "Saç boyası kazası",
    d: "Evde saçını boyadın, çıkan renk beklediğinden çok farklı.",
    c: [
      {
        t: "Kuaföre koş",
        m: "Kuaför şaşkınlıkla baktı, düzeltmek için epey para harcadın.",
        fx: { p: -4000, g: 2, m: -2 },
      },
      {
        t: "Tarzın bu de",
        m: "Herkes sana sordu, bir sürü iltifat aldın.",
        w: [0.5, "Yeni tarzın sevildi, görünüşün parladı.", { g: 4, m: 6 }],
        fx: { g: -4, m: -3 },
      },
    ],
  },
  {
    a: [22, 70],
    t: "Gizli mesajlar",
    d: "Sevgilin banyodayken telefonuna bir bildirim geldi.",
    f: () => S.partner,
    c: [
      {
        t: "Bak",
        m: "Meğer sana sürpriz parti hazırlıyormuş, hiç iyi hissetmedin.",
        w: [0.3, "Başka birine yazdığı flört mesajlarını buldun!", { m: -9 }],
        fx: { m: -3 },
        run: bd(-8),
      },
      { t: "Dokunma", m: "Merakını bastırdın, güven duygusu arttı.", fx: { m: 2 }, run: bd(4) },
    ],
  },
  {
    a: [20, 60],
    t: "Kör randevu",
    d: "Arkadaşların seni kör randevuya ayarladı, buluşma yerinde sadece iki tabak var.",
    f: () => !S.partner,
    c: [
      {
        t: "Git",
        m: "Karşındaki 40 dakika boyunca eski sevgilisinden bahsetti.",
        w: [() => 0.3 + S.g / 250, "Karşındaki muhteşemdi, çıkmaya başladınız.", { m: 10 }],
        fx: { m: -3, p: -3000 },
        run: () => {
          if (Math.random() < 0.3) newP();
        },
      },
      { t: "Bahane uydur", m: "Arkadaşların seni uzun süre sorguladı.", fx: { m: -1 } },
    ],
  },
  {
    a: [25, 60],
    t: "Sihirli blender",
    d: "Reklamda gördüğün 'her şeyi çözer' diyen blenderi aldın, kullanma kılavuzu çok garip.",
    c: [
      {
        t: "Kılavuzu oku",
        m: "Kılavuzdaki cümleler yüzünden güldün, en azından smoothie güzel çıktı.",
        fx: { m: 3, h: 1, p: -8000 },
      },
      { t: "Kullanmadan kaldır", m: "Dolabın dibinde yerini aldı.", fx: { p: -8000, m: -1 } },
    ],
  },
);
