# Design context — Header/Hero (node 167:597) — FETCHED, do not re-fetch

## Measurements @1440 (from get_design_context, exact)
- Nav bar: x=150 w=1140 y=43 h=55. Flex row gap 35: Logo | pill nav | "BG" | button.
- Logo: 102.35×33.63, IMAGE fill = dark logo (`public/images/logo-dark.png`).
- Pill nav: w=787, bg **#f7f7f7** (token `--color-mist`), rounded-[44px] (pill), pl-47 pr-46 py-18, gap 57, centered links.
- Nav links: Noto Sans Regular **14px**, #1d1e22, h 19 (lh≈1.36). Order: Home, About the complex, Villas, Location, About us, Contacts.
- "BG" toggle: plain text 14px #1d1e22, 21×19.
- Button "Get a quote": **bg #1d1e22, white text 14px Noto Regular, rounded-[77px] (pill), 126×55, px-22 py-18**. → site-wide `.btn-dark`. (No coral buttons in design!)
- H1: **PT Serif Bold 89px**, leading normal (212px / 2 lines → lh ≈ 1.19), #1d1e22, centered, max-w 958, top 147 (≈49px below header).
- Subtitle: Noto Sans Regular **17px / lh 29px** (1.706), #666a7a, centered, max-w 540, top 398 (39px below H1).
- "Learn more" hero button: 141×55 at y=492 (37px below subtitle), centered — same `.btn-dark` style (instance of Get-a-quote family).

## Hero background (composite)
- Photo = `hero.jpg` (Image-2 1, 1808×1600) placed 1643×1454 at (−63,−368) ⇒ visible crop ≈ source x 69–1655, y 405–1550 → object-position ≈ **50% 65%**, object-cover.
- Under it: second photo layer (Group 1 copy, dusk row) — fully covered, ignored.
- Overlay: layer 1440×**678** at top with `linear-gradient(180deg, #fff 17.7%, rgba(255,253,253,0) 100%)` — **WHITE fade from top** (text is dark on light sky). NOT a dark scrim.
- Hero frame: 1440×1040 (aspect 1440/1040), square corners.

## Decisions locked here (apply site-wide)
- `--text-display-2xl: clamp(2.75rem, 1.1rem + 5.5vw, 5.5625rem)`, lh 1.19, **font-bold** for H1.
- `--text-lead: clamp(1rem, 0.95rem + 0.25vw, 1.0625rem)`, lh 1.7 (17/29 design).
- Buttons: `.btn` + `.btn-dark` component classes, rounded-full pills, px-6 py-4.5 text-sm. `--radius-btn` token DROPPED (pills are rounded-full).
- `--color-mist: #f7f7f7` added (nav pill bg).
- `--spacing-header: 6rem` (43px top offset + 55px bar ≈ 96–98px).
- `--hero-h: clamp(42rem, 72.25vw, 65rem)` (1040/1440 = 72.2vw).
- `--container-hero-title: 60rem` (958px), `--container-measure: 34rem` (540px subtitle).
- Header fixed; transparent over hero (dark logo/links work on white gradient); `.is-scrolled` → bg-sand/90 + blur + shadow.
- Contrast: stygian-on-white & white-on-stygian both pass AA easily. Coral reserved for accents only (unused in header/hero).

## Asset URLs from this fetch (expire in 7 days; already downloaded in P1 — hero.jpg, logo-dark)
No new assets needed.
