// Meslek / kariyer tanımları. Alan açıklamaları: data/README.md
// Maaşlar yıllık brüt oyun tutarıdır; oyun ülke ve ekonomi katsayılarını uygular.
function milit() {
  if (S.age < 18 || S.age > 40 || S.uni)
    return modal("Askerlik", "18-40 yaş arası ve öğrenci olmayan kişiler katılabilir.", OK);
  modal("Askerlik", "Orduya katıl, düzenli maaş al.", [
    {
      t: "Orduya katıl",
      sub: "Yıllık " + TL(400000 * wm()) + " · Sağlık ve görünüm artar",
      f: () => {
        if (!canStartCareer()) return;
        S.job = { n: "Asker", s: Math.round(400000 * wm()), mil: 1 };
        S.perf = 50;
        apply({ h: 4, g: 2, m: -3 });
        line("Orduya katıldın.", "gold");
        render();
      },
    },
    ...OK,
  ]);
}
