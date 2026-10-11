// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
const jobOk = () => S.job && !S.job.mil;
EV.push(
  {
    a: [21, 62],
    t: L8("Başka şirketten teklif", "Offer from another company"),
    f: () => jobOk() && !S.job.part && S.perf >= 60,
    d: L8(
      "Bir işe alım uzmanı seni aradı: rakip bir şirket daha yüksek maaş öneriyor.",
      "A recruiter called: a rival company offers you a higher salary.",
    ),
    c: [
      {
        t: L8("Teklifi kabul et", "Accept the offer"),
        m: L8("Yeni şirkete geçtin, maaşın arttı.", "You moved to the new company with a raise."),
        fx: { m: 5 },
        run: () => {
          S.job.s = Math.round((S.job.s * rnd(115, 130)) / 100);
          S.perf = 50;
          S.cw = [];
          S.cwJob = null;
        },
      },
      {
        t: L8("Patronuna söyle", "Tell your boss"),
        m: L8("Patronunla durumu konuştun.", "You talked it over with your boss."),
        fx: {},
        run: () => {
          if (Math.random() < 0.5) {
            S.job.s = Math.round(S.job.s * 1.12);
            line(
              L8(
                "Patron seni tutmak için maaşını artırdı!",
                "Your boss raised your pay to keep you!",
              ),
              "gold",
            );
          } else
            line(
              L8("Patron seni tutmak için bir şey yapmadı.", "Your boss did nothing to keep you."),
              "bad",
            );
        },
      },
      {
        t: L8("Reddet", "Decline"),
        m: L8("Şirketine sadık kaldın.", "You stayed loyal to your company."),
        fx: { m: 1 },
        run: () => {
          S.perf = cl(S.perf + 3);
        },
      },
    ],
  },
  {
    a: [20, 62],
    t: L8("Hafta sonu mesaisi", "Weekend shift"),
    f: jobOk,
    d: L8(
      "Müdür acil bir iş için hafta sonu çalışmanı istiyor.",
      "Your manager wants you to work this weekend for an urgent job.",
    ),
    c: [
      {
        t: L8("Çalış", "Work"),
        m: L8("Hafta sonunu işe verdin.", "You gave up your weekend."),
        fx: { m: -4, h: -2 },
        run: () => {
          const b = Math.round(S.job.s / 12);
          S.p += b;
          S.perf = cl(S.perf + 8);
          line(L8("Mesai ücreti: +", "Overtime pay: +") + TL(b), "gold");
        },
      },
      {
        t: L8("Reddet", "Decline"),
        m: L8("Hafta sonunu kendine ayırdın.", "You kept your weekend."),
        fx: { m: 3 },
        run: () => {
          S.perf = cl(S.perf - 4);
        },
      },
    ],
  },
  {
    a: [22, 62],
    t: L8("Sunum fırsatı", "Presentation chance"),
    f: () => jobOk() && !S.job.part,
    d: L8(
      "Üst yönetime bir sunum yapma fırsatın var.",
      "You have a chance to present to senior management.",
    ),
    c: [
      {
        t: L8("Sunumu sen yap", "Present it yourself"),
        m: L8("Sunuma hazırlandın.", "You prepared for the presentation."),
        fx: {},
        run: () => {
          if (Math.random() < 0.35 + S.z / 200) {
            S.perf = cl(S.perf + 10);
            apply({ m: 6 });
            line(
              L8(
                "Sunumun çok beğenildi! (+10% performans, +6 mutluluk)",
                "Your presentation was a hit! (+10% performance, +6 happiness)",
              ),
              "gold",
            );
          } else {
            S.perf = cl(S.perf - 6);
            apply({ m: -4 });
            line(
              L8(
                "Sunum kötü geçti. (-6% performans, -4 mutluluk)",
                "The presentation went badly. (-6% performance, -4 happiness)",
              ),
              "bad",
            );
          }
        },
      },
      {
        t: L8("Başkasına bırak", "Hand it off"),
        m: L8("Fırsatı başkasına devrettin.", "You passed the opportunity on."),
        fx: { m: -1 },
      },
    ],
  },
);
