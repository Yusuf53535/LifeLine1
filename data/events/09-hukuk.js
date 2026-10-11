// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
EV.push(
  {
    a: [18, 80],
    t: LX("Polis çevirmesi", "Police checkpoint"),
    f: () => S.assets.some((n) => /araba|Araba|Sedan/.test(n)),
    d: LX(
      "Polis aracını durdurdu, hız yaptığını söylüyor.",
      "A police officer pulled you over for speeding.",
    ),
    c: [
      {
        t: LX("Cezayı öde", "Pay the fine"),
        m: LX("Ceza makbuzunu aldın.", "You took the fine receipt."),
        fx: { p: -8000, m: -1 },
      },
      {
        t: LX("Rüşvet teklif et", "Offer a bribe"),
        m: LX("Polise rüşvet teklif ettin.", "You offered the officer a bribe."),
        fx: {},
        run: () => {
          if (Math.random() < 0.5)
            line(
              LX(
                "Polis gözünü yumdu, yoluna devam ettin.",
                "The officer looked away and you drove on.",
              ),
              "gold",
            );
          else
            jailTerm(
              1,
              LX(
                "Rüşvet vermeye çalışırken yakalandın",
                "You were caught trying to bribe an officer",
              ),
            );
        },
      },
      {
        t: LX("Polisle tartış", "Argue with the officer"),
        m: LX(
          "Tartışma uzadı, ceza iki katına çıktı.",
          "The argument dragged on and the fine doubled.",
        ),
        fx: { p: -16000, m: -3 },
      },
    ],
  },
  {
    a: [22, 70],
    t: LX("Mahkeme celbi", "Court summons"),
    d: LX("Biri seni haksız yere dava etti.", "Someone sued you unfairly."),
    c: [
      {
        t: LX("Avukat tut", "Hire a lawyer"),
        m: LX("Avukatın davayı takip etti.", "Your lawyer handled the case."),
        w: [0.7, LX("Davayı kazandın!", "You won the case!"), { p: -120000, m: 5 }],
        fx: { p: -250000, m: -4 },
      },
      {
        t: LX("Uzlaş", "Settle"),
        m: LX("Karşı tarafla anlaştın.", "You settled with the other side."),
        fx: { p: -70000, m: -2 },
      },
      {
        t: LX("Aldırma", "Ignore it"),
        m: LX(
          "Duruşmaya gitmedin, mahkeme aleyhine karar verdi.",
          "You skipped the hearing and the court ruled against you.",
        ),
        fx: { p: -400000, m: -6 },
      },
    ],
  },
);
