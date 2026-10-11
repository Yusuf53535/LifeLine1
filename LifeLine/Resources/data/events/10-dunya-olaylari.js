// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
const W = (t) => H().wev.push(t),
  gm = LX("Dünya olayı seni de etkiledi.", "The world event affected you too.");
[
  [
    "Küresel ekonomik kriz",
    "Global financial crisis",
    "Dünya borsaları çöktü, şirketler işten çıkarma yapıyor.",
    "World markets crashed and companies are laying people off.",
    () => {
      mkt(0.7);
      if (S.job && !S.job.mil && Math.random() < 0.25) {
        S.job = null;
        line(LX("Krizde işten çıkarıldın.", "You were laid off in the crisis."), "bad");
      }
    },
    "Tasarruf yap",
    "Save money",
    { m: -4 },
    "Fırsat kolla",
    "Look for opportunities",
    { m: -2, p: -20000 },
  ],
  [
    "Pandemi",
    "Pandemic",
    "Bir salgın tüm dünyayı etkisi altına aldı.",
    "An outbreak spread across the whole world.",
    () => mkt(0.85),
    "Evde kal",
    "Stay home",
    { m: -6, h: 1 },
    "Hayatına devam et",
    "Carry on as usual",
    { h: -8 },
  ],
  [
    "Büyük deprem",
    "Major earthquake",
    "Yakın bir bölgede büyük bir deprem oldu.",
    "A major earthquake struck a nearby region.",
    () => {},
    "Yardım et",
    "Help out",
    { m: 3, p: -20000, h: -2 },
    "Güvenli yere git",
    "Move to safety",
    { m: -4 },
  ],
  [
    "Teknoloji patlaması",
    "Tech boom",
    "Yeni bir teknoloji dalgası piyasaları coşturdu.",
    "A new wave of technology sent markets soaring.",
    () => mkt(1.35),
    "Fırsatı değerlendir",
    "Seize the chance",
    { p: 30000, m: 6 },
    "Seyret",
    "Just watch",
    { m: 2 },
  ],
  [
    "Dünya Kupası",
    "World Cup",
    "Bütün dünya turnuvayı konuşuyor.",
    "The whole world is talking about the tournament.",
    () => {},
    "Kahvede maça git",
    "Watch at a cafe",
    { m: 9, p: -5000 },
    "Evde izle",
    "Watch at home",
    { m: 5 },
  ],
  [
    "Enflasyon dalgası",
    "Inflation wave",
    "Fiyatlar hızla yükseliyor, para eriyor.",
    "Prices are soaring and money is melting away.",
    () => {
      if (S.p > 0) S.p = Math.round(S.p * 0.95);
    },
    "Altın al",
    "Buy gold",
    { m: -2, p: -10000 },
    "Harcamaları kıs",
    "Cut spending",
    { m: -5 },
  ],
].forEach(([tt, te, dt, de, run, a, ae, fa, b, be, fb]) =>
  EV.push({
    a: [18, 100],
    worldEvent: true,
    t: LX(tt, te),
    d: LX(dt, de),
    f: () => Math.random() < 0.06,
    c: [
      {
        t: LX(a, ae),
        m: gm,
        fx: fa,
        run: () => {
          W(tt);
          run();
        },
      },
      {
        t: LX(b, be),
        m: gm,
        fx: fb,
        run: () => {
          W(tt);
          run();
        },
      },
    ],
  }),
);
