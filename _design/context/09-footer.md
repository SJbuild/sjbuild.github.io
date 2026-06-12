# Design context — Footer (node 167:852) — FETCHED (9/9 budget complete), do not re-fetch

- Stygian bg, 291 tall. Top row: WHITE logo (102×34, `logo-white.png`) + nav right-aligned (gap 57, 14px): **active link = CORAL BOLD** (design's "Home" state — coral's second role; 6.9:1 on stygian ✓) → scrollspy footer style; header pill gets layout-stable underline instead.
- Contact block: 16px/36px sand rows w/ icons: tel +359 897 700 770 / mailto sales@sjbuild.bg / "Varna, str. Kiril i Metodii 43" — design copy (Contacts.md conflict logged in P-plan row, client to confirm).
- Socials 24px white right: **Twitter export is EMPTY (no glyph) + absent from Contacts.md → dropped; ships FB/IG/LinkedIn** (TODO(social): real URLs; docs name "SG Build" brand variants — flagged).
- Legal: "Privacy policy | Cookie Policy" 14px white, stubs TODO(page). Copyright centered: rendered "© 2025 SJ Build. All rights reserved." ("@"→© logged).
- Globals shipped with this phase: `reveal.ts` (IO, 12 `[data-reveal]` blocks w/ staggers, `html.js`-gated, reduced-motion exempt), `nav.ts#initScrollspy` (middle-band IO → `aria-current`), `lang.ts` BG stub (TODO(i18n), copy ready in website-docs/bg).
