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
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-src/original";
const OUT = "src/assets/img";

/** @type {{slug:string, file:string, widths?:number[], cropTop?:number, aspect?:number}[]} */
const images = [
  { slug: "hero", file: "rh1.jpg", widths: [800, 1200] },
  { slug: "hof-weg", file: "rh2.jpg", widths: [640, 800, 1200] },
  { slug: "haus-sommer", file: "1b.jpg", widths: [480, 900] },
  { slug: "haus-terrasse", file: "4a.jpg", widths: [480, 900] },
  { slug: "liegewiese", file: "5a.jpg", widths: [480, 900] },
  { slug: "hof-sommer", file: "8a.jpg", widths: [480, 900] },
  { slug: "balkon", file: "11.jpg", widths: [480, 900] },
  { slug: "eingang", file: "phoca_thumb_l_p1010489.jpg", widths: [640, 1024] },
  { slug: "blick-st-martin", file: "phoca_thumb_l_pfandlerhof_pan1a.jpg", widths: [640, 1024] },
  { slug: "berge", file: "08.jpg", widths: [480, 900] },
  { slug: "berge-2", file: "07.jpg", widths: [480, 900] },
  { slug: "wohnen-1", file: "ab1.jpg", widths: [640, 960, 1440] },
  { slug: "wohnen-2", file: "ab2.jpg", widths: [640, 960, 1440] },
  { slug: "essen", file: "ab3.jpg", widths: [640, 960, 1440] },
  { slug: "wohnen-3", file: "ab4.jpg", widths: [640, 960, 1440] },
  { slug: "kueche", file: "ab5.jpg", widths: [640, 960, 1440] },
  { slug: "kinderzimmer", file: "phoca_thumb_l_dsc_9935.jpg", widths: [640, 1024] },
  { slug: "elternzimmer", file: "phoca_thumb_l_dsc_9936.jpg", widths: [640, 1024] },
  { slug: "bad", file: "phoca_thumb_l_dsc_9938.jpg", widths: [640, 1024] },
  { slug: "wohnkueche", file: "phoca_thumb_l_dsc_9939.jpg", widths: [640, 1024] },
  { slug: "kueche-2", file: "phoca_thumb_l_dsc_9940.jpg", widths: [640, 1024] },
  { slug: "kinderzimmer-2", file: "phoca_thumb_l_dsc_9963.jpg", widths: [640, 1024] },
  { slug: "elternzimmer-2", file: "phoca_thumb_l_dsc_9964.jpg", widths: [640, 1024] },
  { slug: "bad-2", file: "phoca_thumb_l_dsc_9968.jpg", widths: [640, 1024] },
  { slug: "bad-3", file: "phoca_thumb_l_dsc_9969.jpg", widths: [640, 1024] },
  { slug: "wohnen-4", file: "phoca_thumb_l_dsc_9973.jpg", widths: [640, 1024] },
  { slug: "grundriss", file: "wohnungen-uebersicht2.jpg", widths: [530] },
  {
    slug: "fruehstueck",
    file: "phoca_thumb_l_fruehstueckskorb-1024x768.jpg",
    widths: [640, 1024],
    cropTop: 70,
  },
];

const jpeg = { quality: 82, progressive: true, mozjpeg: true };
const webp = { quality: 78, effort: 5 };

async function main() {
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
  await sharp(path.join(SRC, "rh1.jpg"))
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 84, progressive: true, mozjpeg: true })
    .toFile(path.join(OUT, "og-image.jpg"));
  console.log("✓ og-image");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
