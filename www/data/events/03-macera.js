// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
EV.push(
  {
    a: [16, 55],
    t: "Dağ tırmanışı",
    d: "Arkadaşların hafta sonu zirveye tırmanmayı öneriyor.",
    f: mc,
    c: [
      {
        t: "Katıl",
        m: "Yorucu bir tırmanıştı.",
        w: [0.7, "Zirveye çıktın, manzara harikaydı!", { m: 10, h: 3 }],
        fx: { h: -8, m: -2 },
      },
      { t: "Evde kal", m: "Kanepede kaldın.", fx: {} },
    ],
  },
  {
    a: [18, 60],
    t: "Ada tatili",
    d: "Yelkenliyle Ege adalarını gezme fırsatı çıktı.",
    f: mc,
    c: [
      { t: "Git", m: "Denizde unutulmaz bir hafta geçirdin.", fx: { m: 12, g: 2, p: -120000 } },
      { t: "Vazgeç", m: "Tatili iptal ettin.", fx: { m: -2 } },
    ],
  },
  {
    a: [10, 70],
    t: "Hazine haritası",
    d: "Eski bir kitabın arasından yıpranmış bir harita çıktı.",
    f: mc,
    c: [
      {
        t: "Hazineyi ara",
        m: "Hiçbir şey bulamadın, ayakkabıların çamur oldu.",
        w: [0.2, "Eski bir sandık buldun, içinden altınlar çıktı!", { p: 1000000, m: 15 }],
        fx: { m: -3 },
      },
      { t: "Müzeye ver", m: "Müze seni ödüllendirdi.", fx: { m: 5, z: 2 } },
    ],
  },
  {
    a: [14, 50],
    t: "Mağara keşfi",
    d: "Köyün yakınında yeni bir mağara bulundu.",
    f: mc,
    c: [
      {
        t: "İçeri gir",
        m: "Karanlıkta düştün.",
        w: [0.6, "Mağarada gizli bir göl buldun!", { m: 9, z: 2 }],
        fx: { h: -9 },
      },
      { t: "Dışarıdan bak", m: "Fotoğraf çekip döndün.", fx: { m: 2 } },
    ],
  },
  {
    a: [16, 65],
    t: "Kamp macerası",
    d: "Orman kenarında kamp kurmak ister misin?",
    f: mc,
    c: [
      { t: "Kamp kur", m: "Yıldızların altında uyudun.", fx: { m: 9, h: 3 } },
      { t: "Otelde kal", m: "Konforlu bir hafta sonu geçirdin.", fx: { m: 3, p: -8000 } },
    ],
  },
  {
    a: [18, 55],
    t: "Dalış kursu",
    d: "Sahilde bir dalış kursu açıldı.",
    f: mc,
    c: [
      { t: "Kursa yazıl", m: "Sualtı dünyası seni büyüledi.", fx: { m: 8, h: 2, p: -30000 } },
      { t: "Geç", m: "Dalışı atladın.", fx: {} },
    ],
  },
);
