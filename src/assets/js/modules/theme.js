/**
 * Hell-/Dunkel-Umschalter
 * -----------------------
 * Die Grundentscheidung fällt bereits im Inline-Skript im <head>
 * (kein Aufblitzen). Hier werden nur noch die Buttons bedient und
 * die Wahl im localStorage gespeichert.
 */
export function initTheme() {
  const root = document.documentElement;
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  const labels = document.querySelectorAll("[data-theme-label]");
  const meta = document.querySelector('meta[name="theme-color"]');
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  if (!buttons.length) return;

  const apply = (theme, persist = false) => {
    const isDark = theme === "dark";
    root.setAttribute("data-theme", isDark ? "dark" : "light");

    if (persist) {
      try {
        localStorage.setItem("pf-theme", isDark ? "dark" : "light");
      } catch (error) {
        // Privater Modus o. Ä. – dann eben ohne Speichern.
      }
    }

    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute(
        "aria-label",
        isDark ? "Hellmodus einschalten" : "Dunkelmodus einschalten",
      );
    });

    labels.forEach((label) => {
      label.textContent = isDark ? "Hellmodus" : "Dunkelmodus";
    });

    if (meta) meta.setAttribute("content", isDark ? "#111712" : "#fbf7f0");
  };

  apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next, true);
    });
  });

  // Systemwechsel nur übernehmen, wenn der Gast nichts Eigenes gewählt hat.
  media.addEventListener("change", (event) => {
    let hasChoice = false;
    try {
      hasChoice = Boolean(localStorage.getItem("pf-theme"));
    } catch (error) {
      hasChoice = false;
    }
    if (!hasChoice) apply(event.matches ? "dark" : "light");
  });
}
