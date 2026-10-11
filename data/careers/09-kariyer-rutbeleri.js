// Meslek / kariyer tanımları. Alan açıklamaları: data/README.md
// Maaşlar yıllık brüt oyun tutarıdır; oyun ülke ve ekonomi katsayılarını uygular.
function careerLadder(job) {
  const base = job.career ? job.career.base : job.b0 || job.n;
  if (job.mil || base === "Subay")
    return base === "Subay"
      ? [
          "Teğmen",
          "Üsteğmen",
          "Yüzbaşı",
          "Binbaşı",
          "Yarbay",
          "Albay",
          "Tuğgeneral",
          "Tümgeneral",
          "Korgeneral",
          "Orgeneral",
        ]
      : [
          "Er",
          "Onbaşı",
          "Çavuş",
          "Uzman Çavuş",
          "Astsubay Çavuş",
          "Astsubay Kıdemli Çavuş",
          "Astsubay Başçavuş",
        ];
  if (base === "Bankacı")
    return [
      "Bankacı",
      "Kıdemli Bankacı",
      "Bankacılık Uzmanı",
      "Şube Müdür Yardımcısı",
      "Şube Müdürü",
      "Bölge Müdürü",
    ];
  return [
    base,
    "Kıdemli " + base,
    "Uzman " + base,
    "Takım Lideri · " + base,
    "Birim Yöneticisi · " + base,
    "Bölüm Yöneticisi · " + base,
  ];
}
