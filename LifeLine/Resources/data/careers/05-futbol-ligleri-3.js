// Meslek / kariyer tanımları. Alan açıklamaları: data/README.md
// Maaşlar yıllık brüt oyun tutarıdır; oyun ülke ve ekonomi katsayılarını uygular.
FOREIGN_FOOTBALL.forEach(([country, id, first, second, top, lower]) => {
  FOOTBALL_LEAGUES[id + "1"] = { country, tier: 1, name: first, teams: top.split("|") };
  FOOTBALL_LEAGUES[id + "2"] = { country, tier: 2, name: second, teams: lower.split("|") };
});
