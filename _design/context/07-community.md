# Design context — Section 5 "Community" (node 167:781) — FETCHED, do not re-fetch

- Header: intro LEFT (Noto 14/26 bodysm, w342 — real copy = Home.md "Smart Property Investment" para) + title RIGHT (PT Serif Regular 70/**85** lh≈1.21, w781) → grid `[21.375rem_1fr]`.
- Arrows (35px, same `.btn-arrow`): right-aligned between header and panels; default state shows LEFT=pearl (disabled), RIGHT=stygian (active).
- 3 panels: heading PT Serif 28 (display-md) + body Noto 13/23 (caption) + photo 400 tall (`lg:h-100`), square corners.
  - Panel arrangement staggered: panels 1&3 = text-then-photo; panel 2 = PHOTO-then-text (DOM order swap, no order classes).
  - Design default state: panels 1+2 expanded (~555 wide), **panel 3 COLLAPSED to 120px photo sliver** ending exactly at viewport edge → horizontal accordion.
- Interaction model implemented: `collapsed ∈ {0,1,2}`, exactly one collapsed on lg. RIGHT arrow: collapsed−− (pulls right content open; disabled at 0). LEFT arrow: collapsed++ (disabled at 2 — matches design's pearl left at default). Heading buttons (`aria-expanded`) collapse self; collapsed panel's text is `visibility:hidden` (untabbable + SR-hidden), so arrows are the canonical control.
- Animates `grid-template-columns` 0.4s — CONSCIOUS exception to transform-only rule (inherent to pattern); disabled under `prefers-reduced-motion` and below lg.
- Baseline (mobile AND no-JS): 3 equal/stacked panels, all content visible; arrows hidden (JS reveals them on lg).
- Copy: panels 1–2 real design copy; panel 3 "More freedom" lorem → replaced with About the complex.md "A Community Made for Lifestyle & Investment" sentence.
- Tokens: `--gallery-collapsed: 7.5rem`.
- Gap section top: location bottom 4773 → title 5034 (~260 incl. map overhang; mt-section is fine).
