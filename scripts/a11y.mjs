/**
 * Build, serve, and run axe-core against the page at desktop and mobile
 * viewports. Exits non-zero on any critical or serious violation.
 */
import { execSync, spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AxeBuilder } from "@axe-core/playwright";
import { chromium } from "playwright";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4319;

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

const browser = await chromium.launch();
let failed = false;
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    const { violations } = await new AxeBuilder({ page }).analyze();
    console.log(`\n=== axe @ ${width}px — ${violations.length} violation type(s) ===`);
    for (const v of violations) {
      console.log(`[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
      for (const n of v.nodes.slice(0, 5)) console.log(`   ${n.target.join(" ")}`);
      if (v.impact === "critical" || v.impact === "serious") failed = true;
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.kill();
}

process.exit(failed ? 1 : 0);
