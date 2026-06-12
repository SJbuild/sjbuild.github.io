# Design context — Section 6 "About Us" (node 216:128) — FETCHED, do not re-fetch

- Section bg WHITE. Right column: title PT Serif Regular 70/122 at x799 top 5980; body Noto 17/29 (--text-lead) w 491 at 6124; "Learn more" btn (217:129) at 6314 (42 below body).
- Photo: `about-us.png` (1278×874 cutout aerial on white) placed at x **−193** (off-canvas left bleed), top 6182 (≈202 below section top). → lg: absolute, `left:-13%`, `width: min(89vw, 80rem)`, mobile: in-flow w-full.
- Ground shadow: **SVG asset** (was mislabeled png) → `public/images/about-ground.svg` (1.3 KB), placed 1976×427 at bottom, spans −128→1848 — absolute bottom, ~137% width, lg-only, aria-hidden, under the photo.
- White gradient overlay: `linear-gradient(−70deg, #fff 0%, transparent 69%)` over the whole image area (text sits on whitened right side) — lg-only, above photo below text.
- Body copy = design verbatim (= About us.md intro ✓ same text).
- Section min-height on lg ≈ 930px photo zone → `--aboutus-h: 58rem`.
- Z-order: ground < photo < gradient < text.
