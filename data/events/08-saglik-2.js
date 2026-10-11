// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
EV.push({
  a: [3, 100],
  costsMoney: true,
  t: LX("Teşhis", "Diagnosis"),
  f: () => {
    S.dis = S.dis || [];
    return Math.random() < 0.025 + (100 - S.h) / 1200 + Math.max(0, S.age - 35) / 1500 && dpick();
  },
  d: () => {
    S.dp = dpick() || DIS[0];
    return LX("Doktor sana şu teşhisi koydu: ", "The doctor diagnosed you with: ") + S.dp.n + ".";
  },
  c: [
    {
      t: LX("Tedavi ol", "Get treatment"),
      m: LX("Doktorun önerisine uydun.", "You followed the doctor's advice."),
      fx: {},
      run: () => onset(1),
    },
    {
      t: LX("Önemseme", "Ignore it"),
      m: LX("Doktoru dinlemedin.", "You didn't listen to the doctor."),
      fx: { m: -2 },
      run: () => onset(0),
    },
  ],
});
