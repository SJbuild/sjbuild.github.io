# Design context — Section 5 "Community" (node 167:781) — FETCHED, do not re-fetch

> **P18 UPDATE:** the horizontal-accordion interaction model described below (one panel
> collapsed to a 120px sliver, JS-driven `grid-template-columns`) was replaced by a
> scroll-snap carousel — see the `## P18` section at the bottom. Panel content/copy/
> measurements above are still accurate; only the interaction mechanism changed.

- Header: intro LEFT (Noto 14/26 bodysm, w342 — real copy = Home.md "Smart Property Investment" para) + title RIGHT (PT Serif Regular 70/**85** lh≈1.21, w781) → grid `[21.375rem_1fr]`.
- Arrows (35px, same `.btn-arrow`): right-aligned between header and panels; default state shows LEFT=pearl (disabled), RIGHT=stygian (active).
- 3 panels: heading PT Serif 28 (display-md) + body Noto 13/23 (caption) + photo 400 tall (`lg:h-100`), square corners.
  - Panel arrangement staggered: panels 1&3 = text-then-photo; panel 2 = PHOTO-then-text (DOM order swap, no order classes).
  - Design default state: panels 1+2 expanded (~555 wide), **panel 3 COLLAPSED to 120px photo sliver** ending exactly at viewport edge → horizontal accordion.
- ~~Interaction model implemented: `collapsed ∈ {0,1,2}`, exactly one collapsed on lg. RIGHT arrow: collapsed−− (pulls right content open; disabled at 0). LEFT arrow: collapsed++ (disabled at 2 — matches design's pearl left at default). Heading buttons (`aria-expanded`) collapse self; collapsed panel's text is `visibility:hidden` (untabbable + SR-hidden), so arrows are the canonical control.~~ Superseded by P18 (the `visibility:hidden` collapsed-panel text still reserved its layout height, producing a blank-gap bug).
- ~~Animates `grid-template-columns` 0.4s — CONSCIOUS exception to transform-only rule (inherent to pattern); disabled under `prefers-reduced-motion` and below lg.~~ Removed in P18 along with the accordion CSS.
- Baseline (mobile AND no-JS): 3 equal/stacked panels, all content visible; arrows hidden (JS reveals them on lg). (P18: now true at ALL widths via the carousel's no-JS stacked/scrollable fallback.)
- Copy: panels 1–2 real design copy; panel 3 "More freedom" lorem → replaced with About the complex.md "A Community Made for Lifestyle & Investment" sentence.
- ~~Tokens: `--gallery-collapsed: 7.5rem`.~~ Removed in P18.
- Gap section top: location bottom 4773 → title 5034 (~260 incl. map overhang; mt-section is fine).

## P18 — Carousel reinterpretation + 4th panel (2026-06-15)

The client's wider reference frame (node `373:274`, "Section 5") shows all 4 "Box Image N" panels at full
~555×400px size with rounded (22px) corners and no collapse, plus prev/next arrows — the same shape as the
already-implemented Villas carousel (`#villas-track`). Reinterpreted both Figma references as ONE pattern: a
horizontal scroll-snap carousel where overflowing cards naturally "peek" at the viewport edge (the 120px sliver in
`167:781` is just a peeking 4th card, not a collapsed 3rd one).

- **Mechanism**: `<div data-gallery>` grid → `<ul data-carousel-track id="community-gallery">` (scroll-snap,
  `snap-x snap-mandatory`, `overflow-x-auto`, `.bleed-track .no-scrollbar`); each panel → `<li
  class="w-(--gallery-card-w) shrink-0 snap-start">`. `src/modules/carousel.ts` generalized to handle multiple
  `[data-carousel-controls]` blocks (villas + community) via `aria-controls` → `getElementById`.
- **Tokens**: removed `--gallery-collapsed: 7.5rem`; added `--gallery-card-w: min(34.75rem, 85vw)` (same value as
  `--villa-card-w`, named separately per the one-token-per-context convention).
- **4th panel** (new): Figma node `373:261` ("Box Image 4", metadata id `373:256`) — a rooftop terrace with jacuzzi,
  lounge seating, and garden planting (`arch-4.png`, 556×400, matches arch-1/2/3 exactly). Heading "Private Outdoor
  Living" / "Лично външно пространство". Rather than literally duplicate panel 2's "Exclusive Amenities" (as the
  Figma reference does), the existing 4-bullet amenities copy (private yard, BBQ, parking, summer garden + rooftop
  jacuzzi) was split: panel 2 narrowed to BBQ + parking, panel 4 covers private yard + summer garden/rooftop jacuzzi.
- **Visual fix**: all 4 images now get `rounded-card` (22px) — `373:274` shows rounded corners on every gallery
  image, which arch-1/2/3 previously lacked.
