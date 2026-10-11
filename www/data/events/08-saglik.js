// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
const DIS = [
  ["zat", LX("Zatürre", "Pneumonia"), 3, 8, 15000, 1],
  ["dia", LX("Diyabet", "Diabetes"), 30, 2, 20000],
  ["tan", LX("Yüksek tansiyon", "High blood pressure"), 40, 2, 12000],
  ["kalp", LX("Kalp hastalığı", "Heart disease"), 45, 4, 60000],
  ["kan", LX("Kanser", "Cancer"), 30, 5, 250000],
  ["dep", LX("Depresyon", "Depression"), 14, 2, 8000],
].map(([id, n, a, sev, c, ac]) => ({ id, n, a, sev, c, ac }));
