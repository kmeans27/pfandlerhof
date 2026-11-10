/**
 * Veröffentlicht die gebaute Website im Branch `gh-pages`.
 *
 * Voraussetzung: Das Repository hat ein Remote `origin` und GitHub Pages
 * ist auf den Branch `gh-pages` (Ordner `/`) eingestellt.
 *
 * Aufruf: npm run publish
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const run = (command, options = {}) =>
  execSync(command, { stdio: "inherit", ...options });

const remote = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
const match = remote.match(/[/:]([^/]+?)(?:\.git)?$/);
const repoName = match ? match[1] : "pfandlerhof";
const ownerMatch = remote.match(/github\.com[/:]([^/]+)\//);
const owner = ownerMatch ? ownerMatch[1] : "";
const isUserSite = owner && repoName === `${owner}.github.io`;
const prefix = process.env.PATH_PREFIX || (isUserSite ? "/" : `/${repoName}/`);

console.log(`Baue Website für Pfad-Präfix "${prefix}" …`);
run("npm run build", { env: { ...process.env, PATH_PREFIX: prefix } });

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "pfandlerhof-pages-"));
fs.cpSync("_site", temp, { recursive: true });
fs.writeFileSync(path.join(temp, ".nojekyll"), "");

console.log(`Veröffentliche aus ${temp} …`);
run("git init -b gh-pages", { cwd: temp });
run("git add -A", { cwd: temp });
run('git commit -m "Website veroeffentlichen"', { cwd: temp });
run(`git remote add origin ${remote}`, { cwd: temp });
run("git push --force origin gh-pages", { cwd: temp });

console.log(`\nFertig: https://${owner}.github.io/${isUserSite ? "" : `${repoName}/`}`);
