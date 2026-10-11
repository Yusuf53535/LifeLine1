// Oyun dengesi: yıllık sınırlar ve sosyal medya büyümesi.
const GAME_BALANCE = {
  mindBodyLimits: { "Kitap oku": 2, "Spor yap": 3, Meditasyon: 2, Yoga: 2, "Dil kursu": 1 },
  relationshipLimits: {
    chat: 3,
    compliment: 2,
    insult: 2,
    gift: 2,
    date: 2,
    love: 1,
    friend: 1,
    study: 2,
    proposal: 1,
    marry: 1,
  },
  living: {
    rent: 0.23,
    marriedRent: 0.29,
    food: 0.17,
    marriedFood: 0.22,
    bills: 0.1,
    marriedBills: 0.13,
    family: 0.2,
    personal: 0.1,
  },
  paidFanAcquisition: 0.15,
  fanChurn: 0.1,
};
function annualActionCounts() {
  if (!S.annualActions || S.annualActions.age !== S.age)
    S.annualActions = { age: S.age, counts: {} };
  return S.annualActions.counts;
}
function annualActionRemaining(key, limit) {
  return Math.max(0, limit - (annualActionCounts()[key] || 0));
}
function useAnnualAction(key, limit) {
  const counts = annualActionCounts();
  if ((counts[key] || 0) >= limit) return false;
  counts[key] = (counts[key] || 0) + 1;
  return true;
}
const doActBeforeAnnualLimits = doAct;
doAct = function (it) {
  if (!S || S.dead) return;
  const limit = GAME_BALANCE.mindBodyLimits[it.t];
  if (limit && ACTS[0].items.some((item) => item.t === it.t)) {
    if (S.age < it.a || S.jail > 0) return doActBeforeAnnualLimits(it);
    if (S.age >= 18 && (it.c || 0) > S.p)
      return modal(it.t, "Yeterli paran yok.", [{ t: "Kapat", p: 1 }]);
    if (!useAnnualAction("mind:" + it.t, limit))
      return modal(it.t, "Bu yılki sınırına ulaştın. Gelecek yıl tekrar yapabilirsin.", [
        { t: "Kapat", p: 1 },
      ]);
    const result = doActBeforeAnnualLimits(it);
    pgDraw();
    return result;
  }
  return doActBeforeAnnualLimits(it);
};
const pgOpenBeforeActivityLimits = pgOpen;
pgOpen = function (builder) {
  return pgOpenBeforeActivityLimits(() => {
    const page = builder();
    if (page.title === "ZİHİN VE BEDEN")
      page.rows = page.rows.map((row) => {
        const limit = GAME_BALANCE.mindBodyLimits[row.t];
        if (!limit) return row;
        const remaining = annualActionRemaining("mind:" + row.t, limit);
        return {
          ...row,
          d: row.d + " · Bu yıl " + remaining + "/" + limit + " hak",
          disabled: !remaining,
        };
      });
    return page;
  });
};
