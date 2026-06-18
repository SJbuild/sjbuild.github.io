/**
 * Optimize raw Figma photo exports into responsive AVIF/WebP/JPEG sets.
 * Input:  _design/raw-assets/*.{png,jpg,jpeg}
 *         _design/raw-assets/villas/<villa>/*.{png,jpg,jpeg,pdf}
 * Output: public/images/<name>-<width>.{avif,webp,jpg}
 *         public/images/villas/<villa>/<name>-<width>.{avif,webp,jpg}
 *         public/documents/villas/<villa>/<name>.pdf
 * Idempotent: skips outputs newer than their source.
 */
import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const inDir = path.join(root, "..", "_design", "raw-assets");
const outDir = path.join(root, "..", "public", "images");
const villasInDir = path.join(inDir, "villas");
const villasImagesOutDir = path.join(outDir, "villas");
const villasDocsOutDir = path.join(root, "..", "public", "documents", "villas");

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

async function processImage(src, name, destDir, report) {
  const srcStat = await stat(src);
  const { width: srcWidth } = await sharp(src).metadata();

  const targets = WIDTHS.filter((w) => w <= srcWidth);
  if (targets.length === 0 || targets.at(-1) !== srcWidth) {
    targets.push(Math.min(srcWidth, WIDTHS.at(-1)));
  }

  for (const width of targets) {
    for (const [ext, encode] of FORMATS) {
      const out = path.join(destDir, `${name}-${width}.${ext}`);
      if (await newerThan(out, srcStat.mtimeMs)) continue;
      await encode(sharp(src).resize({ width })).toFile(out);
      const { size } = await stat(out);
      report.push({ output: path.relative(path.join(root, ".."), out), kb: Math.round(size / 1024) });
    }
  }
}

await mkdir(outDir, { recursive: true });
const report = [];

const files = (await readdir(inDir, { withFileTypes: true }))
  .filter((f) => f.isFile() && /\.(png|jpe?g)$/i.test(f.name))
  .map((f) => f.name);

for (const file of files) {
  const name = file.replace(/\.(png|jpe?g)$/i, "");
  await processImage(path.join(inDir, file), name, outDir, report);
}

const villaDirs = await readdir(villasInDir, { withFileTypes: true }).catch(() => []);
for (const villa of villaDirs.filter((d) => d.isDirectory())) {
  const srcDir = path.join(villasInDir, villa.name);
  const imageOutDir = path.join(villasImagesOutDir, villa.name);
  const docOutDir = path.join(villasDocsOutDir, villa.name);
  await mkdir(imageOutDir, { recursive: true });
  await mkdir(docOutDir, { recursive: true });

  const entries = await readdir(srcDir, { withFileTypes: true });
  for (const entry of entries.filter((e) => e.isFile())) {
    const src = path.join(srcDir, entry.name);
    if (/\.(png|jpe?g)$/i.test(entry.name)) {
      const name = entry.name.replace(/\.(png|jpe?g)$/i, "");
      await processImage(src, name, imageOutDir, report);
    } else if (/\.pdf$/i.test(entry.name)) {
      const srcStat = await stat(src);
      const out = path.join(docOutDir, entry.name);
      if (await newerThan(out, srcStat.mtimeMs)) continue;
      await copyFile(src, out);
      const { size } = await stat(out);
      report.push({ output: path.relative(path.join(root, ".."), out), kb: Math.round(size / 1024) });
    }
  }
}

if (report.length === 0) {
  console.log(`No new sources to process in ${inDir}`);
  process.exit(0);
}

console.table(report);
console.log(`Done: ${report.length} files written.`);
