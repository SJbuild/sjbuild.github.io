# Asset manifest (node ID → file → usage)

Raw sources: `_design/raw-assets/` (committed). Optimized: `public/images/<name>-<w>.{avif,webp,jpg}` via `npm run assets`.
Renders + unchosen candidates: `_design/raw-staging/` (gitignored, disposable). Selection method: aspect-ratio match between raw image and the placed dimensions from Figma metadata, confirmed visually via contact sheet.

| Figma node | Raw file | Source px | Section | Alt intent | Notes |
|---|---|---|---|---|---|
| 370:91 (fill "Group 1 copy") | hero.png | 3050×2593 | Hero bg | decorative (alt="") — heading carries meaning | CORRECTED P2: visible layer is the dusk villa row (raw1), not Image-2. White gradient done in CSS |
| 371:99 (fill "Image-3-1 1") | intro-villa.png | 929×823 | Intro box photo | "Modern villa with natural materials" | only source available; ~1.2× of placed size — slightly soft on retina |
| 372:94 (fill "Rectangle 17") | complex-bg.png | 1491×1055 | Complex section bg | decorative (alt="") | CORRECTED P3: visible layer is the aerial street view (raw1); pano was covered |
| 182:34 (fill) | villa-1.png | 556×527 | Villa card 1 | "Beach Lux Villa 1 exterior" | exact design crop, 1× only — soft on retina (no larger source exists) |
| 182:63 (fill) | villa-2.png | 1552×975 | Villa card 2 | "Villa 2 exterior" | good res |
| 373:198 (fill) | villa-3.png | 1724×912 | Villa card 3 | "Villa 3 exterior" | good res |
| 182:197 (fill) | arch-1.png | 556×400 | Community panel 1 | "Architectural detail" | 1× only |
| 182:199 (fill) | arch-2.png | 556×400 | Community panel 2 | 〃 | 1× only |
| 167:897 (fill) | arch-3.png | 556×400 | Community panel 3 | 〃 | 1× only (render was collapsed 120px state; raw is full) |
| 218:132 (fill "Image-6-1 1") | about-us.png | 1278×874 | About Us photo | "Villa at dusk with lit interior" | matches placed size exactly |
| 373:130 (fill "Image 7 1") | cta-bg.png | 1647×955 | CTA bg | decorative (alt="") | ratio 1.724 matches placed 1880×1090; scrim in CSS |
| 167:605 / 167:857 | brand/logo-dark.png, brand/logo-white.png | 4096×~1340 | Header / Footer logo | "SJ Build" | image fills (not vector); emitted as `public/images/logo-{dark,white}.png` @512w. SVG exports were raster-embedding (300KB) — rejected |
| 216:90 | map.svg → `public/images/map.svg` | vector | Location map | descriptive alt | svgo'd 58→30 KB |
| 167:733 | icons/icon-area.svg | vector | Villa specs | with sr-only text | |
| 167:738 / 167:742 / 167:746 | **MISSING** (bed / bath / garage) | — | Villa specs | — | export returns null (tried parents + child-ID guesses). Recovery: P4 `get_design_context` usually inlines small vectors — take paths from there; fallback: Lucide equivalents at 16px. Log either way |
| 167:866/868/870/874 | icons/icon-{twitter,facebook,instagram,linkedin}.svg | vector | Footer socials | aria-label on links | |
| 167:878/881/884 | icons/icon-{phone,email,location}.svg | vector | Footer contact | aria-hidden + visible text | |
| 373:154 | icons/flag-bg.svg | vector | Phone field prefix | aria-hidden decorative | |
| 373:158 | icons/chevron-down.svg | vector | Phone field | aria-hidden decorative | |
| 373:169 | icons/icon-check.svg | vector | Consent checkbox | decorative (real `<input type=checkbox>` underneath) | |
| 182:184 / 182:187 | icons/arrow-left.svg, icons/arrow-right.svg | vector | Carousel + gallery controls | aria-label on buttons | |

Total `public/images/`: ~9.5 MB across all 126 responsive variants (page loads only a small subset per viewport). Hero AVIF: 75 KB @1440 / 107 KB @1808 — within ≤250 KB budget.
