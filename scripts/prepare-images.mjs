/**
 * Erzeugt aus den Originalfotos optimierte Web-Bilder.
 *
 * Quelle:  assets-src/original/
 * Ziel:    src/assets/img/
 *
 * Pro Motiv werden mehrere Breiten als WebP und als JPEG-Fallback
 * ausgegeben. Der Dateiname folgt dem Muster `<slug>-<breite>.webp`.
 *
 * Aufruf: npm run images
 */
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-src/original";
const OUT = "src/assets/img";

/** @type {{slug:string, file:string, widths?:number[], cropTop?:number}[]} */
const images = [
  { slug: "hero", file: "rh1-2400.webp", widths: [800, 1200, 1600, 2400] },
  { slug: "view", file: "rh2-2400.webp", widths: [800, 1200, 1600, 2400] },
  { slug: "wohnen-1", file: "bk1.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "wohnen-2", file: "bk4.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "wohnen-3", file: "bk9.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "essen", file: "bk5.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "kueche", file: "bk10.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "elternzimmer", file: "bk2.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "elternzimmer-2", file: "bk7.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "kinderzimmer", file: "bk12.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "kinderzimmer-2", file: "bk13.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "bad", file: "bk3.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "bad-2", file: "bk8.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "balkon", file: "bk14.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "spielplatz", file: "bk15.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "spielplatz-2", file: "bk16.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "haus-terrasse", file: "bk6.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "haus-strasse", file: "bk17.jpg", widths: [640, 960, 1400, 1600] },
  { slug: "haus-strasse-2", file: "bk18.jpg", widths: [640, 960, 1400, 1600] },
  {
    slug: "fruehstueck",
    file: "phoca_thumb_l_fruehstueckskorb-1024x768.jpg",
    widths: [640, 1024],
    cropTop: 70,
  },
  { slug: "grundriss", file: "wohnungen-uebersicht2.jpg", widths: [530] },
];

const jpeg = { quality: 82, progressive: true, mozjpeg: true };
const webp = { quality: 78, effort: 5 };

async function main() {
  // Alte, nicht mehr benötigte Varianten entfernen, damit das Verzeichnis
  // nicht über die Jahre anwächst.
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  for (const image of images) {
    const source = path.join(SRC, image.file);
    let pipeline = sharp(source).rotate();
    if (image.cropTop) {
      const meta = await pipeline.metadata();
      pipeline = pipeline.extract({
        left: 0,
        top: image.cropTop,
        width: meta.width,
        height: meta.height - image.cropTop,
      });
    }

    const meta = await pipeline.metadata();
    for (const width of image.widths ?? [800]) {
      const targetWidth = Math.min(width, meta.width);
      const base = path.join(OUT, `${image.slug}-${targetWidth}`);

      await pipeline
        .clone()
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp(webp)
        .toFile(`${base}.webp`);

      await pipeline
        .clone()
        .resize({ width: targetWidth, withoutEnlargement: true })
        .jpeg(jpeg)
        .toFile(`${base}.jpg`);

      console.log(`✓ ${image.slug}-${targetWidth}`);
    }
  }

  // Social-Media-Vorschaubild (1200 × 630)
  await sharp(path.join(SRC, "rh1-2400.webp"))
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 84, progressive: true, mozjpeg: true })
    .toFile(path.join(OUT, "og-image.jpg"));
  console.log("✓ og-image");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
