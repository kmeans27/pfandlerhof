/**
 * Bildergalerie mit nativem <dialog>
 * ----------------------------------
 * Funktioniert ohne Bibliothek, ist per Tastatur bedienbar und fällt
 * ohne JavaScript auf normale Links zurück (die Bilder öffnen sich dann
 * in einem neuen Tab – siehe Markup in cards.njk).
 */
export function initLightbox() {
  const items = Array.from(document.querySelectorAll("[data-lightbox]"));
  const dialog = document.getElementById("lightbox");
  if (!items.length || !dialog || typeof dialog.showModal !== "function") return;

  const image = dialog.querySelector("[data-lightbox-img]");
  const caption = dialog.querySelector("[data-lightbox-caption]");
  const counter = dialog.querySelector("[data-lightbox-counter]");
  const closeButton = dialog.querySelector("[data-lightbox-close]");
  const previous = dialog.querySelector("[data-lightbox-prev]");
  const next = dialog.querySelector("[data-lightbox-next]");

  let index = 0;
  let lastFocus = null;

  const show = (newIndex) => {
    index = (newIndex + items.length) % items.length;
    const item = items[index];
    const thumbnail = item.querySelector("img");

    image.src = item.dataset.full;
    image.alt = thumbnail ? thumbnail.alt : "";
    caption.textContent = item.dataset.caption || "";
    counter.textContent = `${index + 1} / ${items.length}`;
  };

  const open = (newIndex) => {
    lastFocus = document.activeElement;
    show(newIndex);
    dialog.showModal();
    document.body.classList.add("modal-open");
    closeButton.focus();
  };

  const close = () => dialog.close();

  items.forEach((item, itemIndex) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      open(itemIndex);
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
