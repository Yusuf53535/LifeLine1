// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
function bizEvent() {
  const b = S.biz;
  if (!b) return;
  const md = () => (b.mod = b.mod || { rev: 0, exp: 0 }),
    k = Math.round(b.inv * 0.05),
    pc = Math.round((b.emp || 0) * b.inv * 0.02),
    cap = Math.round(b.inv * 0.5),
    bc = Math.round(b.inv * 0.6);
  const E = [
    {
      t: L8("Rakip işletme açıldı", "A rival business opened"),
      d: L8(
        "Yakınında rakip bir işletme açıldı, müşteriler ona kayıyor.",
        "A rival opened nearby and customers are drifting to them.",
      ),
      c: [
        {
          t: L8("Fiyat kır", "Cut prices"),
          m: L8(
            "Fiyatları düşürdün; müşteri kaybı azaldı ama marjın düştü.",
            "You cut prices; fewer customers left but margins shrank.",
          ),
          fx: {},
          run: () => {
            md().exp += 0.05;
            md().rev -= 0.02;
          },
        },
        {
          t: L8("Reklam kampanyası", "Ad campaign"),
          m: L8("Kampanya markanı güçlendirdi.", "The campaign strengthened your brand."),
          fx: { p: -k },
          run: () => {
            b.rep = cl(b.rep + 5);
          },
        },
        {
          t: L8("Aldırma", "Ignore it"),
          m: L8(
            "Rakibi görmezden geldin, satışlar düştü.",
            "You ignored the rival and sales dropped.",
          ),
          fx: {},
          run: () => {
            md().rev -= 0.12;
            b.rep = cl(b.rep - 2);
          },
        },
      ],
    },
    {
      f: () => b.emp > 0,
      t: L8("Çalışanlar zam istiyor", "Staff demand a raise"),
      d: L8("Çalışanların maaşlarının artmasını istiyor.", "Your employees want higher pay."),
      c: [
        {
          t: L8("Prim ver", "Pay a bonus"),
          m: L8(
            "Ekibine prim verdin, moral yükseldi.",
            "You paid your team a bonus and morale rose.",
          ),
          fx: { p: -pc },
          run: () => {
            b.mor = cl(b.mor + 15);
          },
        },
        {
          t: L8("Reddet", "Decline"),
          m: L8("Talebi reddettin, ortam gerildi.", "You declined and the mood turned sour."),
          fx: {},
          run: () => {
            b.mor = cl(b.mor - 15);
            if (Math.random() < 0.3 && b.emp > 0) {
              b.emp--;
              line(L8("Bir çalışan istifa etti.", "An employee quit."), "bad");
            }
          },
        },
      ],
    },
    {
      t: L8("Tedarikçi zam yaptı", "Supplier raised prices"),
      d: L8("Ana tedarikçin fiyatlara zam yaptı.", "Your main supplier raised prices."),
      c: [
        {
          t: L8("Fiyatları artır", "Raise your prices"),
          m: L8("Zammı müşteriye yansıttın.", "You passed the increase on to customers."),
          fx: {},
          run: () => {
            b.rep = cl(b.rep - 4);
            md().rev -= 0.03;
          },
        },
        {
          t: L8("Maliyeti üstlen", "Absorb the cost"),
          m: L8(
            "Zammı kendin üstlendin, marjın daraldı.",
            "You absorbed the increase and margins narrowed.",
          ),
          fx: {},
          run: () => {
            md().exp += 0.1;
          },
        },
        {
          t: L8("Yeni tedarikçi bul", "Find a new supplier"),
          m: L8("Yeni tedarikçi aradın.", "You looked for a new supplier."),
          fx: { p: -k },
          run: () => {
            if (Math.random() < 0.6) {
              md().exp -= 0.03;
              b.rep = cl(b.rep + 2);
              line(L8("Daha ucuz bir tedarikçi buldun.", "You found a cheaper supplier."), "gold");
            } else {
              md().exp += 0.12;
              line(
                L8(
                  "Yeni tedarikçi sorunlu çıktı, maliyetler arttı.",
                  "The new supplier was a mess and costs rose.",
                ),
                "bad",
              );
            }
          },
        },
      ],
    },
    {
      f: () => b.yrs >= 2 && !b.share,
      t: L8("Yatırımcı teklifi", "Investor offer"),
      d:
        L8(
          "Bir yatırımcı işletmene %20 ortak olmak için şu kadar sermaye öneriyor: ",
          "An investor offers capital for a 20% stake: ",
        ) + TL(cap),
      c: [
        {
          t: L8("Kabul et", "Accept"),
          m: L8("Ortak aldın, sermaye büyüdü.", "You took a partner and capital grew."),
          fx: {},
          run: () => {
            b.inv += cap;
            b.share = 0.2;
            b.pPaid = cap;
          },
        },
        {
          t: L8("Reddet", "Decline"),
          m: L8("Teklifi reddettin.", "You turned the offer down."),
          fx: {},
        },
      ],
    },
    {
      t: L8("Fenomen işbirliği", "Influencer collab"),
      d: L8(
        "Bir sosyal medya fenomeni işletmen hakkında paylaşım yapmak istiyor.",
        "A social media influencer wants to feature your business.",
      ),
      c: [
        {
          t: L8("İşbirliği yap", "Collaborate"),
          m: L8("Paylaşım çok ilgi gördü.", "The post got lots of attention."),
          fx: { p: -k },
          run: () => {
            md().rev += 0.2;
            b.rep = cl(b.rep + 6);
          },
        },
        {
          t: L8("Teşekkür et", "Politely decline"),
          m: L8("Nazikçe teşekkür ettin.", "You politely thanked them."),
          fx: {},
          run: () => {
            b.rep = cl(b.rep + 2);
          },
        },
      ],
    },
    {
      f: () => (b.br || 1) < 4 && b.rep >= 50 && b.yrs >= 2 && S.p >= bc,
      t: L8("Şube fırsatı", "Branch opportunity"),
      d: L8(
        "Yakın bir semtte uygun bir dükkan çıktı.",
        "A suitable shop came up in a nearby district.",
      ),
      c: [
        {
          t: L8("Şube aç", "Open a branch"),
          m: L8("Yeni şube açıldı.", "A new branch opened."),
          fx: { p: -bc },
          run: () => {
            b.br = (b.br || 1) + 1;
          },
        },
        {
          t: L8("Şimdilik değil", "Not now"),
          m: L8("Fırsatı değerlendirmedin.", "You passed on the opportunity."),
          fx: {},
        },
      ],
    },
  ].filter((e) => !e.f || e.f());
  choose(R(E));
}
