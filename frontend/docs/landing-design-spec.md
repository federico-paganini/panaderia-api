# Landing page — design spec

Panadería y Confitería **Las Delicias** · Lavalleja 714, Las Piedras, Canelones (Uruguay).

Revised 2026-09-13: the open colour decision is closed, the deploy target changed, a dark
theme was added, and the logo's typeface was identified. Those revisions are marked
**Settled** or **Added** in place rather than appended, so this file stays the single answer.

This document captures the design direction settled on 2026-09-12 so the Svelte build can
start from decisions, not from scratch. It records what was measured, what was decided, what
is still open, and which inputs are missing. Copy is in Spanish because it is content; the
spec itself follows the repository rule of English documentation.

Direction sketches (three colour treatments of the same hero, plus the palette board):
https://claude.ai/code/artifact/b43516c4-126b-4218-abcd-e688094abc9e

---

## 1. Scope

- **Bakery only.** The party venue (Las Delicias – Party Times) gets its own landing; do not
  fold it into this one. **Revised 2026-10-10:** the venue is a separate company with the same
  owners, so it lives at `/party-times` on this domain — a route, not a subdomain, which would
  be a second site to build and deploy — with its own `/party-times/privacy` and
  `/party-times/terms` naming its own company. A skeleton exists: its legal facts are
  bracketed placeholders in `$lib/party-times/entity`, and while any is left, `isPending` keeps its
  three pages `noindex` and the bakery's link to it hidden.
- **Three routes from day one.** Route names are English, per the repository convention that
  everything dev-facing — identifiers, file names and routes — is English while the copy is
  Spanish:
  - `/` — the landing.
  - `/privacy` — the privacy policy. Not optional: Meta refuses to publish the WhatsApp bot
    app without a public privacy-policy URL, so this page is on the bot's critical path (see
    the `panaderia-bot` repository). **Its URL changed from `/privacidad` on 2026-09-13** —
    the bot repo's `docs/HANDOFF.md` still records the old one.
  - `/terms` — terms of use. Optional for Meta, but the legal layout is shared, so it costs
    little and it helps the app review.
- **Settled 2026-09-13 — deploy target is Vercel**, with `@sveltejs/adapter-vercel`. This
  replaces the original "static host, no server rendering". Every route is still
  `prerender = true`, so the pages are static files either way; what the adapter buys is a
  server side later, without a migration, for when the Rust API exists. Swapping the adapter
  is one line in `svelte.config.js`.
- Domain: **lasdeliciaslp.com**. A Vercel preview URL also works as a public privacy-policy
  URL, so Meta's app review never had to wait for the domain.

## 2. References — what to take and what to leave

**merci.ar** (aesthetic and motion)

Take the techniques, not the expression. Their stickers, copy, photography and logo are
theirs; the mechanisms below are generic.

- Paper cut-outs floating over the hero, each drifting with the mouse **at a different rate**.
  The depth illusion comes from the rate difference, not from the movement itself (measured:
  one sticker moved ~60 px across the viewport while another moved ~10 px).
- The hero's bottom edge is an **arc** that rises left-to-right, not a straight line.
- **Diagonal parallelogram slabs** as section backgrounds, a tone darker than the canvas.
  They are backdrop only — cards sit straight on top; the slab carries the diagonal.
- Two typefaces that deliberately clash: a heavy condensed face for headings, a handwritten
  face for accent words.
- A three-tone palette; everything else is photo colour.
- Optional flourish: a ribbon of text following a serpentine path around a cut-out figure.

**saludablepedidos.com**, block `#bwblock_89646` (icon style)

Four 300×300 JPG illustrations, inspected at full size:

- Hand-inked monoline drawings in a **single warm ink**, no colour.
- **Rough marker stroke** on paper: the line wobbles slightly and its edge is irregular.
- No fill, except an occasional solid badge (a filled circle with a cut-out heart).
- **Hatching** for shade and texture: short parallel strokes on a rim, on the flesh of a
  fish, along a ground line.
- Small life-giving accents: steam curls, three "sparkle" ticks, a ground shadow.
- A **repeated signature motif** (a heart) across most of the set.
- Displayed at roughly 90 px with an uppercase label beneath.

Translation for Las Delicias: ink in the brand blue on the sticker paper, and the **wheat ear
from the logo** as the repeated motif instead of the heart.

## 3. Brand assets

**The mark is `src/lib/bakery/logo-las-delicias.svg`**, served by the shared `Logo.svelte` as an `<img>`.
Beside this spec, `docs/assets/logo-las-delicias.png` (2400×1200, transparent) is the same mark
rendered for use outside the site, and `logo-las-delicias.jpg` is the shop sign's photo it was
re-drawn from on 2026-10-04 — kept as the source the measurements below were taken from.
Everything in the SVG is a path — no font is involved, and it sits on any surface in either
theme. Its colours are literal, like a photo's: the palette guard scans components and SCSS,
not image files. There is no generator in the repo: the one used to draw it was one-off
tooling and was removed the same day. **Edit the SVG directly, and re-export the PNG with it.**

Chosen by Federico out of three candidates (one faithful to the sign, one lightly modernised,
one freer): the modernised one. It keeps the sign's geometry — the blue oval with the arched
caps above the script wordmark and the wheat ears below — and changes little: the oval is a
touch rounder (2.0:1 against the sign's 2.07:1), one ring instead of ring plus hairline, the
caps a little smaller. The ears are the sign's four — two a side, a front one lying almost flat
with its base by the crossing and a back one higher and steeper, opening into a V toward the
tips — with the stalks crossing just below the oval's edge, as on the sign. A tie at the
crossing was tried and rejected (it read as a rectangle).

**Settled 2026-10-04 — the wordmark ships as Pinyon Script outlines.** The sign's face is
Edwardian Script ITC, identified from the letterforms at 4× (the capital `L`'s flat swash
crossing back over itself under `as`, the free teardrop inside its bowl). It is a commercial
Monotype face neither of our machines has, and a webfont licence would cost money for a mark
that never renders as text. Of seven free formal scripts compared, Pinyon Script (OFL) was the
closest — the same `L` swash, the looped `D`, the small x-height — and Federico accepted it; the
handoff brief for outlining the real face was dropped.

Consequence for §5: **Great Vibes stays the site's script face.** It is free, already
self-hosted, and the same genre. A logo is a mark, not running text, so the two not matching
exactly is invisible.

The arched "PANADERÍA Y CONFITERÍA" line is **not** reproduced from the original: it is re-set
in Barlow Condensed (SemiBold, as outlines), the display face the rest of the site already
uses. Free, and it ties the mark to the pages.

**The party venue's mark — `src/lib/party-times/logo-party-times.svg`, with a 2000 px PNG in
`docs/assets/`.** Re-drawn as vector on 2026-10-10 from the venue's Instagram post, the only
copy there was (a Canva export is being asked for; if it turns up it replaces this). Federico's
brief: the same, improved — letters a little thinner, decorations redrawn, the Instagram and
WhatsApp badges dropped. The lettering is Fredoka 700 outlines (the closest free face to the
post's), one colour per letter with a white outline on the face only — an outline on the dark
base too read as a doubled letter on the violet — over a violet disc with a thin ring. The
decorations (balloons, hat, stars, confetti) are drawn geometry. Its palette is its own and is
not in `_themes.scss`: the venue gets its own tokens when its landing is designed. `logo-party-times-animated.svg` beside it is the same mark with its motion in CSS, so it plays as an `<img>` too: the letters pop in one by one, then the hat and stars drop, the balloons float up, the pill rises and the confetti twinkles in, all inside 2.5 s; after that the balloons sway, the hat tilts, the stars twinkle, a wave runs through the letters every 8 s, and a light confetti rain falls through the disc. Under `prefers-reduced-motion: reduce` it is the still mark, rain included. For the venue's hero; the still one everywhere else.

Colours measured on the logo (Pillow, median-cut quantisation):

| Role in logo    | Hex                                       |
| --------------- | ----------------------------------------- |
| Oval blue       | `#003898` (variants `#063083`, `#0A3C93`) |
| Wheat highlight | `#EEC882`                                 |
| Wheat mid       | `#D7AE69`                                 |
| Wheat base      | `#C29853`                                 |
| Wheat shadow    | `#AE813E`                                 |

The logo's wordmark is a formal script; "PANADERÍA Y CONFITERÍA" is arched small caps.

## 4. Colour

The palette supplied at the start (`#EAF6FF #BFE3FA #7FC4F2 #3E8FD6 #1E5A9C`) is coherent but
cold: bread, butter and crust are orange and gold, and every product photo fights a pale
blue canvas. The warmth was already in the brand — the wheat ears — so the fix is to take
gold from the logo and move the blue from "wall" to "signature".

### Tokens (direction B — recommended)

| Token                 | Hex       | Role                                 |
| --------------------- | --------- | ------------------------------------ |
| `--color-brand`       | `#003898` | Headings, icon ink, primary identity |
| `--color-brand-soft`  | `#1E5A9C` | Links, secondary accents             |
| `--color-canvas`      | `#F7F1E4` | Page background (cream)              |
| `--color-slab`        | `#EFE2C4` | Diagonal background slabs (butter)   |
| `--color-paper`       | `#FFFDF8` | Sticker paper, cards                 |
| `--color-wheat`       | `#C29853` | Primary CTA background               |
| `--color-wheat-light` | `#EEC882` | Handwritten accent over photos       |
| `--color-ink`         | `#3A3328` | Body text                            |
| `--color-cta-text`    | `#1F160A` | Text on the gold CTA                 |

### Contrast (WCAG, computed)

| Pair                   | Ratio   | Verdict                                           |
| ---------------------- | ------- | ------------------------------------------------- |
| `#003898` on `#F7F1E4` | 9.24:1  | headings on canvas — pass                         |
| `#3A3328` on `#F7F1E4` | 11.08:1 | body on canvas — pass                             |
| `#003898` on `#EFE2C4` | 8.10:1  | headings on slab — pass                           |
| `#003898` on `#FFFDF8` | 10.23:1 | icon ink on paper — pass                          |
| `#1F160A` on `#C29853` | 6.72:1  | dark text on gold CTA — pass                      |
| `#FFFFFF` on `#C29853` | 2.65:1  | **never** white text on the gold CTA              |
| `#FFFDF8` on `#003898` | 10.23:1 | cream text on solid blue (direction C nav) — pass |
| `#FFFFFF` on `#3E8FD6` | 3.44:1  | direction A's CTA — **fails AA for normal text**  |

### Settled 2026-09-13: direction B

Federico chose **B**. A and C are recorded below only so the reasoning survives; they are not
alternatives any more.

- **A · Cold** — the supplied palette as is. Coherent with the original brief, but neither the
  logo's gold nor the bread has an echo on the page, and its CTA fails contrast (above).
- **B · Blue signature, cream canvas** — _recommended._ Brand blue for headings and ink,
  cream canvas, wheat gold on the CTA. The logo looks the way it does on the shop sign.
  Trade-off: less "colour block" than merci.ar; identity is carried by detail, not by a bar.
- **C · Solid blue** — B with the nav bar in solid `#003898` (the role merci's green plays).
  Strongest identity from the first pixel; the logo then sits on its own blue and relies on
  its white ring to separate.

### Added 2026-09-13: the dark theme

The site answers `prefers-color-scheme`. There is no toggle and no theme script — the tokens
carry it, so nothing flashes on load.

The cost of a second theme is never the palette; it is the discipline that no component ever
writes a literal colour. That discipline is enforced by `src/lib/styles/tokens.spec.ts`, which
fails the suite on any raw hex or `rgb()` outside `_themes.scss`. Adding a third theme would
be writing one block.

| Token                 | Light     | Dark      | Note                                  |
| --------------------- | --------- | --------- | ------------------------------------- |
| `--color-brand`       | `#003898` | `#8FB6F0` | the logo blue, lightened to clear AA  |
| `--color-brand-soft`  | `#1E5A9C` | `#A9C8F5` | links                                 |
| `--color-canvas`      | `#F7F1E4` | `#191510` | page background                       |
| `--color-slab`        | `#EFE2C4` | `#231D15` | **provisional** — see below           |
| `--color-paper`       | `#FFFDF8` | `#2A2219` | **provisional** — see below           |
| `--color-wheat`       | `#C29853` | `#C29853` | unchanged; the CTA keeps its identity |
| `--color-wheat-light` | `#EEC882` | `#EEC882` | unchanged                             |
| `--color-ink`         | `#3A3328` | `#EDE4D3` | body text                             |
| `--color-ink-muted`   | `#6B6151` | `#B3A895` | secondary prose                       |
| `--color-cta-text`    | `#1F160A` | `#1F160A` | unchanged; 6.72:1 on the gold in both |

Every foreground/background pair the design actually uses clears WCAG AA in **both** themes.
That is not a claim in a document: `src/lib/styles/contrast.spec.ts` compiles `_themes.scss`
and recomputes the whole table on each run, so breaking a pair breaks the build.

**Provisional, deliberately.** The prose surfaces are correct and the legal pages are done.
The landing's own surfaces are not designed in dark yet: the arc divider is filled with the
canvas colour, the stickers are cream _paper_ with a drop shadow, and the slab is "a tone
darker than the canvas" — ideas that have to be re-decided against real photography. The
values above keep nothing undefined in the meantime.

**Checked 2026-10-04 against the hero.** The photo cut-outs needed nothing: they are photos,
not paper, and they hold on the dark canvas as they are — the shadow simply disappears, which
reads fine. The sticker paper and the slab are still open, and get decided with those
components.

## 5. Typography

**Revised 2026-09-13 — self-hosted through `@fontsource`, not Google Fonts.** Two reasons.
`eron-client-sv` already does it this way; and `/privacy` tells the reader their data is not
handed to third parties, which a request to `fonts.gstatic.com` on every page view would
contradict on the very page that says it. The built output makes zero third-party requests.

Only the Latin subset is loaded (`@fontsource/<face>/latin-<weight>.css`) — it covers Spanish
in full, accents and `ñ` included.

| Role          | Face             | Weights       | Fallback                              |
| ------------- | ---------------- | ------------- | ------------------------------------- |
| Display       | Barlow Condensed | 700, 800      | `'Arial Narrow', Impact, sans-serif`  |
| Accent script | Great Vibes      | 400           | `cursive`                             |
| Body / UI     | Barlow           | 400, 500, 600 | `'Helvetica Neue', Arial, sans-serif` |

Great Vibes was chosen because it echoes the logo's script. If it reads too formal next to
the rough icons, Caveat or Kalam (marker-like, closer to merci.ar) is the alternative — swap
one token, do not mix three faces.

Scale used in the sketch (1200 px reference): hero headline 84 / accent 68; section heading
46 / accent 40; nav wordmark 26 with a 10 px letter-spaced caps line (tracking 2.2 px); card
titles 26; body 17; small caps 12. Display leading 0.95, tracking ~1 px, uppercase.

## 6. Layout and components

Desktop reference width 1200 px. All values below are from the sketch and are starting
points, not law.

**Revised 2026-10-04 — the landing's column is 1600 px, not 1200.** On Federico's 1920 px
screen the 1200 px column left a third of the width empty. `$content-width` is now 100rem;
the hero fills the first screen below the nav, and its headline grows with the column up to
112 px instead of stopping at the sketch's 84.

**Nav — built 2026-10-04 in `src/lib/shared/Nav.svelte`.** 72 px on the canvas: the logo (52 px, the
SVG of §3) on the left, **Pedidos** to the WhatsApp on the right, in condensed caps. Only on the
landing; the legal pages keep their own header. Three deliberate departures from the sketch,
agreed with Federico:

- **One link, not four.** Productos, Nosotros and Dónde estamos join as their sections land —
  an anchor to a section that does not exist is a dead link in production.
- **No wordmark or caps line beside the logo.** That was for the white JPEG chip; the vector
  mark carries the name itself.
- **Canvas, not brand blue**: the blue oval vanishes on a blue bar.

The link reads "Pedidos", not the hero's "Pedí por WhatsApp", so a screen reader's link list
does not carry two links with one name.

**Hero — revised 2026-10-04: split, not full-bleed.** Built in `src/lib/bakery/Hero.svelte`. The copy
stack (headline, script accent, info line, CTA pill) sits on the canvas on the left; on the
right, two photos as paper cut-outs, one per word of the headline — `flautas.jpg` for _pan_,
`croissants-savoury.jpg` for _bizcochos_. The photos take the larger column (0.8fr / 1.2fr), at
Federico's request. Below 768 px the collage goes on top and the copy below it.

Why not the original full-bleed photo with a dark gradient. Measured against the first batch
of photos, it failed twice:

- **Contrast.** White text over the oven photo, under the 10% → 45% gradient, fell to 2.0:1 on
  the brightest 5% behind the text. A 35% → 60% gradient lifted that to 3.5:1 — enough for the
  headline, not for the 17 px info line — and buried the glow that was the photo's point.
- **Resolution.** Every photo is portrait or square and WhatsApp-compressed, so filling a
  landscape band means cropping and upscaling. The oven photo was also the softest of the
  nine by a factor of ten (edge variance 61 against 735 for the croissants), and Federico
  dropped it.

Split, the copy sits on tokens whose contrast is already verified, no photo has to stretch,
and the dark theme needed no new decision. The script accent is `--color-brand-soft`, not
gold: wheat on the canvas is 2.4:1, below even the large-text floor.

The arc divider (`viewBox 0 0 1200 90`, path `M0,90 L0,74 Q560,-30 1200,44 L1200,90 Z`,
`preserveAspectRatio="none"`) is **kept for a later section** that has a full-width photo to
cut; the hero no longer has one. The down arrow is deferred until there is a section below to
point at.

**Paper sticker** — two nested elements. The **outer** carries rotation (−9° … +11°) and the
shadow (`filter: drop-shadow(0 10px 14px rgba(20,15,10,.30))`); the **inner** carries the
paper background and the torn-edge `clip-path`. The split is mandatory: `clip-path` clips
its own element's filter, so a shadow on the clipped element disappears. Torn-edge polygons
used in the sketch:

```
polygon(3% 10%, 28% 0%, 55% 6%, 78% 0%, 100% 8%, 97% 55%, 100% 92%, 72% 100%, 45% 94%, 20% 100%, 0% 90%)
polygon(0% 6%, 22% 0%, 50% 8%, 80% 0%, 100% 10%, 96% 50%, 100% 88%, 70% 100%, 40% 92%, 15% 100%, 2% 86%)
polygon(4% 0%, 40% 6%, 72% 0%, 100% 12%, 96% 60%, 100% 100%, 60% 94%, 30% 100%, 0% 88%)
```

Content: a wheat ear plus a short script phrase. **Revised 2026-10-04:** the ear is the
logo's own drawing — a front and a smaller back head from one stalk, as each side of the mark
pairs them — in `src/lib/bakery/sticker-ear.svg`, not the parametric symbol, which Federico
found too far from the logo. Parallax: translate each
sticker by the cursor's offset from the viewport centre times a per-sticker depth factor in
the 0.02–0.06 range, eased with a lerp on `requestAnimationFrame`. Disable on coarse
pointers (`matchMedia('(pointer: fine)')`) and under `prefers-reduced-motion`.

**Diagonal slab** — an absolutely positioned div behind a section's content, bleeding 40 px
past both sides, `background: var(--color-slab)`,
`clip-path: polygon(0% 32%, 100% 0%, 100% 68%, 0% 100%)`. Content above it stays straight.

**Classics section** — condensed heading + script sub-line, then three cards on paper
(radius 14, soft shadow, 200 px photo, condensed title). **Open:** add an icon-and-label
row in the saludable pattern as category navigation. Recommendation: both — photos sell the
product, the icon row organises navigation.

**Footer / location** — the real address, hours, and the WhatsApp entry point.

## 7. Icon system

Hand-inked look, built as SVG so the set stays recolourable and never drags a white JPG
background onto the cream canvas.

- Stroke-based, `stroke: currentColor`, width 2.2–2.6, round caps and joins, no fill except
  a deliberate solid badge.
- Roughness via an SVG filter applied per icon: `feTurbulence` (fractalNoise,
  `baseFrequency` 0.04–0.08, `numOctaves` 2) into `feDisplacementMap` (`scale` 1.5–2.5).
  Tune once, reuse everywhere; the wobble must be the same "hand" across the set.
- Hatching as short parallel strokes; accents as in the reference (steam, sparkle ticks,
  ground line).
- **Motif:** a small wheat ear on every icon.

**Settled 2026-09-13, revised 2026-10-04 — the gold ear is the logo's; the parametric symbol
is for ink.** The 2026-09-13 plan was one geometry painted two ways, gold for the logo and
monoline ink for the icons, so the brand would have one hand. The parametric ear could not
match the sign's dense, braided heads, so the logo's ears are drawn in the SVG itself (§3),
and the stickers carry the same drawing (§6). The parametric symbol below is kept for the
ink icons, the favicon and the markers; its gold mode no longer has a user. Chosen on the prototype:

| Parameter   | Value | Meaning                                                           |
| ----------- | ----- | ----------------------------------------------------------------- |
| Grain pairs | 8     | pairs along the axis, plus one terminal grain                     |
| Spread      | 46°   | outward angle at the base, tightening to ~25° at the tip          |
| Awns        | 0.85  | length factor of the bristles; they carry most of the recognition |
| Taper       | 0.00  | grains do not shrink toward the tip                               |
| Roughness   | 4.0   | `feDisplacementMap` scale, ink mode only                          |

Volume in gold mode comes from **two flat tones** (`--color-wheat` over `--color-wheat-light`),
not a gradient: it reads crisper small and recolours cleanly.

The displacement is in viewBox units, so it scales with the drawing — which means below about
40 px the noise falls under a pixel, contributes nothing and only costs a filter pass. **Turn
the roughness off below that size.**

The favicon is not a separate drawing: it is this symbol with the viewBox cropped to the tip.
The same symbol also serves the `li::marker` on the legal pages.

**The logo's ears, as settled on 2026-10-04 (§3):** the sign's four, not two, with the stalks
crossing just below the oval's edge — that is what stops the mark being a sealed badge. A
small tie at the crossing was tried and rejected.

- Subjects, keep the set to eight or fewer: medialuna, flauta, tray of bizcochos, torta,
  taza de café, paper bag, the shopfront, a wheat ear alone.
- If the SVG approximation is not good enough for the final site, commission an illustrated
  set — delivered as SVG or transparent PNG, never JPG on white.

## 8. Copy

Spanish, as content. Known facts are used verbatim; unknown facts are bracketed placeholders
and must be filled, never invented.

- Headline stack: **PAN Y BIZCOCHOS** / _recién horneados_
- Info line: `Panadería y Confitería · Lavalleja 714 · Las Piedras, Canelones`
- CTA: **Pedí por WhatsApp** → `https://wa.me/59892007806`
- Sticker phrases: _recién horneado_ · _bizcochos_ · _medialunas_ · _Las Piedras_
- Section: **LOS CLÁSICOS** / _de la casa_ — the categories Bizcochos / Panes / Tortas in the
  sketch are **samples**, not the menu.
- Placeholders: none left in the copy; the photos still missing are listed in §11.

## 9. Motion

- Sticker parallax as specified above.
- One reveal on load: stickers settle in (small rotation and opacity), nothing else animates
  on entry.
- Cards lift subtly on hover.
- Everything respects `prefers-reduced-motion`.

## 10. Responsive

At ≤ 768 px: headline 48 / accent 40; keep two stickers, shrink them; flatten the slab angle;
cards stack; the nav is already the logo + Pedidos at every width (§6), so it has nothing to collapse. Gutter never below 16 px. The
body must never scroll horizontally.

## 11. Inputs — state on 2026-10-04

Still missing:

| Input                                                                       | Needed for                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Photos: the shopfront, the medialunas, and the originals of the first batch | The shopfront for the location section. The medialunas because the stickers and the icon set name them, and here they are larger and filled — the savoury-croissant tray only looks like them. The originals for the hero: the nine received are WhatsApp-recompressed (1720 px at most on the long side, EXIF stripped) — enough for cards, soft on a full-bleed hero at 2×. To be requested as WhatsApp _documents_, which arrive uncompressed |
| Confirmation that `bread-basket.jpg` is the bakery's own                    | It is cut out and composited onto a studio background, unlike the rest of the set. Federico believes it is theirs and is asking; it does not ship until that is confirmed                                                                                                                                                                                                                                                                        |
| The party venue's legal facts and channel                                   | Its company name, RUT, address, phone and a new privacy alias, which Federico is getting. And whether the WhatsApp assistant keeps answering venue queries on the bakery's number or moves to one of the venue's own: that decides whose processing each privacy policy describes. Until then `/party-times/*` stays a skeleton                                                                                                                  |

Resolved:

| Input                    | Answer                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain                   | `lasdeliciaslp.com`, live on Vercel since 2026-09-14 with an automatic Let's Encrypt certificate                                                                                                                                                                                                                                                                                                                                    |
| Hosting and deploy       | Vercel, deployed by CI on every push to `main` that passes the frontend gate                                                                                                                                                                                                                                                                                                                                                        |
| Legal entity and RUT     | GERALNA LTDA., RUT `080097130018` (check digit verified) — `src/lib/bakery/entity.ts`                                                                                                                                                                                                                                                                                                                                               |
| Privacy policy and terms | Written and **published** at `/privacy` and `/terms`                                                                                                                                                                                                                                                                                                                                                                                |
| Retention period         | 30 days. Published, so it now constrains the bot's storage decision                                                                                                                                                                                                                                                                                                                                                                 |
| Opening hours            | Mon–Sat, 7:30–21:00 in person and 8:00–20:00 by phone — kept as two ranges in `$lib/bakery/brand`, because flattening them misleads whoever arrives at 20:30                                                                                                                                                                                                                                                                        |
| Logo typeface            | Edwardian Script ITC on the sign; Pinyon Script outlines in the vector mark (§3)                                                                                                                                                                                                                                                                                                                                                    |
| Logo as vector           | `src/lib/bakery/logo-las-delicias.svg`, with a PNG export in `docs/assets/`, re-drawn 2026-10-04 and chosen by Federico out of three candidates (§3). `Logo.svelte` serves it, and `Nav` places it on the landing                                                                                                                                                                                                                   |
| Photos, first batch      | Nine received 2026-09-30; eight kept in `src/lib/bakery/photos/`: flautas, sweet croissants, savoury croissants (the tray that looks like medialunas), the strawberry tarts and brownies, the miga sandwiches, the canapés, the bread display and the basket. The ninth, the oven, was dropped for its quality (§6). Everything in them is sold at the counter (confirmed 2026-10-04), so none belongs to the party venue's landing |
| WhatsApp number          | `+598 92 007 806`, given 2026-10-04 — the CTA is `https://wa.me/59892007806`                                                                                                                                                                                                                                                                                                                                                        |
| Contact e-mail alias     | `privacidad@lasdeliciaslp.com`, live since 2026-09-16 via forwardemail.net. `/privacy` publishes it as the Ley 18.331 channel, so the domain's `MX` records are now load-bearing                                                                                                                                                                                                                                                    |

## 12. Implementation notes (Svelte) — as built

- **SvelteKit + `@sveltejs/adapter-vercel`**, pnpm, TypeScript strict, ESLint + Prettier,
  Vitest + Playwright. Every route `prerender = true`.
- **Svelte config lives in `svelte.config.js`, not inline in `vite.config.ts`.** This is not a
  preference. `sv create` writes it inline, and `svelte-check` reads only `svelte.config.js`:
  with the config inline it finds no preprocessor, silently **skips** every component that has
  `<style lang="scss">` — which is all of them — and still reports zero errors. Verified by
  mutation: a type error inside a component is invisible before the move and caught after.
- **Tokens split by what they are.** The scale (`$space-*`, `$font-size-*`, breakpoints) is
  Sass in `_tokens.scss`; colour is CSS custom properties in `_themes.scss`, which is the only
  file allowed to hold a literal colour. `_themes.scss` emits CSS, so it is included once from
  `app.scss` and is **not** forwarded by `_index.scss`. Components reach the scale with
  `@use 'styles' as *;` (`loadPaths: ['src/lib']` in `vite.config.ts`).
- **Internal links go through `resolve()`** from `$app/paths` — ESLint enforces it, and it
  type-checks that the route exists. Note that the prerenderer emits the result as a _relative_
  path (`./terms`), so a test that matches the literal `/terms` in an `href` tests the build's
  spelling rather than the navigation.
- **Two businesses, one app — restructured 2026-10-10.** The bakery and the party venue are
  separate companies with the same owners, published from this one site. Each has a **route
  group** — `(bakery)` with `/`, `/privacy`, `/terms`; `(party-times)` with `/party-times` and its
  two legal pages — whose `+layout.ts` loads that business's **brand** (`$lib/bakery/brand`,
  `$lib/party-times/brand`): names, legal entity, contact, logo, legal dates. The shared
  components in `$lib/shared/` — `Nav`, `Logo`, `SeoHead`, `MailLink`, `PhoneLink`, `LegalFrame` —
  read it through `currentBrand()`, which throws for a page outside both groups, and a test
  checks no page is. Code owned by one business lives in its folder (`$lib/bakery/`,
  `$lib/party-times/`); what both use, in `$lib/shared/`; what is true of the whole site
  (`site.ts`, `routes.ts`, `crawlers.ts`, `styles/`) stays at the root of `$lib`. Rejected: two
  apps sharing a component library — a second build, deploy, CSP, sitemap and CI for a venue that
  needs one landing and two legal pages. If the venue ever moves to its own domain, its group
  lifts out into an app whole.
- **Legal pages share one frame**, `$lib/shared/LegalFrame.svelte`, rendered by each brand's
  `(legal)` layout: the way back to that brand's landing, the document, and a footer naming the
  company responsible. It owns all the prose typography via `:global()`; each page is content
  only.
- **A theme per brand is planned, not built.** The venue gets its own palette (the violet of its
  mark) and Fredoka as a self-hosted face, defined under a brand attribute in `_themes.scss`
  with the same token names, so components stay brand-agnostic and the palette and contrast
  tests extend to it. It waits for the venue's landing design; until then its pages wear the
  bakery's tokens.
- **Photos go through `@sveltejs/enhanced-img`, and only through `src/lib/shared/Photo.svelte`.** A
  component imports the photo with `?enhanced` and passes it to `<Photo>`, which emits a
  `<picture>` with AVIF, WebP and JPEG plus `width`/`height`, so nothing shifts on load — the
  hero's croissants leave as a 42 KB AVIF. The originals are committed and the derivatives are
  build output, never the reverse. The default emits 1× and 2× from the source treated as 2×. Those are density descriptors, so the browser picks by pixel ratio, not by the slot's width: a 2× screen loads the full source even for a ~400 px slot. Acceptable at today's sizes (the croissants' 2× AVIF is 122 KB); revisit with `sizes` if a photo ever fills the page. Two traps,
  each paid for once:
  - **`<enhanced:img>` cannot sit in a component with SCSS.** The plugin parses the raw
    component _before_ the SCSS preprocessor runs, so a `//` comment or a `#{}` interpolation
    in the same file fails the build with a CSS syntax error that points nowhere near the
    cause. Plugin order does not help: its hook runs first regardless. That is why `Photo` has
    no `<style>` block at all.
  - **No attribute spread on the `<img>`.** With `{...rest}`, Svelte cannot tell whether an
    `onload` is inside, so the server render adds an inline `onload="this.__e=event"` — which
    the CSP's `script-src 'self'` blocks, logging a violation on every load. `Photo` takes
    named props for that reason.
- Built: `Nav`, `Hero`, `Photo`, `Sticker`. Still to build: `Slab`, `ClassicCard`, `IconRow`,
  `InkIcon` (owns the roughness filter), `Footer`. `ArcDivider` waits for a full-width photo
  (§6). Until `Footer` exists, the landing carries a bare row with the two legal links, because
  `/privacy` must stay reachable from it.
- Parallax as a Svelte attachment (`{@attach parallax(depth)}`, `src/lib/bakery/parallax.ts`): one
  module-level pointer position and one `requestAnimationFrame` loop for every sticker on the
  page, which only runs while something is still easing. It writes the `translate` property,
  not `transform`, so it composes with the sticker's own `rotate` and entrance animation. A
  no-op unless `(pointer: fine) and (prefers-reduced-motion: no-preference)`.
- **No `settings.ts` yet, on purpose.** It was planned and then dropped on implementing it:
  there is no real environment variable to map. The site URL is a committed constant because a
  Vercel preview must declare the _production_ domain as canonical rather than itself; the
  WhatsApp number is content. An empty settings layer is the over-architecture the engineering
  standards forbid. Add it with the first real setting — most likely the Rust API's base URL.

## 13. What the tests guard

Written alongside the build, and each one has been mutation-checked — seen red for the reason
it claims to catch, then green again.

- `styles/tokens.spec.ts` — no raw colour in any component, and `app.html`'s `theme-color`
  meta matches `--color-canvas` in both themes (it cannot be a variable, so it is the one
  duplicate, and this is what stops it drifting).
- `styles/contrast.spec.ts` — compiles `_themes.scss` and recomputes every WCAG pair in both
  themes.
- `sitemap.xml/sitemap.spec.ts` — every `+page.svelte` on disk has a sitemap entry. The
  direction that bites is a page added without one: invisible to search, and nothing else
  would complain.
- `site.spec.ts` — canonical URLs are absolute and on the production domain; the RUT's check
  digit validates; the contact address is on the site's own domain.
- `e2e/site.e2e.ts` — no horizontal scroll at 400 px on any page (§10); the dark theme
  repaints from `prefers-color-scheme` with no toggle and no script; and **the legal pages
  render completely with JavaScript disabled**, because Meta's app reviewer is the audience
  for `/privacy` and their crawler may not run it. On the landing: the CTA points at the
  bakery's WhatsApp, and so does the nav's Pedidos — both written out in the test rather than
  imported, so a wrong number cannot pass by being copied; every `<img>` a reader can reach has a non-empty `alt`, and decoration inside an `aria-hidden` sticker states an empty one; and the page loads with **no
  console error**, which is how a CSP violation would otherwise ship unnoticed. The sticker
  parallax follows the pointer, and stays still under `prefers-reduced-motion: reduce` and on a
  touch screen.

**A caution paid for on 2026-09-13.** `playwright.config.ts` runs `pnpm build && pnpm preview`
as its web server and waits only for the port. If the build fails, `vite preview` happily
serves the _previous_ output and the suite passes — a broken build is indistinguishable from a
green one. Two mutation checks looked conclusive and were not. When mutating, confirm the
build compiled and that the built HTML actually changed before believing the result.
