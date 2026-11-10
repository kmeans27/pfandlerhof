# Pfandlerhof – Website

Neue Website für den **Pfandlerhof**, Urlaub auf dem Bauernhof in St. Martin in Passeier (Südtirol).
Bewusst einfach gehalten: große Schrift, klare Navigation, keine Cookies, kein Tracking, keine externen Schriften oder Karten.

Die Inhalte stammen von der bisherigen Website, dem Roter-Hahn-Eintrag, HolidayCheck und Airbnb.

**Live-Vorschau:** <https://kmeans27.github.io/pfandlerhof/>

## Schnellstart

```bash
npm install
npm run dev
```

Der Entwicklungsserver läuft unter <http://localhost:8080>.
Einmalig bauen:

```bash
npm run build
```

Das Ergebnis liegt in `_site/` und kann auf jedem Webserver gehostet werden.

## Technik

| Baustein | Zweck |
| --- | --- |
| [Eleventy 3](https://www.11ty.dev/) | Statische Seiten aus Nunjucks-Templates |
| [esbuild](https://esbuild.github.io/) | Bündelt und minifiziert CSS und JavaScript |
| [sharp](https://sharp.pixelplumbing.com/) | Erzeugt WebP- und JPEG-Varianten der Fotos |
| Vanilla JS | Navigation, Galerie-Lightbox, Anfrageformular |

Kein Framework im Browser, kein Build-Schritt beim Aufruf, keine Datenbank.
Schriften (Fraunces, Source Sans 3) liegen selbst gehostet in `src/assets/fonts/` (SIL Open Font License).

## Aufbau

```text
src/
  _data/                Inhalte, die regelmäßig geändert werden
    site.json           Name, Adresse, Telefon, E-Mail, Bewertungen
    apartments.json     Die beiden Ferienwohnungen
    prices.json         Zusatzpreise und Buchungshinweise
    gallery.json        Galerie mit Bildunterschriften
    reviews.json        Gästestimmen
    features.json       „Das macht uns besonders“
    farm.json           Tiere, Hofleben, Produkte, Nachhaltigkeit
    amenities.json      Ausstattung der Wohnungen
    nav.json            Hauptnavigation
  _includes/
    layouts/base.njk    Grundgerüst jeder Seite
    partials/           Header, Footer, Lightbox, Schnellkontakt
    components/         Wiederverwendbare Makros (Bild, Button, Karten …)
  assets/
    css/                tokens, base, layout, components, pages
    js/modules/         nav, header, lightbox, inquiry-form
    img/                Optimierte Bilder (generiert)
    fonts/              Selbst gehostete Schriften
  index.njk             Startseite
  ferienwohnungen.njk   Wohnungen & Preise
  der-hof.njk           Hof, Tiere, Produkte
  umgebung.njk          Wandern, Ausflüge, Winter
  galerie.njk           Bildergalerie
  kontakt.njk           Kontakt, Formular, Anfahrt
  impressum.njk         Impressum
  datenschutz.njk       Datenschutz
  404.njk               Fehlerseite
scripts/                Build, Bildaufbereitung, Linkprüfung
assets-src/original/    Originalfotos (Quelle für die Bildoptimierung)
```

## Inhalte ändern

Fast alle Texte, Preise und Kontaktdaten stehen in `src/_data/*.json`.
Ein Beispiel: Neuer Preis für die Wohnung „Meranersicht“ →

```json
// src/_data/apartments.json
{ "slug": "meranersicht", "priceFrom": 115, ... }
```

Fließtexte der einzelnen Seiten stehen direkt in den `.njk`-Dateien unter `src/`.
Das ist Absicht: Wer eine Seite umbauen möchte, öffnet genau eine Datei.

### Bilder austauschen oder ergänzen

1. Neues Originalfoto nach `assets-src/original/` legen.
2. In `scripts/prepare-images.mjs` einen Eintrag ergänzen:

   ```js
   { slug: "neues-foto", file: "neues-foto.jpg", widths: [640, 960, 1440] },
   ```

3. `npm run images` ausführen.
4. Das Bild in `src/_data/gallery.json` oder direkt im Template verwenden.

Die Bildbreiten werden über den Filter `widths` automatisch passend gewählt:
1440 → 640/960/1440 · 1200 → 800/1200 · 1024 → 640/1024 · sonst 480/900.
Wenn ein Motiv mit einer anderen Maximalbreite dazukommt, entweder die passenden
Breiten im Manifest erzeugen oder den Filter in `eleventy.config.js` erweitern.

## Qualitätssicherung

```bash
npm run check     # prüft alle internen Links und Bildpfade in _site/
```

Lighthouse (lokal, Startseite und Kontakt):
**Accessibility 100 · Best Practices 100 · SEO 100**.

Weitere Merkmale:

- vollständig responsive, getestet bei 390 px und 1440 px
- Tastaturbedienbar, Fokus-Stile, Skip-Link, `aria`-Attribute
- `prefers-reduced-motion` wird respektiert
- keine Layoutsprünge durch feste Bildmaße und `srcset`
- WebP mit JPEG-Fallback
- Formular funktioniert auch ohne JavaScript (öffnet dann das E-Mail-Programm)

## Veröffentlichen mit GitHub Pages

Die Website liegt auf GitHub Pages im Branch **`gh-pages`**.
Der Branch wird aus dem Build erzeugt und sollte nicht direkt bearbeitet werden.

```bash
npm run publish
```

Das Skript:

1. baut die Seite mit dem richtigen Pfad-Präfix,
2. kopiert `_site/` in ein temporäres Verzeichnis,
3. pusht den Inhalt nach `gh-pages`.

Einmalige Einstellung auf GitHub: **Settings → Pages → Build and deployment →
Source: Deploy from a branch → Branch: `gh-pages` → Ordner `/ (root)`**.

Die Adresse ist danach `https://<user>.github.io/<repo>/`.
Bei einem Repository namens `<user>.github.io` entfällt der Unterpfad automatisch.

**Aktuell** steht in `src/_data/site.json` unter `url` die Vorschau-Adresse
`https://kmeans27.github.io/pfandlerhof` – damit stimmen Canonical-URL,
Sitemap und Social-Media-Vorschau schon jetzt.

Für eine **eigene Domain** (z. B. `pfandlerhof.com`):

1. In GitHub Pages die Domain eintragen und beim DNS-Anbieter die nötigen Einträge setzen.
2. In `src/_data/site.json` unter `url` `https://www.pfandlerhof.com` eintragen.
3. `PATH_PREFIX=/ npm run publish` ausführen (baut ohne Unterpfad).
4. Die Änderungen an `site.json` und am Skript auf `main` committen.

> GitHub Actions ist bewusst nicht nötig. Die Veröffentlichung über den
> `gh-pages`-Branch funktioniert unabhängig von Actions und verbraucht keine
> Minuten. Wer später auf Actions umstellen möchte, kann den Build-Schritt
> `npm run build` mit `PATH_PREFIX` in einen eigenen Workflow übernehmen.

## Vor dem Livegang prüfen

- [ ] **Preise und Kurtaxe** mit der Familie abstimmen (Stand der Daten: 2026).
- [ ] **Haustier-Preis** ergänzen, sobald er verbindlich feststeht (aktuell „auf Anfrage“).
- [ ] **Impressum und Datenschutz** rechtlich prüfen lassen.
- [ ] **Bildrechte** klären: Ein Teil der Innenaufnahmen stammt aus dem Airbnb-/Holidu-Inserat. Am besten durch eigene, aktuelle Fotos ersetzen.
- [ ] **Formular** auf einem echten Handy und in Outlook/Apple Mail testen.
- [ ] **Domain** umstellen und `site.url` aktualisieren.

## Hinweise

- Das Anfrageformular versendet keine Daten an einen Server. Es öffnet das E-Mail-Programm
  der Gäste mit einer vorbereiteten Nachricht. Dadurch braucht die Seite keinen Backend-Dienst
  und keinen Cookie-Banner. Wenn später ein echtes Formular gewünscht ist, muss der
  Datenschutztext ergänzt werden.
- Es werden keine Karten eingebettet. „Route planen“ öffnet Google Maps in einem neuen Tab.
- Die Seite ist ein Geschenk. Wenn etwas nicht passt: Die Inhalte liegen bewusst in kleinen,
  gut auffindbaren Dateien.
