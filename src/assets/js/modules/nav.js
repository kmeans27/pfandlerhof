/**
 * Mobile Navigation
 * -----------------
 * Öffnet und schließt das Menü, setzt aria-expanded, sperrt das Scrollen
 * und schließt bei Escape, nach einem Klick auf einen Link oder beim
 * Wechsel auf die Desktop-Ansicht.
 */
export function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  const desktop = window.matchMedia("(min-width: 1181px)");
  let isOpen = false;

  const setOpen = (open) => {
    isOpen = open;
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  };

  toggle.addEventListener("click", () => setOpen(!isOpen));

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      setOpen(false);
      toggle.focus();
    }
  });

  desktop.addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}
