// Kaynak index.html ve data/ dizinini Android / iOS paketlerine kopyalar.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
for (const target of ["www", "LifeLine/Resources"]) {
  const directory = path.join(root, target);
  fs.mkdirSync(directory, { recursive: true });
  fs.copyFileSync(path.join(root, "index.html"), path.join(directory, "index.html"));
  fs.cpSync(path.join(root, "data"), path.join(directory, "data"), { recursive: true });
  console.log(target + " güncellendi");
}
