# SJ Build Homepage — Build Plan (resumable)

**Deliverable:** Production static one-page site (EN) for SJ Build luxury seaview villas (Lozenets, Bulgaria).
**Stack:** Vite (vanilla-ts) + Tailwind CSS v4 (`@tailwindcss/vite`, tokens in `@theme`) + TypeScript modules. npm. No framework.
**Design source:** Figma file `pclbSnXjtzUlphc2DN1koQ`, frame `167:596` "SJ-Build-HomePage-Design-Small" (1440×8298, desktop-only comp; responsive derived mobile-first).
**Reference:** `_design/screenshots/full-page.png`. **Approved copy:** `website-docs/en/*.md`.
**Quality bar:** semantic HTML, WCAG AA, mobile-first, Lighthouse ≥90 ×4 categories, zero magic numbers (all design values via `@theme` tokens).

---

## RESUME PROTOCOL — read before doing anything

1. Read this file top to bottom. Do not skim the Decisions Log or Content Map.
2. Run `git log --oneline -10` and `git status` (uncommitted files ⇒ previous session died mid-phase; re-run that phase from its first unticked step).
3. Find the FIRST unchecked phase below. Verify the PREVIOUS phase's done-criterion actually passes before starting.
4. Figma design context is fetched EXACTLY ONCE per section. If `_design/context/<NN>-<name>.md` exists, that section's context was already fetched — READ THE FILE, never call `get_design_context` for that node again.
5. Asset inventory: `_design/assets-manifest.md` (node ID → file → usage). Raw downloads: `_design/raw-assets/`. Optimized: `public/images/`.
6. Figma MCP tools are deferred in this harness: load via ToolSearch (`select:mcp__plugin_figma_figma__get_design_context,mcp__plugin_figma_figma__download_assets,mcp__plugin_figma_figma__get_screenshot`) and invoke the `figma-to-html` skill once per session before the first Figma call.
7. Phase exit ritual (MANDATORY — this is what makes the plan resumable): tick step checkboxes, fill a Decisions Log row if any judgment was made, then `git add -A && git commit -m "P<n>: <summary>"`.
8. Approved copy: `website-docs/en/*.md`. The Content Map below decides every string. Never invent copy; never ship lorem ipsum.

## Status legend

`[ ]` not started · `[~]` in progress (see step checkboxes + git status) · `[x]` done & verified

---

## Phases

### P0 — Scaffold, toolchain, tokens (M)
- [ ] `git init` + `.gitignore` (`node_modules/`, `dist/`, `.DS_Store`, `_design/verify/`)
- [ ] Scaffold by hand (no `npm create vite` — dir not empty): `package.json`, `tsconfig.json` (strict, bundler resolution, noEmit), `vite.config.ts` (tailwindcss plugin), `index.html` shell, `src/main.ts`, `src/styles/main.css`
- [ ] `npm i -D vite typescript tailwindcss @tailwindcss/vite sharp playwright @axe-core/playwright svgo html-validate` + `npm i @fontsource/pt-serif @fontsource/noto-sans` + `npx playwright install chromium`
- [ ] `main.css`: `@import "tailwindcss"` + full `@theme` (see Token Architecture) + base layer (fonts incl. cyrillic subsets, body sand/nevada/sans, h1–h3 display/stygian, global `:focus-visible`, smooth scroll under `prefers-reduced-motion: no-preference`, `scroll-padding-top`, `html.js [data-reveal]` hidden state)
- [ ] `index.html` shell: `lang="en"`, provisional title/desc, skip link, fixed `<header>` placeholder, `<main>` with 8 section placeholder comments, footer placeholder, module script
- [ ] `scripts/optimize-images.mjs` (sharp → AVIF/WebP/JPEG at 2560/1920/1440/1024/768/480 capped at source width), `scripts/screenshot.mjs` (Playwright → `_design/verify/`, width + reduced-motion flags), `scripts/a11y.mjs` (axe, fail on critical/serious). npm scripts: dev/build/preview/assets/shoot/a11y
- [ ] **Done:** `npm run build` exits 0; shell screenshot renders sand bg + PT Serif heading; commit `P0`

### P1 — Asset batch: download + optimize (M–L) — the ONLY phase calling `download_assets`
- [ ] Photos → `_design/raw-assets/` (kebab names): hero `370:91`; intro-villa `371:99` (fallback inner `371:104`); complex-bg `372:94`; villa-card-1 `182:34`, villa-card-2 `182:63`, villa-card-3 `373:198`; arch-1 `182:197`, arch-2 `182:199`, arch-3 `167:897`; about-us `218:132` (fallback `376:277`); cta-bg `373:130`
- [ ] SVGs: logo `167:605` + footer variant `167:857`; map `216:90`; spec icons `167:733/167:738/167:742/167:746`; social `167:866/167:868/167:870/167:874`; footer-contact `167:878/167:881/167:884`; bg-flag `373:154`; chevron `373:158`; check `373:169`; arrows `182:184/182:187`
- [ ] Failure policy: retry once; then mark `MISSING` in manifest + fallback note (solid `--color-boxes` block) and continue
- [ ] `npm run assets`; `npx svgo` over SVGs (keep viewBox). Map + logo → `public/images/`; small icons stay in `_design/raw-assets/icons/` for inlining
- [ ] Write `_design/assets-manifest.md` (`node | raw | optimized | section | alt intent`); log total `public/images/` weight
- [ ] **Done:** every manifest row resolves on disk; 3 spot-checks viewed; commit `P1`

### P2 — Hero + Header/Nav — node `167:597` (L, solo)
- [ ] `get_design_context 167:597` → save verbatim `_design/context/01-hero-header.md` BEFORE coding
- [ ] Token calibration: lock H1/H2/nav/button real sizes, radii, header height into `@theme`; log in Decisions Log (all later sections reuse)
- [ ] Contrast decision: stygian text on coral (6.7:1) vs `--color-coral-deep`; record; applies site-wide
- [ ] Fixed transparent `<header>`: inline logo SVG, `<nav aria-label="Main">` → `#home #complex #villas #location #about-us #contacts`, BG toggle stub, coral Get a Quote → `#contacts`; `<lg`: hamburger (`aria-expanded`/`aria-controls`) + drawer (focus trap, Esc, scroll lock, closes on anchor click)
- [ ] `src/modules/nav.ts` (drawer + scrolled solid-bg state)
- [ ] Hero `<section id="home">`: `<picture>` AVIF/WebP/JPEG `sizes="100vw"` `fetchpriority="high"` not lazy; stygian gradient scrim (subtitle ≥4.5:1); `<h1>` "Own a Luxury Private Seaview Villa"; subtitle per Content Map; ghost Learn more → `#intro`
- [ ] **Done:** pixel-faithful 1440, clean 390, drawer keyboard-operable, tokens locked, context saved; commit `P2`

### P3 — Intro box + About the complex — nodes `167:623`, `167:750` (M)
- [ ] Fetch `167:623` → `_design/context/02-intro-box.md` → build `#intro`: rounded `bg-boxes` box; ≥lg 2-col (text | image bleeding to edge); H2 "Where Privacy Meets Modern Luxury"; copy per Map; coral button → `#contacts`; mobile: image above text
- [ ] Fetch `167:750` → `_design/context/03-complex.md` → build `#complex`: full-bleed photo + right white card: H2 "About the complex", intro copy, `<dl>` spec table (Land area 110 000 m² / Park environment and green areas 92 decares / Properties 145 / Start of construction 20.12.2025) hairline dividers; Learn more stub; mobile: photo then full-width card
- [ ] **Done:** both match 1440 / stack at 390; real copy; 2 context files; commit `P3`

### P4 — Villas carousel — node `167:635` (L, solo)
- [ ] Fetch `167:635` → `_design/context/04-villas.md`
- [ ] `#villas`: H2 + right-aligned intro; `<ul role="list">` scroll-snap track; 3 `<li><article>` cards from ONE pattern: image (aspect token, lazy) / `<h3>` name + Get a quote → `#contacts` / clamped description + Learn more stub / spec row (inline SVG `aria-hidden` + sr-only expansions: "250 m² built-up area", "3 bedrooms", "2 bathrooms", "1 garage")
- [ ] Cards are static HTML (SEO/no-JS); `src/data/villas.ts` = canonical data consumed by carousel.ts (markup generated once, pasted static) — log decision
- [ ] `src/modules/carousel.ts`: scroll-snap base; JS adds prev/next (aria-label, scrollBy one card, disabled at ends), arrow keys, auto-hide when no overflow. No autoplay. View all Villas stub
- [ ] Responsive: mobile ~85vw cards with peek + snap; ≥xl three visible
- [ ] **Done:** matches design; touch/wheel/buttons/keyboard all work; plain scroll without JS; commit `P4`

### P5 — Location + About Us — nodes `167:772`, `216:128` (M)
- [ ] Fetch `167:772` → `_design/context/05-location.md` → `#location`: 2-col ≥lg; H2 "A Prime Location with a Sea View" (normalize Cyrillic А→Latin — log); Location.md intro; Learn more stub; map = `public/images/map.svg` `<img>` explicit dims lazy descriptive alt
- [ ] Fetch `216:128` → `_design/context/06-about-us.md` → `#about-us`: photo bleeding off-canvas left + curved white overlay (inline SVG or CSS mask, `aria-hidden`); right: H2 "About Us", About us.md intro, Learn more stub; mobile: photo above text, curve simplified
- [ ] **Done:** faithful 1440 / stacked 390; map <150 KB; 2 context files; commit `P5`

### P6 — Community expanding gallery — node `167:781` (M–L)
- [ ] Fetch `167:781` → `_design/context/07-community.md`
- [ ] `#community`: centered H2; intro per Map; 3 panels (Architectural Excellence / Exclusive Amenities / More freedom) each heading-button + paragraph + photo
- [ ] `src/modules/gallery.ts`: ≥lg expanding gallery (active ~555px photo, inactive ~120px); `aria-expanded` heading buttons; arrows cycle; collapsed text untabbable + `aria-hidden`. Exception to transform-only rule: animates `grid-template-columns` ≤400ms, disabled under reduced-motion — log
- [ ] Baseline (mobile AND no-JS): all panels stacked fully expanded
- [ ] **Done:** click/keyboard/arrows work; stacked baseline verified; reduced-motion shot; commit `P6`

### P7 — CTA + Contact form — node `373:129` (L, solo)
- [ ] Fetch `373:129` → `_design/context/08-cta-form.md`
- [ ] `#contacts`: full-bleed dusk photo + stygian scrim; H2 "Contact Us for More Information"; sub "Schedule a viewing today and experience luxury firsthand."
- [ ] White card `<form novalidate>`: Full name* (`autocomplete=name`) / Email* (`type=email`) / Phone* — static decorative flag+"+359" prefix (chevron `aria-hidden`; multi-country = TODO(intl)) + `type=tel` `autocomplete=tel-national` `inputmode=tel` / Message* textarea / required consent checkbox w/ Privacy Policy stub link / honeypot / coral submit per P2 contrast decision
- [ ] `src/modules/form.ts`: submit-time validation, per-field on blur after first attempt; inline errors via `aria-describedby` + `aria-invalid`, focus first invalid. No backend (honest): `console.table(payload)` + `mailto:sales@sjbuild.bg` prefilled + success note that does NOT claim server delivery (mention phone fallback). `// TODO(backend):` block + Handover entry
- [ ] **Done:** accessible inline errors; valid submit → mailto + honest confirmation; AA contrast; commit `P7`

### P8 — Footer + global behaviors — node `167:852` (M)
- [ ] Fetch `167:852` → `_design/context/09-footer.md` (last of 9 budgeted calls)
- [ ] `<footer>` stygian: white logo; `<nav aria-label="Footer">` same anchors; `<address>`: `tel:+359897700770`, `mailto:sales@sjbuild.bg`, "Varna, str. Kiril i Metodii 43" + icons (design copy wins — Contacts.md conflict logged); social links w/ aria-labels (FB/IG/LinkedIn hrefs from Contacts.md, Twitter TODO); Privacy/Cookie stubs; "© 2025 SJ Build. All rights reserved." ("@"→© logged)
- [ ] `src/modules/reveal.ts`: IO toggles `is-visible` on `[data-reveal]`; transform/opacity only; hidden state only under `html.js`; skipped under reduced-motion; sweep page adding `data-reveal`
- [ ] `nav.ts` scrollspy → `aria-current` on active link
- [ ] `src/modules/lang.ts`: BG stub `aria-disabled` + `// TODO(i18n)` referencing `website-docs/bg/*`
- [ ] **Done:** footer matches; scrollspy tracks 6 anchors; reveal honors reduced-motion/no-JS; commit `P8`

### P9 — SEO, meta, content audit (S–M)
- [ ] `<head>`: title "Luxury Villas with a Sea View for Sale | Exclusive Investment Opportunities"; meta desc + keywords (Meta md Home); canonical; OG/Twitter tags; `og:image` 1200×630 from hero (sharp addendum); favicons from logo SVG (svg/32px/180px); `theme-color #1D1E22`
- [ ] `public/robots.txt` + single-URL `public/sitemap.xml`
- [ ] JSON-LD `RealEstateAgent` (footer contact data) + `WebSite`
- [ ] Heading audit (one h1, sections h2, cards h3); landmarks (`header/nav/main/section[aria-labelledby]/footer`)
- [ ] Gate: `grep -ri "lorem" index.html src/` → empty
- [ ] **Done:** gates pass; JSON-LD parses; commit `P9`

### P10 — QA hardening & final gates (M–L)
- [ ] `npm run build` 0 errors → preview
- [ ] Lighthouse desktop + mobile vs preview → `_design/verify/`; iterate to **≥90 ×4 categories ×2 form factors**
- [ ] `npm run a11y` → 0 critical/serious; manual keyboard walkthrough (skip link, drawer, carousel, gallery, form errors, focus visible); 200% zoom
- [ ] Responsive sweep shots 360/390/768/1024/1280/1440/1920 → view each, fix breakage; reduced-motion run
- [ ] Visual parity: 1440 full-page shot vs `_design/screenshots/full-page.png`; log deviations as intentional or fix
- [ ] `npx html-validate index.html`; console clean; no 404s; budgets (hero AVIF ≤~250 KB, initial payload ≤~1.5 MB)
- [ ] `grep -rn "TODO" index.html src/` → transcribe all into Handover register below
- [ ] **Done:** all gates green; final commit; tag `v1.0.0`; add `## DONE` banner here

---

## Token Architecture (`@theme` in `src/styles/main.css`)

```css
--color-stygian: #1D1E22;  /* Stygian Primary — headings, header/footer bg, scrims */
--color-nevada:  #666A7A;  /* Grey Nevada — body text (5.4:1 white, 4.9:1 boxes) */
--color-boxes:   #F2F5F8;  /* Boxes — light card/panel bg */
--color-coral:   #FF7F50;  /* Coral Secondary — CTA bg ONLY (white text on it 2.5:1 FAILS AA) */
--color-lagoon:  #2774D9;  /* Lagoon Blue Secondary — inline links (4.6:1 on white) */
--color-sand:    #F4F4F4;  /* Wild Sand Primary — page bg */
--font-display: "PT Serif", Georgia, "Times New Roman", serif;
--font-sans: "Noto Sans", system-ui, sans-serif;
/* Fluid type: PROVISIONAL clamps, locked to Figma px in P2 (1440 = design size) */
--text-display-2xl / -xl / -lg, --text-lead (+ line-heights)
--container-content: 71.25rem;  /* 1140 = 1440 − 2×150 */
--spacing-gutter: clamp(1.25rem, 4vw, 2.5rem);
--spacing-section: clamp(4.5rem, 3rem + 5.5vw, 8rem);  /* Figma 90–130 rhythm */
--spacing-header: 5.5rem (confirm P2);
--radius-box: 1.5rem (confirm P3); --radius-btn: from P2;
--aspect-card-img: 556/527; --aspect-hero: 1440/1040;
```

Conventions: Tailwind default breakpoints, mobile-first (`md` first 2-col, `lg` desktop nav, `xl` full comp, ≥1440 gains margin only). Container = `mx-auto max-w-content px-gutter`; full-bleed sections put `<img>` at section level, container inside. No raw hex/px in markup; structural px → ratios/clamps/fractions; arbitrary values only as `var(--token)`. Contrast matrix: nevada/white ✓, nevada/boxes ✓, stygian/white ✓, lagoon/white ✓, **white/coral ✗ → stygian-on-coral 6.7:1 ✓ default**.

## Verification (every phase)

`npm run build` 0 → `npm run shoot` (1440+390) → view PNGs vs matching region of `_design/screenshots/full-page.png` → keyboard pass on new interactives → tick boxes + Decisions Log → commit. Interactive phases (P2/4/6/7/8) add: `npm run a11y`, reduced-motion shot, no-JS sanity note.

## Decisions Log

| Phase | Decision | Rationale |
|---|---|---|
| plan | Git used for phase checkpoints (fresh local repo, no remote) | User requires resumability; commits = durable per-phase state. Remove `.git` if unwanted. |
| plan | Buttons default to Stygian text on coral (pending P2 visual check) | White on #FF7F50 = 2.5:1, fails WCAG AA; stygian on coral = 6.7:1 |
| plan | Footer contact = design copy (+359 897 700 770 / sales@sjbuild.bg / Varna) | Design-copy-wins rule; conflicts with Contacts.md (+359 889 173 654 / sgbuildbg@gmail.com / Lozenets) — **client must confirm** |
| plan | S5 title Cyrillic "А/а" → Latin; footer "@ 2025" → "© 2025" | Design typos |
| plan | No manual font preload (fontsource hashed files); `font-display: swap` | Revisit at P10 if LCP suffers |
| plan | Progress tracked in this file only (no harness task list) | Survives session death; single source of truth |

## Content Map (final string ← source)

| Location | Copy | Source |
|---|---|---|
| Hero H1 | "Own a Luxury Private Seaview Villa" | design |
| Hero subtitle | "Our exclusive collection of luxury villas offers the perfect blend of privacy, direct sea view, elegance, and premium investment value." | Home.md intro |
| Intro H2/body | "Where Privacy Meets Modern Luxury" / "Our villas combine contemporary design with natural materials…" | design / Home.md "A Private Space Just for You" |
| Villas H2/intro | "Explore Our Luxury Villas" / design intro ("Each residence is crafted…" — real) | design |
| Villa cards | names + specs from design; descriptions: replace lorem w/ About the complex.md amenity copy | design + md |
| Complex H2/body/table | "About the complex" / About the complex.md intro / design table verbatim | design + md |
| Location H2/body | "A Prime Location with a Sea View" (fixed А) / design body (real) else Location.md | design / md |
| Community | title + 3 headings from design; intro from About the complex.md; "More freedom" body from "A Community Made for Lifestyle & Investment" | design + md |
| About Us body | "We are a team of industry professionals…" | design (= About us.md) |
| CTA | "Contact Us for More Information" / "Schedule a viewing today and experience luxury firsthand." | design (= Home.md) |
| Form | labels/consent verbatim from design | design |
| Footer | contact per design (conflict logged); "© 2025 SJ Build. All rights reserved." | design (fixed) |
| Meta | Home entries | Meta Titles…md |

## Handover register (filled at P10)

_(pending — backend for form, subpages for Learn more/View all/Privacy/Cookie, BG locale, social hrefs, intl phone dropdown)_
