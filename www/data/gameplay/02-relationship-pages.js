// İlişkiler: kişi kartı ve yıllık sınırları olan eylemler.
function relationshipAge(person, fallback) {
  if (Number.isFinite(person.pa)) return person.pa;
  if (Number.isFinite(person.age)) return person.age;
  const source = [...(S.people || []), ...(S.cls || []), ...(S.cw || [])].find(
    (p) => p.id === person.from,
  );
  return source && Number.isFinite(source.pa)
    ? source.pa
    : fallback && Number.isFinite(fallback.pa)
      ? fallback.pa
      : S.age;
}
function relationshipFamily(person) {
  return /Anne|Baba|kardeş|Oğul|Kız|Yeğen|Kuzen|Dede|Nine|Büyükanne|Büyükbaba|Amca|Teyze|Hala|Dayı/i.test(
    person.role || "",
  );
}
function requestRelationshipMoney(person) {
  if (S.relationshipMoneyYear === S.age)
    return modal(
      "Para iste",
      "Bu yıl zaten maddi yardım istedin. Gelecek yıl tekrar deneyebilirsin.",
      [{ t: "Kapat", p: 1 }],
    );
  S.relationshipMoneyYear = S.age;
  if (person.b >= 50 && Math.random() < person.b / 180) {
    const parent = person.role === "Anne" || person.role === "Baba",
      amount = Math.round(rnd(parent ? 300 : 150, parent ? 1500 : 500) * Math.min(2, wm()));
    S.p += amount;
    person.b = cl(person.b - 5);
    line(person.n + " sana " + TL(amount) + " verdi.", "gold");
  } else {
    person.b = cl(person.b - 7);
    line(person.n + " para vermeyi reddetti.", "bad");
  }
  render();
}
function openRelationshipPerson(original) {
  if (!original || !S || S.dead) return;
  const life = S;
  const current = () =>
    S.partner &&
    (S.partner === original || (original.id !== undefined && S.partner.from === original.id))
      ? S.partner
      : original;
  const identity = original.id !== undefined ? "id:" + original.id : "name:" + original.n;
  const action = (ic, title, description, kind, callback, disabled = false) => {
    const limit = GAME_BALANCE.relationshipLimits[kind],
      key = "relation:" + identity + ":" + kind;
    const remaining = limit ? annualActionRemaining(key, limit) : null;
    return {
      ic,
      t: title,
      d: description + (limit ? " · " + remaining + "/" + limit + " hak" : ""),
      disabled: disabled || remaining === 0,
      f: () => {
        if (S !== life || S.dead) return;
        const person = current();
        if (!person || person.dead) return;
        if (limit && !useAnnualAction(key, limit)) return;
        const scroller = $("pg").querySelector(".ol"),
          position = scroller ? scroller.scrollTop : 0;
        runResultBarAction(()=>callback(person), "İlişki sonucu");
        render();
        pgDraw();
        const fresh = $("pg").querySelector(".ol");
        if (fresh) fresh.scrollTop = position;
      },
    };
  };
  pgOpen(() => {
    if (S !== life) return { title: "KİŞİ", rows: [] };
    const person = current(),
      partner = person === S.partner,
      age = relationshipAge(person, original),
      family = relationshipFamily(original),
      adult = S.age >= 18 && age >= 18,
      role = partner ? (S.married ? "Eşin" : "Sevgilin") : person.role || "Tanıdığın";
    const bond = cl(person.b || 0),
      face = pface({ pa: age, f: person.f, dead: person.dead });
    const intro='<section class="relationship-profile"><span class="relationship-avatar">'+face+'</span><div class="relationship-profile-info"><strong>'+esc(person.n)+'</strong><div class="relationship-detail"><span aria-hidden="true">♡</span><span>'+esc(role)+' · '+age+' yaşında'+(person.dead?' · Vefat etti':'')+'</span></div><div class="relationship-detail relationship-detail-job"><span aria-hidden="true">💼</span><span>'+esc(typeof pjob==="function"?pjob(person):"")+'</span></div><div class="relationship-bond-box"><span>İlişki</span><div class="relationship-bond-track"><i style="width:'+bond+'%"></i></div><b>'+bond+'%</b></div></div></section>';
    if (person.dead) return { title: "KİŞİ", intro, rows: [] };
    const rows = [
      action("💬", "Sohbet et", "İlişkinizi güçlendir", "chat", (p) => {
        p.b = cl(p.b + 4);
        apply({ m: 1 });
        line(p.n + " ile sohbet ettin.", "good");
      }),
      action("🌟", "İltifat et", "Güzel bir söz söyle", "compliment", (p) => {
        p.b = cl(p.b + 5);
        apply({ m: 1 });
        line(p.n + " iltifatına sevindi.", "good");
      }),
      action("💢", "Hakaret et", "İlişkiniz zarar görür", "insult", (p) => {
        p.b = cl(p.b - 15);
        apply({ m: -2 });
        line(p.n + " hakaretin yüzünden kırıldı.", "bad");
      }),
    ];
    if (S.age >= 18)
      rows.push(
        action("🎁", "Hediye al", TL(partner ? 5000 : 2000), "gift", (p) => {
          const cost = partner ? 5000 : 2000;
          if (S.p < cost) {
            const counts = annualActionCounts();
            counts["relation:" + identity + ":gift"]--;
            return modal("Hediye al", "Yeterli paran yok.", [{ t: "Kapat", p: 1 }]);
          }
          S.p -= cost;
          p.b = cl(p.b + 10);
          apply({ m: 2 });
          line(p.n + " için hediye aldın. (-" + TL(cost) + ")", "good");
        }),
      );
    if (!partner && !family && S.age >= 14 && age >= 14)
      rows.push(
        action(
          "💌",
          "Çıkma teklif et",
          S.partner ? "Önce mevcut ilişkini bitirmelisin" : "Şansınız bağınıza ve görünümüne bağlı",
          "proposal",
          (p) => askOut(p),
          !!S.partner,
        ),
      );
    if (partner) {
      rows.push(
        action(
          "🌹",
          "Randevuya çık",
          S.age >= 18 ? TL(2000) : "Birlikte vakit geçir",
          "date",
          (p) => {
            if (S.age >= 18 && S.p < 2000) {
              annualActionCounts()["relation:" + identity + ":date"]--;
              return modal("Randevu", "Yeterli paran yok.", [{ t: "Kapat", p: 1 }]);
            }
            if (S.age >= 18) S.p -= 2000;
            p.b = cl(p.b + 8);
            apply({ m: 4 });
            line(p.n + " ile randevuya çıktın.", "good");
          },
        ),
      );
      if (adult && !family) {
        rows.push(
          action("❤️", "Aşk yaşa", "Partnerinle yakınlaş", "love", (p) => {
            p.b = cl(p.b + 5);
            apply({ m: 4 });
            line(p.n + " ile romantik vakit geçirdin.", "good");
          }),
        );
        const opposite = (person.f === undefined ? !S.f : !!person.f) !== !!S.f;
        rows.push(
          action(
            "👶",
            opposite ? "Çocuk yap" : "Evlat edin",
            opposite ? "Yılda bir deneme · yaşa bağlı şans" : "Maliyet: " + TL(200000),
            "child",
            (p) => haveKid(p, opposite),
            S.kidYear === S.age,
          ),
        );
      }
      if (!S.married)
        rows.push(
          action("💍", "Evlen", !adult || S.age < 20 ? "Evlenmek için 20 yaşında, partnerin de yetişkin olmalı" : TL(400000) + " · Kabul ihtimali ilişkinize bağlı", "marry", (p) => {
            if (!adult || S.age < 20) return;
            if (S.p < 400000)
              return modal("Evlen", "Düğün için yeterli paran yok.", [{ t: "Kapat", p: 1 }]);
            if (p.b < 60 && Math.random() >= Math.max(.05, cl(p.b) / 100)) {
              line(p.n + " evlenme teklifini reddetti. İlişkinizi güçlendirip tekrar deneyebilirsin.", "bad");
              return modal("Evlenme teklifi", p.n + " şu an evlenmeye hazır olmadığını söyledi.", [{ t: "Kapat", p: 1 }]);
            }
            S.p -= 400000;
            S.married = true;
            p.b = cl(p.b + 10);
            apply({ m: 10 });
            line(p.n + " ile evlendiniz!", "good");
          }, !adult || S.age < 20),
        );
      rows.push(
        action("💔", "İlişkiyi bitir", "Ayrılmak istediğini söyle", "breakup", (p) =>
          modal("İlişkiyi bitir", p.n + " ile ayrılmak istiyor musun?", [
            {
              t: "Ayrıl",
              p: 1,
              f: () => {
                if (S !== life || S.partner !== p) return;
                S.partner = null;
                S.married = false;
                apply({ m: -8 });
                line(p.n + " ile ayrıldınız.", "bad");
                PG.pop();
                render();
                pgDraw();
                drawRel();
              },
            },
            { t: "Vazgeç" },
          ]),
        ),
      );
    }
    if (S.age >= 12 && age >= 18)
      rows.push(
        action(
          "💸",
          "Para iste",
          "Yılda bir kez maddi yardım iste",
          "money",
          requestRelationshipMoney,
          S.relationshipMoneyYear === S.age,
        ),
      );
    return { title: "KİŞİ", intro, rows };
  });
}
person = function (q) {
  return openRelationshipPerson(q);
};
partnerMenu = function () {
  return openRelationshipPerson(S.partner);
};

// Partnerin bilinen yaşı da yıl ilerledikçe güncellenir.
const nextYearBeforeRelationshipAges=nextYear;
nextYear=function(){const life=S,age=S&&S.age,partner=S&&S.partner,result=nextYearBeforeRelationshipAges();if(S&&S===life&&S.age>age&&S.partner===partner&&partner&&Number.isFinite(partner.pa))partner.pa+=S.age-age;return result};
$("next").onclick=nextYear;
