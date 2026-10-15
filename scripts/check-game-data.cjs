// Harici dosyaların yüklenmesini ve mobil kopyaların aynı verileri kullanmasını kontrol eder.
const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
function element() {
  return {
    style: {},
    dataset: {},
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
    },
    addEventListener() {},
    querySelector() {
      return element();
    },
    querySelectorAll() {
      return [];
    },
    appendChild() {},
    append() {},
    setAttribute() {},
    getAttribute() {
      return null;
    },
    innerHTML: "",
    textContent: "",
    children: [],
  };
}
function loadGame(directory) {
  const nodes = new Map();
  const document = {
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, element());
      return nodes.get(id);
    },
    querySelector: element,
    querySelectorAll() {
      return [];
    },
    addEventListener() {},
    createElement: element,
    createTreeWalker() {
      return {
        nextNode() {
          return false;
        },
      };
    },
    documentElement: element(),
    body: element(),
  };
  const context = vm.createContext({
    document,
    NodeFilter: { SHOW_TEXT: 4 },
    window: { addEventListener() {} },
    localStorage: {
      getItem() {
        return null;
      },
      setItem() {},
    },
    MutationObserver: class {
      observe() {}
    },
    setTimeout() {},
    queueMicrotask() {},
    requestAnimationFrame() {},
    console,
    Intl,
  });
  const html = fs.readFileSync(path.join(directory, "index.html"), "utf8");
  let count = 0;
  for (const match of html.matchAll(/<script(?:\s+src="([^"]+)")?>([\s\S]*?)<\/script>/g)) {
    const filename = match[1] || "inline-" + count + ".js";
    let source = match[1] ? fs.readFileSync(path.join(directory, filename), "utf8") : match[2];
    new vm.Script(source, { filename });
    const startup = source.indexOf("if(!resumeCurrentLife())start();");
    if (startup >= 0) source = source.slice(0, startup);
    vm.runInContext(source, context, { filename });
    count++;
  }
  // Yaş sınırları ve arkadaş olaylarının tekrar koruması gerçek oyun koduyla sınanır.
  vm.runInContext(`(()=>{
    const previous=S;
    const verify=(ok,message)=>{if(!ok)throw new Error(message)};
    try{
      for(let age=0;age<=100;age++){
        S={age,people:[],recentFriendEvents:[]};
        for(const ev of EV)if(eventAllowedForAge(ev,age))verify(age>=ev.a[0]&&age<=ev.a[1],'Olay yaş sınırı: '+ev.t);
        const p={n:'Deniz',pa:age,b:50,role:'Arkadaş'};S.people=[p];
        const options=friendshipEventOptions(p);
        if(age<5){verify(!options.length,'Bebeklikte arkadaş olayı');continue}
        verify(options.length>=4,'Arkadaş olay çeşitliliği yetersiz: '+age);
        for(const event of options)verify(age>=event.a[0]&&age<=event.a[1],'Arkadaş yaş aralığı');
        const ids=[];
        for(let n=0;n<4;n++)ids.push(pickFriendshipEvent(p).id);
        verify(new Set(ids).size===4,'Arkadaş olayı erken tekrarladı');
      }
      S={age:8};verify(!friendshipEventOptions({pa:30}).length,'Çocuk yetişkin arkadaş olayı');
      S={age:30};verify(!friendshipEventOptions({pa:8}).length,'Yetişkin çocuk arkadaş olayı');
      const adult={a:[18,60],c:[{fx:{m:1}}]};
      verify(!eventAllowedForAge(adult,8),'Doğrudan yetişkin olayı');
      verify(!eventAllowedForAge({c:[]},8),'Yaş tanımı olmayan yetişkin olayı');
      verify(eventAllowedForAge(adult,18),'Yetişkin olayı engellendi');
    }finally{S=previous}
  })()`,context);
  const state = vm.runInContext(
    "JSON.stringify({events:EV.map(e=>({title:e.t,ages:e.a,choices:e.c.map(c=>c.t)})),jobs:JOBS,part:PART,sports:SPORTS,football:FOOTBALL_LEAGUES,teams:TEAM_SPORT_LEAGUES})",
    context,
  );
  const health = vm.runInContext(
    'EV.length>0 && JOBS.length>0 && EV.every(e=>Array.isArray(e.a)&&typeof e.t==="string"&&Array.isArray(e.c)&&e.c.length>0) && typeof cheatEv==="function" && typeof bizEvent==="function" && typeof careerLadder==="function"',
    context,
  );
  assert(health, "Event veya kariyer tanımları eksik / geçersiz.");
  console.log(path.relative(root, directory) || "Web", ":", count, "script sorunsuz yüklendi.");
  return state;
}
const expected = loadGame(root);
for (const copy of ["www", "LifeLine/Resources"])
  assert.equal(
    loadGame(path.join(root, copy)),
    expected,
    copy + " eşleşmiyor; npm run sync:game çalıştırın.",
  );
console.log("Event ve meslek dosyaları geçerli; tüm paketler eşleşiyor.");
