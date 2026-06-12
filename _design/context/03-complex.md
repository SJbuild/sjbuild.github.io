# Design context — Section 3 "About the complex" (node 167:750) — FETCHED, do not re-fetch

- Full-bleed photo 1440×996. **Visible layer = Rectangle 17 = `complex-bg-raw1` (1491×1055 aerial street view)**, placed 1584×997 at (−63,−1) ≈ full image. The pano (raw2) is a covered layer — P1 pick corrected during P3.
- Card: 650×860 at x640 (right edge aligns with 1140 container right), **rounded 22px (`--radius-card`), frosted: `linear-gradient(58deg, rgba(233,242,255,.91), rgba(254,229,220,.91))` + backdrop-blur 30px (`--blur-frost`)** — ice/peach tokens reused at /91.
- Card paddings: content x≈57 in (p-14), title 40 from top.
- Title: PT Serif Regular **70px** (lh normal ≈1.33), w 545 → token `--text-display-lg` 70/1.33 (standard section-title size).
- Body: Noto **14px / lh 26px** (`--text-bodysm` 0.875rem/1.857), #666a7a, w 550. Copy = LOREM in design → replaced with About the complex.md intro paragraph.
- Spec table: 4 rows, pitch ~69px; label Noto 16px nevada; value **PT Serif Regular 34px #2774D9 (lagoon), right-aligned** → token `--text-stat`; dividers 1px **#f8f8f8** (`--color-hairline`). Values: 110 000 m² / 92 decares / 145 / 20.12.2025 ("m2" → "m²" typographic fix, logged).
- "Learn more" btn (170:1200) inside card below table, left-aligned — stub TODO(page).
- Card vertical: 68px top/bottom margins within section (py-17).
- Mobile derivation: photo in flow `aspect-3/2`, card overlaps `-mt-14` (frosted blur reads against photo edge), full-width.
