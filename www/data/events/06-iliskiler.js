// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
const mkAsk = () => {
  const pf = pickG(),
    n = FN(pf).split(" ")[0];
  S.ask = { n, f: pf };
  return n;
};
const askEv = {
  a: [14, 60],
  t: "Çıkma teklifi",
  f: () => !S.partner,
  d: () => mkAsk() + " sana çıkma teklif etti.",
  c: [
    {
      t: "Kabul et",
      m: "Teklifi kabul ettin, çıkmaya başladınız.",
      fx: { m: 8 },
      run: () => {
        S.partner = { n: S.ask.n, b: rnd(45, 65), f: S.ask.f };
      },
    },
    { t: "Reddet", m: "Nazikçe reddettin.", fx: { m: -1 } },
  ],
};
const propEv = {
  a: [20, 70],
  t: "Evlenme teklifi",
  f: () => S.partner && !S.married && S.partner.b >= 65,
  d: () => S.partner.n + " diz çöküp sana evlenme teklif etti!",
  c: [
    {
      t: "Evet de",
      m: "Evet dedin! Evlendiniz.",
      fx: { m: 14, p: -150000 },
      run: () => {
        S.married = true;
        S.partner.b = cl(S.partner.b + 15);
      },
    },
    {
      t: "Hayır de",
      m: "Teklifi reddettin, ilişkiniz zedelendi.",
      fx: { m: -6 },
      run: () => {
        S.partner.b = cl(S.partner.b - 25);
      },
    },
    {
      t: "Biraz zaman iste",
      m: "Cevap vermek için zaman istedin.",
      fx: { m: -1 },
      run: () => {
        S.partner.b = cl(S.partner.b - 5);
      },
    },
  ],
};
EV.push(askEv, askEv, propEv, propEv, propEv);
function cheatP() {
  const P = S.partner;
  if (!P || S.age < 18) return 0;
  P.tr = P.tr || R(TRAITS);
  const k =
    P.tr === "Sadık"
      ? 0.2
      : P.tr === "Flörtöz"
        ? 2.2
        : P.tr === "Maceracı"
          ? 1.5
          : P.tr === "Kıskanç"
            ? 0.8
            : 1;
  return (S.married ? 0.05 : 0.06) * k * (1.5 - P.b / 100);
}
function cheatEv() {
  const P = S.partner;
  const end = () => {
    const was = S.married;
    S.partner = null;
    S.married = false;
    if (was && S.p > 0) {
      const loss = Math.round(S.p * 0.25);
      S.p -= loss;
      line("Boşanma sürecinde mal varlığının bir kısmını kaybettin. (-" + TL(loss) + ")", "bad");
    }
  };
  return {
    t: "Aldatıldın",
    d: P.n + " seni aldatıyormuş. Mesajlarını buldun.",
    c: [
      {
        t: "Yüzleş",
        m: "Yüzleştin, büyük bir kavga çıktı.",
        fx: { m: -6 },
        run: () => {
          P.b = cl(P.b - 18);
          if (P.b <= 10) {
            line(P.n + " ilişkiyi bitirdi.", "bad");
            end();
          }
        },
      },
      {
        t: "Affet",
        m: "Affetmeyi seçtin ama içinde bir şey kırıldı.",
        fx: { m: -4 },
        run: () => {
          P.b = cl(P.b - 8);
        },
      },
      {
        t: S.married ? "Boşan" : "İlişkiyi bitir",
        m: "İlişkiyi bitirdin.",
        fx: { m: -8 },
        run: end,
      },
    ],
  };
}
