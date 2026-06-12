/**
 * Optimize raw Figma photo exports into responsive AVIF/WebP/JPEG sets.
 * Input:  _design/raw-assets/*.{png,jpg,jpeg}
 * Output: public/images/<name>-<width>.{avif,webp,jpg}
 * Idempotent: skips outputs newer than their source.
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const inDir = path.join(root, "..", "_design", "raw-assets");
const outDir = path.join(root, "..", "public", "images");

const WIDTHS = [480, 768, 1024, 1440, 1920, 2560];
const FORMATS = [
  ["avif", (img) => img.avif({ quality: 55 })],
  ["webp", (img) => img.webp({ quality: 75 })],
  ["jpg", (img) => img.jpeg({ quality: 80, progressive: true, mozjpeg: true })],
];

const newerThan = async (file, ref) => {
  try {
    return (await stat(file)).mtimeMs > ref;
  } catch {
    return false;
  }
};

await mkdir(outDir, { recursive: true });
const files = (await readdir(inDir)).filter((f) => /\.(png|jpe?g)$/i.test(f));
if (files.length === 0) {
  console.log(`No raster sources in ${inDir}`);
  process.exit(0);
}

const report = [];
for (const file of files) {
  const src = path.join(inDir, file);
  const srcStat = await stat(src);
  const name = file.replace(/\.(png|jpe?g)$/i, "");
  const { width: srcWidth } = await sharp(src).metadata();

  const targets = WIDTHS.filter((w) => w <= srcWidth);
  if (targets.length === 0 || targets.at(-1) !== srcWidth) {
    targets.push(Math.min(srcWidth, WIDTHS.at(-1)));
  }

  for (const width of targets) {
    for (const [ext, encode] of FORMATS) {
      const out = path.join(outDir, `${name}-${width}.${ext}`);
      if (await newerThan(out, srcStat.mtimeMs)) continue;
      await encode(sharp(src).resize({ width })).toFile(out);
      const { size } = await stat(out);
      report.push({ output: `${name}-${width}.${ext}`, kb: Math.round(size / 1024) });
    }
  }
}

console.table(report);
console.log(`Done: ${report.length} files written to public/images/`);
