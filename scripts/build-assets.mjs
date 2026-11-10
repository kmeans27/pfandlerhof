/**
 * Bündelt CSS und JavaScript nach `_site/assets/`.
 *
 * Aufruf:
 *   node scripts/build-assets.mjs           – einmalig, minifiziert
 *   node scripts/build-assets.mjs --watch   – bei Änderungen neu bauen
 */
import { build, context } from "esbuild";

const watch = process.argv.includes("--watch");

const shared = {
  bundle: true,
  minify: !watch,
  sourcemap: watch ? "inline" : false,
  target: ["es2020"],
  legalComments: "none",
  logLevel: "info",
};

const jobs = [
  {
    ...shared,
    entryPoints: ["src/assets/css/main.css"],
    outfile: "_site/assets/css/main.css",
    external: ["*.woff2"],
  },
  {
    ...shared,
    entryPoints: ["src/assets/js/main.js"],
    outfile: "_site/assets/js/main.js",
    format: "iife",
  },
];

if (watch) {
  for (const job of jobs) {
    const ctx = await context(job);
    await ctx.watch();
  }
  console.log("Assets werden überwacht …");
} else {
  await Promise.all(jobs.map((job) => build(job)));
  console.log("Assets gebaut.");
}
