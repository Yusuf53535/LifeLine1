// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
EV.push(
  {
    a: [20, 60],
    t: "Çocuğunun doğum günü",
    d: "Çocuğunun doğum günü yaklaşıyor.",
    f: () => kidsU().length > 0,
    c: [
      {
        t: "Büyük parti ver",
        m: "Çocuklar çok eğlendi.",
        fx: { m: 8, p: -25000 },
        run: () => kidsU().forEach((k) => (k.b = cl(k.b + 10))),
      },
      {
        t: "Evde pasta kes",
        m: "Sakin ve sıcak bir kutlama oldu.",
        fx: { m: 4 },
        run: () => kidsU().forEach((k) => (k.b = cl(k.b + 5))),
      },
    ],
  },
  {
    a: [20, 60],
    t: "Çocuğun hastalandı",
    d: "Çocuğun ateşlendi, halsiz.",
    f: () => kidsU().length > 0,
    c: [
      {
        t: "Hastaneye götür",
        m: "Doktor kontrol etti, geçti.",
        fx: { p: -12000, m: 1 },
        run: () => kidsU().forEach((k) => (k.b = cl(k.b + 6))),
      },
      { t: "Evde bak", m: "Bir iki gün uykusuz kaldın.", fx: { h: -2, m: -1 } },
    ],
  },
);
