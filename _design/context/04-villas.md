# Design context — Section 2 "Villas" (node 167:635) — FETCHED, do not re-fetch

- Header: title PT Serif Regular 70 (display-lg) w572 left; right col: intro Noto **24/38** (`--text-leadlg`) w546 + "View all Villas" btn-dark right-aligned below (y2172); arrows row right-aligned below that (y2263); cards y2334.
- Cards ×3: 556 wide, pitch ~584 (gap ~28). Card = image (aspect 556/527, rounded-t-22) + panel `#f2f5f8` (Boxes token — its actual role) rounded-b-22, h332.
- Card 3 overflows viewport (1315+556=1871>1440) — **carousel peek is the design's own desktop state**; scroll-snap at all widths is faithful.
- Panel: px≈37 (p-9); name row 18 below image: name PT Serif Regular **28px** (`--text-display-md` recalibrated) + `.btn-dark` Get a quote (126×55); description Noto **13/23** (`--text-caption`) nevada w486, inline bold underlined "Learn more" (design typo "Leran more" fixed); spec row: 4 items gap~24, icon+13px stygian text, icon-text gap 6.
- Spec icons are **CORAL** (#ff7f50) — area/bed/bath/garage; recovered as SVGs in this fetch (download_assets had returned null): `icons/icon-{bed,bath,garage}.svg`. icon-area needs junk rects stripped when inlining (artboard pollution); same for arrows.
- Arrows: 35px circles — active = stygian bg + white arrow; inactive = **#b4bbd4** (`--color-pearl`) + white arrow → `.btn-arrow` with `:disabled`.
- Specs per design: 250m² / 3 bed / 2 bath / 1 garage (identical on all cards); name "Beach Lux Villa 1" identical on all (component instances) → numbered 1/2/3 per Figma layer names, logged.
- Descriptions are lorem → replaced with real copy derived from About the complex.md (architecture/amenities/community phrasing).
- Section top gap: ~82px (mt-section). Track: full-bleed with container-aligned padding (`.bleed-track`), `--villa-card-w: min(34.75rem, 85vw)`, snap-start, hidden scrollbar, native keyboard scroll (track tabindex=0) + JS prev/next with disabled-at-ends; smooth scroll only when motion allowed.
- DEVIATION from plan: `src/data/villas.ts` skipped — static markup is the single source; a data file consumed by nothing is dead weight (logged).
