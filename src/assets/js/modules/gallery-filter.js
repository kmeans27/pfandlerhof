/**
 * Einfache Filter für die Galerie.
 * Die Bilder bleiben im DOM, werden nur ein-/ausgeblendet.
 */
export function initGalleryFilter() {
  const buttons = Array.from(document.querySelectorAll("[data-filter]"));
  const items = Array.from(document.querySelectorAll("[data-category]"));
  const counter = document.querySelector("[data-gallery-count]");

  if (!buttons.length || !items.length) return;

  const updateCount = () => {
    if (!counter) return;
    const visible = items.filter((item) => !item.hidden).length;
    counter.textContent = `${visible} ${visible === 1 ? "Bild" : "Bilder"}`;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.filter;

      buttons.forEach((other) => {
        other.setAttribute("aria-pressed", String(other === button));
      });

      items.forEach((item) => {
        item.hidden = value !== "all" && item.dataset.category !== value;
      });

      updateCount();
    });
  });

  updateCount();
}
