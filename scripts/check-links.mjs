import fs from "node:fs";
import path from "node:path";

const root = "_site";
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith(".html")) files.push(p);
  }
};
walk(root);

const missing = new Set();
const checked = new Set();
const urls = new Set();

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const matches = html.matchAll(/(?:href|src|data-full)="([^"]+)"|srcset="([^"]+)"/g);
  for (const match of matches) {
    const candidates = match[1] ? [match[1]] : match[2].split(",").map((s) => s.trim().split(/\s+/)[0]);
    for (const raw of candidates) {
      if (!raw || /^(https?:|mailto:|tel:|data:|#)/.test(raw)) continue;
      const clean = raw.split("#")[0].split("?")[0];
      if (!clean.startsWith("/")) continue;
      checked.add(clean);
      const target = clean.endsWith("/") ? `${root}${clean}index.html` : `${root}${clean}`;
      if (!fs.existsSync(target)) missing.add(`${file} -> ${raw}`);
    }
  }
}

console.log("Geprüfte interne URLs:", checked.size);
console.log("Fehlende Ziele:", missing.size);
for (const item of missing) console.log(" -", item);
