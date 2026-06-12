# Design context — Section 4 "Location" (node 167:772) — FETCHED, do not re-fetch

- Title: PT Serif Regular 70 (display-lg), w 599 (2 lines), at container left, top 4362. Design literal "А Prime Location with а Sea View" — **Cyrillic А/а normalized to Latin** (logged).
- Body: Noto 14/26 (--text-bodysm), nevada, w 550. REAL design copy used verbatim: "Located just 1 km away from the center of Lozenets…" (Location.md kept for subpage).
- "Learn more" btn (170:1202) 25px below body, left-aligned — stub TODO(page).
- Map: `public/images/map.svg` (30 KB svgo'd; labels Black Sea / Lozenets City Center / SJ Build / beaches are inside the SVG). 738×616 at x705→1443 — **bleeds to right viewport edge** → `@utility bleed-right` (negative right margin = max(gutter, (100vw−content)/2)).
- Vertical: map top is 205px ABOVE title top; bottoms roughly align → lg grid `items-end`, text col gets pb.
- Section touches complex photo bottom on lg (`lg:mt-0`), mt-section on mobile. Mobile: text first, map below full-width.
