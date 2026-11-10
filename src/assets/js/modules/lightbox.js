/**
 * Bildergalerie mit nativem <dialog>
 * ----------------------------------
 * Die sichtbaren Bilder werden bei jedem Öffnen neu ermittelt, damit
 * die Galerie-Filter auch für die Vor/Zurück-Navigation gelten.
 */
export function initLightbox() {
  const triggers = Array.from(document.querySelectorAll("[data-lightbox]"));
  const dialog = document.getElementById("lightbox");
  if (!triggers.length || !dialog || typeof dialog.showModal !== "function") return;

  const image = dialog.querySelector("[data-lightbox-img]");
  const caption = dialog.querySelector("[data-lightbox-caption]");
  const counter = dialog.querySelector("[data-lightbox-counter]");
  const closeButton = dialog.querySelector("[data-lightbox-close]");
  const previous = dialog.querySelector("[data-lightbox-prev]");
  const next = dialog.querySelector("[data-lightbox-next]");

  let items = [];
  let index = 0;
  let lastFocus = null;

  const visibleItems = () =>
    triggers.filter((item) => !item.hidden && item.offsetParent !== null);

  const show = (newIndex) => {
    if (!items.length) return;
    index = (newIndex + items.length) % items.length;
    const item = items[index];
    const thumbnail = item.querySelector("img");

    image.src = item.dataset.full;
    image.alt = thumbnail ? thumbnail.alt : "";
    caption.textContent = item.dataset.caption || "";
    counter.textContent = `${index + 1} / ${items.length}`;
  };

  const open = (item) => {
    items = visibleItems();
    if (!items.length) return;

    lastFocus = document.activeElement;
    show(items.indexOf(item));
    dialog.showModal();
    document.body.classList.add("modal-open");
    closeButton.focus();
  };

  const close = () => dialog.close();

  triggers.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      open(item);
    });
  });

  closeButton.addEventListener("click", close);
  previous.addEventListener("click", () => show(index - 1));
  next.addEventListener("click", () => show(index + 1));

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    image.src = "";
    if (lastFocus) lastFocus.focus();
  });
}
