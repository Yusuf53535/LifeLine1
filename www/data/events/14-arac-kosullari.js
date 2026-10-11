// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
["Arabada sorun", "Trafik", "Polis çevirmesi"].forEach((t) => {
  const e = EV.find((x) => x.t === t);
  if (e) e.f = hasCar;
});
