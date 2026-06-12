# Design context — CTA + Contact form (node 373:129) — FETCHED, do not re-fetch

- BG: `cta-bg.png` (aerial dusk, P1 pick confirmed) full-bleed; scrim `linear-gradient(−55deg, transparent 1%, rgba(0,0,0,.44) 70%)` (dark at top-left).
- Title: PT Serif **Bold** 89/**118** (display-2xl + `leading-[1.33]`), color **sand #f4f4f4**, w 813 (max-w-[51rem]), 36px below section top.
- Subtitle: Noto 26/42 → new token `--text-leadxl`, sand, w 681.
- Card: 460×614 (max-w-[28.75rem]) x150 y7325; radius 22 (--radius-card); bg `linear-gradient(58deg,#fff 4%,#f8f8f8 155%)` + blur-frost; px≈52 (p-13) pt 39.
- Fields: pitch 87 (mt-8); pill inputs h55 (py-4.5, rounded-full), border #666a7a (nevada), placeholder stygian/32%, pl-28; floating labels **11px #54565c (`--color-slate`, `--text-label`) on white chip overlapping border** (-top-2 left-7 bg-white px-1). Asterisk same color.
- Phone: flag 16×11 (#i-flag-bg sprite — junk rects stripped) + chevron (#i-chevron currentColor) + static "+359" dark + tel input. Static decorative prefix; TODO(intl).
- Message: textarea 132 tall (h-33), radius 26 (`--radius-area` 1.625rem).
- Consent: y7789 — design shows CHECKED stygian box; implemented as native checkbox `accent-stygian` (robust, accessible — logged); text 11px **#757575 (`--color-ash`)** w/ underlined Privacy Policy stub. Verbatim design copy ("with the accordance to" kept).
- Submit: `.btn-dark` full-width (356) y7845; section ends pb≈68.
- Errors (not in design — authored): `--color-error #c2410c` (burnt orange, 5.4:1 on white), 11px under field, `aria-describedby`/`aria-invalid`, focus first invalid, blur re-validation after first attempt. Phone wrapper error via `:has([aria-invalid=true])`.
- No backend: honeypot "website"; valid submit → console.table + mailto:sales@sjbuild.bg prefilled + role=status success copy that does NOT claim delivery (mentions phone fallback). TODO(backend).
