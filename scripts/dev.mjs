/**
 * Startet den lokalen Entwicklungsserver:
 * Eleventy (HTML) und esbuild (CSS/JS) laufen parallel.
 */
import { spawn } from "node:child_process";

const run = (script) =>
  spawn("npm", ["run", script], {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

const eleventy = run("serve");
const assets = run("watch:assets");

const stop = () => {
  eleventy.kill();
  assets.kill();
  process.exit(0);
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
