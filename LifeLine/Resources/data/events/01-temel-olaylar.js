// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
const EV = [
  {
    a: [6, 17],
    t: "Okulda kavga",
    d: "Teneffüste biri seninle dalga geçiyor.",
    c: [
      { t: "Karşılık ver", m: "Kavga çıktı, müdür odasına gittin.", fx: { m: -8, h: -6 } },
      { t: "Görmezden gel", m: "Gülüp geçtin, olay kapandı.", fx: { m: 3 } },
      { t: "Öğretmene söyle", m: "Öğretmen konuyu çözdü.", fx: { m: 5, z: 2 } },
    ],
  },
  {
    a: [7, 17],
    t: "Sınav haftası",
    d: "Yarın büyük bir sınav var.",
    c: [
      { t: "Sabaha kadar çalış", m: "Sınavdan yüksek not aldın.", fx: { z: 6, h: -4, m: -2 } },
      { t: "Kopya çek", m: "Yakalandın, sıfır aldın.", fx: { m: -8, z: -2 } },
      { t: "Maça git", m: "Sınav kötü geçti ama maç harikaydı.", fx: { m: 7, z: -3 } },
    ],
  },
  {
    a: [8, 18],
    t: "Yeni arkadaş",
    d: "Sınıfa yeni bir çocuk geldi, yanına oturmak istiyor.",
    c: [
      { t: "Yanına otur", m: "İyi arkadaş oldunuz.", fx: { m: 8 } },
      { t: "Hayır de", m: "Sırada tek kaldın.", fx: { m: -3 } },
    ],
  },
  {
    a: [12, 17],
    t: "Sivilce krizi",
    d: "Aynaya baktın, yüzünde koca bir sivilce var.",
    c: [
      { t: "Krem sür", m: "Biraz düzeldi.", fx: { g: 3, p: -1500 } },
      { t: "Sıkıştır", m: "İz kaldı.", fx: { g: -5, m: -3 } },
    ],
  },
  {
    a: [14, 40],
    t: "Aşk",
    d: "Biri sana mesaj attı: 'Kahve içelim mi?'",
    c: [
      { t: "Tamam de", m: "Güzel bir akşam geçirdin, kalbin hızlandı.", fx: { m: 10 } },
      { t: "Reddet", m: "Mesajı görmezden geldin.", fx: { m: -2 } },
    ],
  },
  {
    a: [16, 60],
    t: "Sokakta bir cüzdan",
    d: "Yerde içi dolu bir cüzdan buldun.",
    c: [
      { t: "Sahibine ver", m: "Sahibi çok sevindi, sana teşekkür etti.", fx: { m: 8 } },
      { t: "Parayı al", m: "Vicdan azabı çektin ama paran arttı.", fx: { p: 20000, m: -6 } },
    ],
  },
  {
    a: [18, 18],
    t: "Üniversite zamanı",
    d: "Üniversite sınavı zamanı geldi. Sınava girip üniversiteye yerleşmek ister misin? (4 yıl, para kazanamazsın)",
    c: [
      { t: "Sınava gir", m: "Sınava girmeye karar verdin.", fx: {}, run: () => yksExam() },
      { t: "Çalışmaya başla", m: "Okumamaya karar verdin.", fx: {} },
    ],
  },
  {
    a: [18, 50],
    t: "Arkadaşlar tatile çağırıyor",
    d: "Ege'de bir hafta. Paraya ihtiyacın var.",
    c: [
      { t: "Git", m: "Muhteşem bir tatil oldu.", fx: { m: 14, p: -150000, h: 3 } },
      { t: "Evde kal", m: "Para biriktirdin ama canın sıkıldı.", fx: { m: -4 } },
    ],
  },
  {
    a: [20, 65],
    t: "Arabada sorun",
    d: "Aracın yolda kaldı.",
    c: [
      { t: "Tamir ettir", m: "Usta işi hallettin.", fx: { p: -25000 } },
      { t: "Kendin yap", m: "Videodan izleyip hallettin.", fx: { z: 3, h: -2 } },
    ],
  },
  {
    a: [22, 60],
    t: "Kripto fırsatı",
    d: "Bir arkadaş 'kesin kazandırır' diyor.",
    c: [
      { t: "50.000 ₺ yatır", m: "Piyasa çöktü, paran gitti.", fx: { p: -50000, m: -6 } },
      { t: "Yatırma", m: "Aklın başında davrandın.", fx: { z: 1 } },
    ],
  },
  {
    a: [30, 70],
    t: "Boğaz'da yürüyüş",
    d: "Hava çok güzel, çayın yanında simit var.",
    c: [{ t: "Keyfini çıkar", m: "Gününü güzelleştirdi.", fx: { m: 6, h: 2 } }],
  },
  {
    a: [35, 80],
    t: "Göğsünde ağrı",
    d: "Merdiven çıkarken nefesin kesildi.",
    c: [
      { t: "Doktora git", m: "Erken fark ettin, tedavi başladı.", fx: { h: 4, p: -15000 } },
      { t: "Önemseme", m: "Durumun kötüleşti.", fx: { h: -15 } },
    ],
  },
  {
    a: [45, 80],
    t: "Aile yemeği",
    d: "Bayramda tüm akrabalar toplandı.",
    c: [
      { t: "Hepsiyle ilgilen", m: "Ailenle güzel vakit geçirdin.", fx: { m: 9 } },
      { t: "Erken ayrıl", m: "Yorgunluktan eve döndün.", fx: { m: -2, h: 2 } },
    ],
  },
];
