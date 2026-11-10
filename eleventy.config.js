import { iconSvg } from "./scripts/icons.mjs";

/**
 * Eleventy-Konfiguration
 * ----------------------
 * Quelltexte liegen in `src/`, das fertige Ergebnis in `_site/`.
 * CSS und JavaScript werden separat von esbuild gebündelt
 * (siehe `scripts/build-assets.mjs`).
 */
export default function (eleventyConfig) {
  // Bilder, Schriften und Favicon unverändert übernehmen.
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy({
    "src/assets/apple-touch-icon.png": "apple-touch-icon.png",
  });

  // Inline-Icons: {% icon "phone" %}
  eleventyConfig.addShortcode("icon", (name, className = "") =>
    iconSvg(name, className),
  );

  // Für den Einsatz in importierten Nunjucks-Makros (dort sind Shortcodes
  // nicht verfügbar): {{ "phone" | icon | safe }}
  eleventyConfig.addFilter("icon", (name, className = "") =>
    iconSvg(name, className),
  );

  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  /**
   * Interne Links bekommen den konfigurierten Pfad-Präfix (GitHub Pages),
   * externe Links (https:, mailto:, tel:) bleiben unverändert.
   */
  eleventyConfig.addFilter("link", (href = "/") => {
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("#")) return href;
    const prefix = (process.env.PATH_PREFIX || "/").replace(/\/+$/, "");
    const path = href.startsWith("/") ? href : `/${href}`;
    return `${prefix}${path}` || "/";
  });

  // Passende Bildbreiten anhand der Originalbreite.
  eleventyConfig.addFilter("widths", (width) => {
    if (width >= 1440) return [640, 960, 1440];
    if (width >= 1200) return [800, 1200];
    if (width >= 1024) return [640, 1024];
    return [480, 900];
  });

  // 1.234,50 € – deutsche Schreibweise
  eleventyConfig.addFilter("euro", (value) =>
    Number(value).toLocaleString("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
  );

  // Erlaubt {% set list = "a,b,c" | split(",") %}
  eleventyConfig.addFilter("split", (value, separator = ",") =>
    String(value)
      .split(separator)
      .map((entry) => entry.trim()),
  );

  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

  // Cache-Buster für CSS und JavaScript (ändert sich bei jedem Build).
  eleventyConfig.addGlobalData("buildId", () => Date.now().toString(36));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    pathPrefix: process.env.PATH_PREFIX || "/",
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
