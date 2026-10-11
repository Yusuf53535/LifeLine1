// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
function yearly() {
  if (!S || S.dead) return;
  const h = H();
  h.peak = Math.max(h.peak, S.p);
  S.dis = S.dis || [];
  if (S.job) {
    const j = rk(S.job);
    j.ry++;
    if (h.jobs.indexOf(j.b0) < 0) h.jobs.push(j.b0);
    /* Automatic promotions are handled by advanceCareerProgress. */
  }
  S.dis = S.dis.filter((x) => {
    const d = dget(x.id);
    if (d.ac) {
      if (x.t || Math.random() < 0.6) {
        line(d.n + LX(" geçti, iyileştin.", " passed; you recovered."), "good");
        return false;
      }
      apply({ h: -d.sev });
      line(d.n + LX(" yüzünden zor bir yıl geçirdin.", " made for a hard year."), "bad");
      return true;
    }
    const k = d.id === "dep" ? "m" : "h",
      dm = x.t ? d.sev : d.sev * 3;
    apply({ [k]: -dm });
    if (x.t) {
      const c = Math.round((d.c * CF()) / 4);
      S.p -= c;
      line(d.n + LX(" tedavi masrafı: -", " treatment costs: -") + TL(c));
    } else
      line(d.n + LX(" ağırlaşıyor. (", " is getting worse. (") + fxTxt({ [k]: -dm }) + ")", "bad");
    if (!S.dead && !x.t && d.sev >= 4 && Math.random() < 0.1)
      die(d.n + LX(" yüzünden hayatını kaybettin.", " took your life."));
    return true;
  });
  if (S.dead) return;
  if (S.age >= 5 && Math.random() < 0.0025)
    return die(
      R([
        LX("Bir trafik kazasında hayatını kaybettin.", "You died in a traffic accident."),
        LX("Beklenmedik bir kazada hayatını kaybettin.", "You died in an unexpected accident."),
        LX("Bir yangında hayatını kaybettin.", "You died in a fire."),
      ]),
    );
  const b = S.biz;
  if (b) bizYear(b);
  render();
  check();
}
