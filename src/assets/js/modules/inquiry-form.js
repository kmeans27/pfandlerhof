/**
 * Anfrageformular
 * ---------------
 * Es gibt keinen Server: Das Formular öffnet das E-Mail-Programm der
 * Gäste mit einer fertig ausgefüllten Nachricht. So funktioniert es
 * kostenlos, ohne Datenspeicherung und ohne Drittanbieter.
 */

const FIELD_LABELS = {
  name: "Name",
  email: "E-Mail",
  phone: "Telefon",
  arrival: "Anreise",
  departure: "Abreise",
  adults: "Erwachsene",
  children: "Kinder",
  childrenAge: "Alter der Kinder",
  apartment: "Ferienwohnung",
  message: "Nachricht",
};

function formatDate(value) {
  if (!value) return "–";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}.${month}.${year}`;
}

export function buildBody(values) {
  const lines = [
    "Guten Tag Familie Pichler,",
    "",
    "wir interessieren uns für einen Aufenthalt am Pfandlerhof.",
    "",
    `Name: ${values.name}`,
    `E-Mail: ${values.email}`,
  ];

  if (values.phone) lines.push(`Telefon: ${values.phone}`);
  lines.push(
    `Anreise: ${formatDate(values.arrival)}`,
    `Abreise: ${formatDate(values.departure)}`,
    `Erwachsene: ${values.adults}`,
  );

  if (values.children && values.children !== "0") {
    lines.push(`Kinder: ${values.children}`);
    if (values.childrenAge) lines.push(`Alter der Kinder: ${values.childrenAge}`);
  }

  if (values.apartment) lines.push(`Ferienwohnung: ${values.apartment}`);
  if (values.message) lines.push("", "Nachricht:", values.message);

  lines.push("", "Bitte senden Sie uns ein Angebot.", "", "Freundliche Grüße", values.name);
  return lines.join("\n");
}

export function initInquiryForm() {
  const form = document.querySelector("[data-inquiry-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const recipient = form.dataset.recipient;
  const apartmentSelect = form.elements.apartment;

  // Vorauswahl über den Link, z. B. /kontakt/?wohnung=jaufenblick#anfrage
  const requestedApartment = new URLSearchParams(window.location.search).get("wohnung");
  if (requestedApartment && apartmentSelect) {
    apartmentSelect.value = requestedApartment;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const values = Object.fromEntries(
      Object.keys(FIELD_LABELS).map((key) => [
        key,
        String(data.get(key) || "").trim(),
      ]),
    );

    if (apartmentSelect && apartmentSelect.selectedOptions[0]) {
      values.apartment = apartmentSelect.selectedOptions[0].textContent.trim();
    }

    const subject = `Anfrage Pfandlerhof – ${values.name}`;
    const body = buildBody(values);
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    if (status) {
      status.classList.add("is-visible");
      status.focus();
    }
  });
}
