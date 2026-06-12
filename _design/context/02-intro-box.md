# Design context — Section 1 "Intro box" (node 167:623) — FETCHED, do not re-fetch

- Box: 1334×792 centered (53px page margins), **rounded 61px**, bg = `linear-gradient(to left, #FFE5DC 3%, #E9F3FF 99%)` — peach→ice (NOT flat Boxes token). Tokens: `--color-peach #ffe5dc`, `--color-ice #e9f3ff`, `--radius-box clamp(...→3.8125rem)`, `--container-box 83.375rem`.
- Title: **PT Serif REGULAR 94px / lh 122px (1.298)**, #1d1e22, w 733 (3 lines), pos: 92px from box left (pl-23), 56px from top. → token `--text-display-xl` 94/1.3 (section titles are Regular, only hero H1 is Bold).
- Body: Noto 17/29 (= --text-lead), #666a7a, w 441 (max-w-md), 20px below title.
- Button "Get a Quote" (instance 170:1173) at y1746, 27px below body, `.btn-dark`.
- Photo: right ~half (mask 690×792 to box edge), source = intro-villa.png (929×823) placed 1023×906 **flipped horizontally** (rotate-180 + scaleY(-1) = scaleX(-1)) → CSS `-scale-x-100`; crop ≈ left 68% / lower 87% of source → object-[30%_60%] after flip, tune visually.
- Section gap above: 92px (hero 1040 → box 1132) → `--spacing-section: clamp(4rem, 2.4rem + 4.4vw, 5.75rem)` calibrated here.
- Mobile derivation: photo stacks ABOVE text (order-1), text px-6 py-10.
