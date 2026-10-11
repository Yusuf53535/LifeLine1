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
