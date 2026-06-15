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
- [x] `git init` + `.gitignore` (`node_modules/`, `dist/`, `.DS_Store`, `_design/verify/`)
- [x] Scaffold by hand (no `npm create vite` — dir not empty): `package.json`, `tsconfig.json` (strict, bundler resolution, noEmit), `vite.config.ts` (tailwindcss plugin), `index.html` shell, `src/main.ts`, `src/styles/main.css` (+ `src/vite-env.d.ts` — TS6 requires vite/client types for CSS side-effect imports)
- [x] `npm i -D vite typescript tailwindcss @tailwindcss/vite sharp playwright @axe-core/playwright svgo html-validate` + `npm i @fontsource/pt-serif @fontsource/noto-sans` + `npx playwright install chromium` (installed: vite 8, tailwind 4.3, ts 6.0)
- [x] `main.css`: `@import "tailwindcss"` + full `@theme` (see Token Architecture) + base layer (fonts incl. cyrillic subsets, body sand/nevada/sans, h1–h3 display/stygian, global `:focus-visible`, smooth scroll under `prefers-reduced-motion: no-preference`, `scroll-padding-top`, `html.js [data-reveal]` hidden state). Fonts imported in `src/main.ts` (fontsource files include cyrillic unicode-range subsets)
- [x] `index.html` shell: `lang="en"`, provisional title/desc, skip link, fixed `<header>` placeholder, `<main>` with 8 section placeholder comments, footer placeholder, module script
- [x] `scripts/optimize-images.mjs` (sharp → AVIF/WebP/JPEG at 2560/1920/1440/1024/768/480 capped at source width), `scripts/screenshot.mjs` (Playwright → `_design/verify/`, builds+previews itself on port 4317, default emulates reduced-motion for determinism, `--motion` to opt out), `scripts/a11y.mjs` (axe @1440+390, fail on critical/serious, port 4319). npm scripts: dev/build/preview/assets/shoot/a11y
- [x] **Done:** `npm run build` exits 0; shell screenshot verified (PT Serif heading + Noto Sans body + sand bg + token utilities working); commit `P0`

### P1 — Asset batch: download + optimize (M–L) — the ONLY phase calling `download_assets`
- [x] Photos → `_design/raw-assets/` — all 11 downloaded; visible fill identified per node by aspect-ratio match vs placed dims + contact-sheet view (renders + rejects in gitignored `_design/raw-staging/`)
- [x] SVGs: map + social + footer-contact + flag + chevron + check + arrows + area icon OK. Logo nodes are IMAGE FILLS → took raw PNGs (dark + white variants) instead of raster-embedding SVG
- [x] Failure policy applied: bed `167:738` / bath `167:742` / garage `167:746` icons return null export (retried + child-ID guesses) → marked MISSING in manifest; recover from P4 design-context inline SVG, fallback Lucide 16px
- [x] `npm run assets` → 123 variants; svgo over icons; map.svg 58→30 KB → `public/images/map.svg`; logos → `public/images/logo-{white,dark}.png` @512w
- [x] `_design/assets-manifest.md` written; public/images ≈ 9.5 MB total variants; hero AVIF 75–107 KB ≤ budget
- [x] **Done:** manifest rows resolve; contact sheet + hero/cta sizes verified; commit `P1`

### P2 — Hero + Header/Nav — node `167:597` (L, solo)
- [x] Context fetched → `_design/context/01-hero-header.md` (distilled facts + all measurements)
- [x] Tokens locked: display-2xl 89px/1.19 bold; lead 17px/1.7; `--color-mist #f7f7f7` (nav pill); `--spacing-header 6rem`; `--hero-h`; hero-title/measure containers; `--radius-btn` dropped → pills are `rounded-full` (`.btn`/`.btn-dark` components)
- [x] Contrast: moot — design buttons are stygian bg + white text (16:1). Coral appears nowhere in header/hero
- [x] Fixed header: dark logo PNG (logo is an image fill, not vector), pill nav (bg-mist), BG stub, `.btn-dark` Get a quote; mobile hamburger + full-screen drawer (focus trap, Esc, scroll lock, closes on anchor click, auto-reset at ≥lg)
- [x] `src/modules/nav.ts` (drawer + `.is-scrolled` sand/blur/shadow state)
- [x] Hero: design is WHITE gradient over photo w/ DARK text (not dark scrim). Visible photo layer = `hero-raw1` dusk villa row (P1 pick corrected, variants regenerated 480–2560). Desktop: absolute composite + white fade top 2/3. Mobile: restructured to text-on-white above in-flow `aspect-4/3` photo with seam fade (readability). Preload + fetchpriority on hero image
- [x] **Done:** 1440 matches comp; 390 clean; axe 0 violations @1440+390; context saved; commit `P2`

### P3 — Intro box + About the complex — nodes `167:623`, `167:750` (M)
- [x] `#intro`: box is peach→ice GRADIENT (`--color-peach/ice`), radius 61 (`--radius-box` clamp), title PT Serif Regular 94 (`--text-display-xl`) overlapping into photo col (`lg:w-[120%]`, design overlaps layers), photo flipped `-scale-x-100`, Get a Quote → `#contacts`; mobile image-first stack
- [x] `#complex`: visible bg = `complex-bg-raw1` aerial (pano was covered layer — asset swapped + regenerated); frosted card (ice/peach /91 + `backdrop-blur-frost` 30px, `--radius-card` 22px); title 70px (`--text-display-lg`); body = About the complex.md intro (`--text-bodysm` 14/26); `<dl>` spec table w/ `--color-hairline` dividers + PT Serif 34 lagoon values (`--text-stat`); Learn more stub TODO(page); mobile photo + `-mt-14` overlapping card
- [x] **Done:** 1440 matches comp (3-line title wrap exact); 390 stacks clean; real copy, no lorem; context files 02+03 saved; commit `P3`

### P4 — Villas carousel — node `167:635` (L, solo)
- [x] Context fetched → `_design/context/04-villas.md`; missing bed/bath/garage icons RECOVERED from context asset URLs (svgo'd; coral fills)
- [x] `#villas`: header grid (title 70px left; 24/38 `--text-leadlg` intro + View all stub right); SVG sprite (`#i-area/bed/bath/garage/arrow-left/right`) at body start; 3 `<li><article>` cards: aspect-card-img image / `<h3>` 28px + Get a quote (per-villa aria-labels) / real-copy description + bold underline Learn more stub ("Leran more" typo fixed) / coral icon spec row with sr-only expansions
- [x] Deviation logged: `src/data/villas.ts` SKIPPED — static markup is the single source; a data file consumed by nothing is dead weight. Villa names numbered 1/2/3 (design repeats "Beach Lux Villa 1" via instances)
- [x] `src/modules/carousel.ts`: snap-scroll base (track `tabindex=0`, native keyboard/touch/wheel); JS prev/next `.btn-arrow` (stygian active / `--color-pearl` disabled — the design's own arrow pair), scrollBy one card+gap, smooth only when motion allowed, controls hidden when no overflow, ResizeObserver re-sync
- [x] Responsive: `--villa-card-w: min(34.75rem, 85vw)` peek at all widths; `.bleed-track` full-bleed container-aligned padding
- [x] **Done:** 1440 + 390 verified (disabled states live); axe 0 violations both widths; commit `P4`

### P5 — Location + About Us — nodes `167:772`, `216:128` (M)
- [x] `#location`: 2-col items-end ≥lg; H2 Cyrillic А→Latin fixed; body = design's REAL copy ("Located just 1 km…"); Learn more stub; map.svg (30 KB) right col bleeding to viewport edge via new `@utility bleed-right`; mobile text-then-map
- [x] `#about-us`: white section; photo cutout absolute lg (left −13%, w min(89vw,80rem), top-48) over `about-ground.svg` (recovered from context URL — actually SVG, 1.3 KB) under `−70deg` white gradient; right col title/lead/Learn more stub; mobile in-flow photo then text; `--aboutus-h: 60rem` (design tail hidden under CTA)
- [x] Overflow hardening: root `overflow-x: clip` (decorative bleeds must never h-scroll the page — verified `canScrollX: 0`); screenshot script now crops fullPage captures to viewport width (Chrome scroll-snap end-padding inflates scrollWidth — tool artifact, users unaffected)
- [x] **Done:** 1440 faithful both sections; 390 stacked; axe 0 both widths; context files 05+06; commit `P5`

### P6 — Community expanding gallery — node `167:781` (M–L)
- [x] Context → `_design/context/07-community.md`. Actual layout: intro LEFT + title RIGHT (70/85, overlaps container edge `lg:-mr-24` — browser PT Serif metrics wider than Figma's); panels STAGGERED (panel 2 photo-first in DOM); horizontal accordion with one panel collapsed to `--gallery-collapsed` 7.5rem sliver (design default: panel 3, ending at viewport edge)
- [x] `src/modules/gallery.ts`: collapsed-index state machine; arrows slide the open window (right pulls hidden right content open; disabled at ends — reproduces design's pearl/stygian default); heading buttons `aria-expanded`, collapse-self; collapsed text `visibility:hidden` (untabbable + SR-hidden); `grid-template-columns` transition 0.4s — logged exception, off under reduced-motion and <lg
- [x] Baseline verified: <lg and no-JS = stacked, all content visible, controls hidden (JS+lg reveals)
- [x] **Done:** interaction tested live via Playwright (state JSON + screenshots of both states); axe 0 both widths; commit `P6`

### P7 — CTA + Contact form — node `373:129` (L, solo)
- [x] Context → `_design/context/08-cta-form.md`. CTA: dusk aerial bg + `−55deg` black/45 scrim; title PT Serif Bold 89/118 in SAND; subtitle 26/42 (`--text-leadxl`)
- [x] Form card: white→hairline gradient + blur-frost, p-13; pill inputs (55px, nevada border) w/ floating 11px labels on white chips (`--text-label`, `--color-slate`); phone = `.phone-pill` w/ sprite flag+chevron+static "+359" (TODO(intl)); textarea `--radius-area`; native checkbox `accent-stygian` (design's checked stygian box, robust over custom — logged); honeypot; full-width `.btn-dark` submit (design buttons are stygian, not coral)
- [x] `src/modules/form.ts`: submit validation + blur-revalidation after first attempt; errors `--color-error #c2410c` (authored — design has no error spec) wired `aria-describedby`/`aria-invalid`, focus first invalid; honest no-backend path: console.table + prefilled mailto + role=status success naming email/phone fallback; TODO(backend) block
- [x] Cascade-layer gotcha fixed: wrapper utilities beat components-layer `:has()` — phone wrapper styles moved into `.phone-pill` class
- [x] **Done:** Playwright functional test (5 errors + focus to first invalid; blur clears; valid submit → status, 0 errors; phone error border rgb(194,65,12) settled); axe 0 both widths; 1440+390 shots; commit `P7`

### P8 — Footer + global behaviors — node `167:852` (M)
- [x] Context 9/9 → `_design/context/09-footer.md`. Footer: stygian, white logo, footer nav w/ design's CORAL+BOLD active state; `<address>` w/ sprite icons + tel/mailto links (design copy; Contacts.md conflict stands logged); Privacy/Cookie stubs; "© 2025…" fixed
- [x] Socials: Twitter DROPPED — its design export is empty (no glyph) and Contacts.md omits it; ships FB/IG/LinkedIn w/ aria-labels + TODO(social) for real URLs
- [x] `reveal.ts`: IO + 12 `[data-reveal]` blocks w/ `--reveal-delay` staggers; `html.js`-gated; reduced-motion exempt (CSS + JS)
- [x] `nav.ts#initScrollspy`: middle-band IO → `aria-current`; header = layout-stable underline, footer = coral bold (per design)
- [x] `lang.ts` BG stub (preventDefault + TODO(i18n) → website-docs/bg)
- [x] **Done:** footer pixel-faithful; scrollspy functionally tested (home/villas/location/contacts + footer coral rgb(255,127,80)/700); axe 0 both widths; commit `P8`

### P9 — SEO, meta, content audit (S–M)
- [x] `<head>`: Meta-md title/description/keywords; canonical `https://sjbuild.bg/` (TODO(domain): assumed from sales@ email); OG + Twitter cards; `og:image` 1200×630 (123 KB, attention-cropped hero); favicon-32 + apple-touch-icon (white SJ mark on stygian, generated from wordmark crop); `theme-color #1d1e22`
- [x] `public/robots.txt` + single-URL `public/sitemap.xml`
- [x] JSON-LD `@graph`: `RealEstateAgent` (footer contact data) + `WebSite` — parse-verified
- [x] Heading audit: exactly one h1 → 7×h2 (sections) → h3 only in villa cards + community panels; landmarks in place since section builds
- [x] Gate: `grep -ri "lorem" index.html src/` → empty ✓
- [x] **Done:** all gates pass; build clean; commit `P9`

### P10 — QA hardening & final gates (M–L)
- [x] `npm run build` 0 errors (tsc strict + vite)
- [x] Lighthouse → `_design/verify/lighthouse-{desktop,mobile}.json`: **DESKTOP 100/100/100/100 · MOBILE 95/100/100/100** (LCP 2.5s @4G, CLS 0, TBT 60ms) — gates ≥90 ×4 ×2 PASSED
- [x] axe 0 violations ×2 widths (run every phase); keyboard tab-order verified (skip link → logo → nav → BG → CTA → hero); drawer/carousel/gallery/form keyboard behavior functionally tested in P2/4/6/7; 200% zoom ≈ covered by 768-width sweep (fluid layout, no fixed-height text traps)
- [x] Responsive sweep 360/390/768/1024/1280/1440/1920 viewed — no breakage; default shots are reduced-motion; `--motion` available
- [x] Visual parity composite (design vs built @ same scale): section-by-section match; built ~1.3% taller (web PT Serif metrics) — intentional, logged
- [x] html-validate CLEAN (opinion rules off in `.htmlvalidate.json`: void-style/doctype-style/long-title(client copy)/no-redundant-role(Safari list fix); real fixes: phone input → `type=text inputmode=tel` for valid `tel-national`, footer tel uses `&nbsp;`); console + network CLEAN at 1440/390; budgets: hero AVIF ≤107 KB ✓, mobile perf 95 ✓
- [x] TODOs transcribed → Handover register below
- [x] **Done:** all gates green; tag `v1.0.0`

## ✅ DONE — homepage shipped (2026-06-12)
All 11 phases complete. Resume protocol remains valid for follow-up work (subpages, backend).

### P11 — Bilingual (BG primary) — added 2026-06-13
- [x] **Bulgarian is now the primary site at `/`**; English moved to `/en/` (Vite multi-page: `main` + `en` inputs in `vite.config.ts`)
- [x] Root `index.html` fully translated from `website-docs/bg/*` (103 verified replacements: meta, nav, all section copy, ARIA labels, alts, form labels/placeholders/consent, footer). `lang="bg"`; address localized ("гр. Варна, ул. „Кирил и Методий“ 43"); phone/email unchanged
- [x] `en/index.html` = the prior English page, `lang="en"`, links to `/` for BG
- [x] Language toggle is now a real link (header + mobile): BG↔EN, `hreflang` set; old `lang.ts` stub deleted, `[data-lang-toggle]` removed
- [x] `form.ts` made bilingual — reads `document.documentElement.lang`, picks BG/EN strings for validation errors, mailto subject/body, and success message (verified: BG page shows "Моля, въведете вашето име и фамилия.")
- [x] SEO: per-page canonical + `hreflang` alternates (bg / en / x-default) + `og:locale` (+alternate); BG meta title/description/keywords from `website-docs/bg/`; `sitemap.xml` lists both URLs with alternates; JSON-LD `inLanguage` per page
- [x] Verified: toggle navigates / ↔ /en/, both render correct lang/H1, Cyrillic glyphs load (fontsource subsets), nav pill + stat table + form hold the longer BG strings
- [x] Gates: build clean (both pages), axe 0 violations (BG @1440+390), html-validate clean (both), **Lighthouse BG desktop 100/100/100/100**
- [x] Handover #10 (BG locale) CLOSED. Note: privacy/cookie/subpage stubs now exist in BOTH locales — when built, create `/bg` + `/en` versions

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
| P2 | Hero = white gradient + dark text; primary buttons = stygian pills (white text). Coral unused so far | Design context contradicted the screenshot-based assumption of dark scrim/coral CTAs |
| P2 | Hero photo corrected to `hero-raw1` (dusk villa row, 3050×2593) | Layer-order misread in P1; aspect-ratio math + render comparison proved raw1 is the visible fill |
| P2 | Mobile hero restructured: text on white, photo in flow below w/ seam fade | Desktop absolute composite made subtitle unreadable over dark building at 390px |
| P2 | Logo stays PNG (512w) — Figma logo node is an image fill; its SVG export embeds a 300KB raster | Crisp at 2.5×, 16KB |
| P3 | complex-bg corrected to raw1 (aerial street view); pano was a covered layer | Same z-order trap as hero; render comparison decides |
| P3 | "110 000 m2" rendered as "m²"; box/section radii + section rhythm (92px) + display-xl/lg/stat/bodysm type tokens calibrated | Typographic correctness; design-context measurements |
| P3 | Intro/complex surfaces use peach↔ice gradients + frosted blur, not flat `--color-boxes` | Design context superseded the variables list; `--color-boxes` confirmed as villa-card panel bg in P4 |
| P4 | villas.ts data file skipped; villa names numbered 1/2/3; descriptions authored from About-the-complex.md (design lorem) | YAGNI — no consumer for the data; design instances repeat one name; never ship lorem |
| P4 | Spec icons = coral (their real role); carousel arrows = stygian/pearl pair per design exports | Extracted from design context + arrow SVGs |
| P5 | Location body = design copy verbatim (real, names Lozenets/1 km); Location.md kept for future subpage | Design-copy-wins rule |
| P5 | `html { overflow-x: clip }` global guard + screenshot crop-to-viewport | Chrome inflates scrollWidth from snap-track end padding; clip blocks any real h-scroll, crop fixes captures |
| P6 | Community = horizontal accordion (1 collapsed sliver), grid-template-columns animated ≤400ms | Conscious exception to transform-only rule — inherent to the pattern; disabled under reduced-motion and <lg |
| P6 | Big serif titles get `lg:-mr-*` overlap room (intro, community) | Web PT Serif renders ~3% wider than Figma; design itself overflows title boxes past the container |
| P7 | Error color `#c2410c` authored (no design spec); native checkbox w/ `accent-stygian`; consent copy kept verbatim incl. "with the accordance to" | AA-compliant error (coral fails 2.9:1); robustness over pixel-cloning a checkbox; design-copy rule |
| P7 | Form has no backend: mailto compose + honest status + honeypot; payload logged | TODO(backend) in form.ts + Handover register |
| plan | Progress tracked in this file only (no harness task list) | Survives session death; single source of truth |

## P12 — design-fidelity fixes (2026-06-15, from client review)
Two P2 mistakes caught by the client comparing against Figma:
- **Hero image was wrong.** P2 "layer-order correction" swapped the real fill (`hero-raw3`, 1808×1600, bright daytime villa = the "Image-2 1" node) for `hero-raw1` (dusk row). Reverted to raw3 in both locales; variants + og-image regenerated; srcset capped at 1808, dims 1808×1600, crop `object-[50%_72%]`. The earlier "P2 hero asset fix" Decisions-Log row was itself the bug.
- **"Learn more" buttons were dark, not coral.** P2 fetched only the "Get a quote" button (dark `#1d1e22`) and wrongly generalized "no coral buttons." The real `Button Learn more` component (170:1171) is `#FF7F50` + white. Added `.btn-coral`; the 4 Learn-more pills now coral in both locales (Get-a-quote/View-all/submit stay dark, per design).
- **OPEN — contrast tradeoff:** white on `#FF7F50` = 2.5:1, fails WCAG AA → axe now reports 1 serious color-contrast node. Shipped design-exact (coral+white) pending client choice: (A) keep exact, (B) coral bg + stygian text [AA pass, recommended], (C) darken coral + white [AA pass]. **Lesson: never silently deviate from the design to satisfy a gate — surface the conflict instead.**

## P13 — title sizes −2pt (2026-06-15, client request)
All four title tokens (`--text-display-2xl/xl/lg/md`) shifted down 0.167rem (2pt) at min, preferred constant, and max — uniform reduction at every viewport so the longer Bulgarian titles fit their containers. Hero ~89→86px, intro ~94→91px, section H2 ~70→67px, card/panel H3 ~28→25px. Verified: no genuine title overflow at 390 or 1440 (the carousel's off-screen card titles are expected, not overflow); CTA "Свържете се с нас за повече информация" wraps cleanly on mobile. Shared CSS → applies to both locales. Existing overflow hacks (`lg:-mr-24` community, `lg:w-[120%]` intro) still in place and still fit.

## P14 — more design-fidelity fixes (2026-06-15, client review)
- **"View all villas" button was dark, should be coral.** Same P4 over-generalization as the Learn-more bug: never fetched the `Button View all Villas` component (170:1183) — it's `#FF7F50` + `#F4F4F4` text. Now `.btn-coral` in both locales. Button rule is now consistent: **Get-a-quote = dark stygian; Learn more / View all = coral.** (5 coral buttons total.)
- **92px gap between About Us and Contact sections.** It was the `mt-section` margin on `#contacts`; the design has the About-Us photo flow straight into the CTA with no gap. Removed `mt-section` from `#contacts` in both locales (page is 92px shorter; boundary now matches design).
- Contrast note still open: the coral buttons (now 5) use white/sand text = ~2.5:1, fails AA → axe flags them. Still pending the client's A/B/C choice (see P12); whatever they pick applies to `.btn-coral` globally.

## P15 — Location map gap (2026-06-15, client review)
The Location grid used `lg:items-end`, but the text column is taller than the map at every desktop width, so bottom-aligning dropped the map 57–97px down, leaving a gap above it. The design has the map top level with the title top (the map is the taller element there). Changed to `lg:items-start` in both locales → gap above the map is now 0 at 1440/1024, matching the design.

## P16 — 4th villa added (2026-06-15, client request + 4 Figma node links)
Gallery had 3 cards; design has 4 (client gave nodes 170:1016 / 170:1081 / 182:100 / 170:1086).
- Villas track rebuilt **data-driven** (the `villas.ts`-style array I deferred in P4 — now justified) → 4 cards generated for both locales from one template.
- Images re-sourced per the linked nodes: villa-1 now the 1024px daytime layer (was a 556px dupe); villa-2/3 were swapped vs design — fixed; villa-4 new (1808×845). Regenerated all variants.
- Inline "Learn more" link corrected to **lagoon `#2774d9`** (design) — was dark. Lagoon-on-white = 4.6:1, passes AA.
- Card "Get a quote" stays dark, specs 250m²/3/2/1 (all identical per design), descriptions = authored real copy (design is lorem); villa-4 description newly authored in EN+BG.
- Verified: 4 cards, carousel scrolls start→end (Next disables, villa 4 fully reachable), lagoon links confirmed `rgb(39,116,217)`, html-validate clean, axe unchanged (only the pending coral-button contrast).

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

## Handover register (P10 — every open item, with code locations)

| # | Item | Where | Notes |
|---|---|---|---|
| 1 | **Form backend** | `src/modules/form.ts:4` | Currently console.table + prefilled mailto + honest status. Upgrade: POST endpoint / Formspree / Netlify Forms |
| 2 | Production domain | `index.html:15` (canonical, OG, JSON-LD, sitemap, robots) | `sjbuild.bg` assumed from sales@ email — confirm before launch |
| 3 | Villas listing page | `index.html:382` ("View all Villas") | stub `href="#"` |
| 4 | Villa detail pages ×3 | `index.html:427/480/533` ("Learn more") | stubs |
| 5 | Complex / Location / About-us subpages | `index.html:609/626/809` | stubs; long-form copy ready in `website-docs/en/` |
| 6 | Privacy + Cookie policy pages | `index.html:963/1025` | legally required before the form goes live |
| 7 | Social profile URLs | `index.html:1031` | Contacts.md brands them "SG Build…" — **client must resolve SJ/SG naming** |
| 8 | Contact data conflict | footer vs `Contacts.md` | design: +359 897 700 770 / sales@sjbuild.bg / Varna; docs: +359 889 173 654 / sgbuildbg@gmail.com / Lozenets — **client confirm** |
| 9 | Intl phone selector | `index.html:911` | static +359 prefix today |
| 10 | ~~BG locale~~ ✅ DONE (P11) | `/` = BG, `/en/` = EN | bilingual toggle + hreflang + bilingual form live |
| 11 | Twitter/X social | dropped | design export empty + absent from Contacts.md; re-add if client provides URL |
