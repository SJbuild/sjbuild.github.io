/**
 * Build the site, serve the production bundle, and capture full-page
 * verification screenshots into _design/verify/.
 *
 * Usage: node scripts/screenshot.mjs [--widths 1440,390] [--name page] [--motion]
 * Default emulates prefers-reduced-motion for deterministic shots;
 * pass --motion to capture with animations enabled.
 */
import { execSync, spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "_design", "verify");
const args = process.argv.slice(2);
const opt = (flag, dflt) => {
  const i = args.indexOf(flag);
  return i === -1 ? dflt : args[i + 1];
};
const widths = opt("--widths", "1440,390").split(",").map(Number);
const name = opt("--name", "page");
const withMotion = args.includes("--motion");
const PORT = 4317;

execSync("npx vite build", { cwd: root, stdio: "inherit" });

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  cwd: root,
  stdio: "ignore",
});
const url = `http://localhost:${PORT}/`;
for (let i = 0; ; i++) {
  try {
    await fetch(url);
    break;
  } catch {
    if (i > 50) throw new Error("vite preview did not start");
    await new Promise((r) => setTimeout(r, 200));
  }
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: withMotion ? "no-preference" : "reduce",
    });
    await page.goto(url, { waitUntil: "networkidle" });
    // Scroll through the page so IntersectionObserver-driven reveals fire.
    await page.evaluate(async () => {
      const step = window.innerHeight / 2;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    const file = path.join(outDir, `${name}-${width}${withMotion ? "-motion" : ""}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`✓ ${file}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
