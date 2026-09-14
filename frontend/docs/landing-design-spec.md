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

- **Bakery only.** The party venue (Las Delicias – Party Times) gets its own landing later;
  do not fold it into this one.
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

`docs/assets/logo-las-delicias.jpg` — 447×447 JPEG, **white background, not transparent**.
On any non-white surface it shows as a white square. Until a vector or transparent version is
obtained from the owner, the logo sits on a deliberate white chip (radius 12, light shadow),
which also reads as one more paper cut-out. Ask for the vector.

**The white chip stops working in dark.** On `--color-canvas` at `#191510` a white JPEG is a
glaring white square — the chip was designed for a cream ground and on dark it reads as a bug.
The dark theme therefore makes an SVG logo a prerequisite, not an improvement.

**Settled 2026-09-13 — the wordmark is Edwardian Script ITC.** Identified from the letterforms
at 4× (the capital `L`'s flat swash crossing back over itself under `as`, the free teardrop
inside its bowl). It is a commercial Monotype face: Office bundles **desktop** rights only, so
it can never be served as a webfont from this domain. A logo converted to curves is artwork,
which the desktop licence does permit — so the wordmark ships as SVG paths and no font file is
involved. Neither of our machines has the font; the brief for someone who does is
[`handoff-wordmark-outlines.md`](handoff-wordmark-outlines.md).

Consequence for §5: **Great Vibes stays the site's script face.** It is free, already
self-hosted, and the same genre. A logo is a mark, not running text, so the two not matching
exactly is invisible — and licensing Edwardian for web would cost money for no gain.

The arched "PANADERÍA Y CONFITERÍA" line is **not** being reproduced from the original: it is
re-set in Barlow Condensed, the display face the rest of the site already uses. Free, and it
ties the mark to the pages.

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
darker than the canvas" — ideas that have to be re-decided against real photography, which
does not exist yet. The values above keep nothing undefined in the meantime. Revisit when the
photos land.

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

**Nav** — 72 px. Logo chip (white, radius 12, 52 px logo) + wordmark + caps line on the
left; four links in condensed 17 px on the right (Productos · Nosotros · Dónde estamos ·
Pedidos). Background is the canvas (B) or solid brand blue (C).

**Hero** — 560 px. Full-bleed photo with a vertical dark gradient overlay (10% → 45%) for
legibility; centred stack: display headline, script accent, one info line, one CTA pill, a
small hand-drawn down arrow. Three or four paper stickers float over it. The bottom edge is
an SVG arc filled with the canvas colour:
`viewBox 0 0 1200 90`, path `M0,90 L0,74 Q560,-30 1200,44 L1200,90 Z`, `preserveAspectRatio="none"`.

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

Content: an ink icon (section 7) plus a short script phrase. Parallax: translate each
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

**Settled 2026-09-13 — the wheat ear is one parametric SVG symbol, painted two ways.** The
logo's ears are solid and shaded; the icon set is monoline ink. Drawing them separately would
give the brand two hands. Instead one geometry renders either filled in gold (logo) or
stroked in brand blue under the roughness filter (icons). Chosen on the prototype:

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

**Improvement over the original, agreed with Federico:** keep the tips overflowing past the
oval — that is what stops the mark being a sealed badge — but cross the stems lower and
tighter, with a small tie at the crossing, so the eye reads two ears instead of a tangle.

- Subjects, keep the set to eight or fewer: medialuna, flauta, tray of bizcochos, torta,
  taza de café, paper bag, the shopfront, a wheat ear alone.
- If the SVG approximation is not good enough for the final site, commission an illustrated
  set — delivered as SVG or transparent PNG, never JPG on white.

## 8. Copy

Spanish, as content. Known facts are used verbatim; unknown facts are bracketed placeholders
and must be filled, never invented.

- Headline stack: **PAN Y BIZCOCHOS** / _recién horneados_
- Info line: `Panadería y Confitería · Lavalleja 714 · Las Piedras, Canelones`
- CTA: **Pedí por WhatsApp** → `https://wa.me/[NÚMERO]`
- Sticker phrases: _recién horneado_ · _bizcochos_ · _medialunas_ · _Las Piedras_
- Section: **LOS CLÁSICOS** / _de la casa_ — the categories Bizcochos / Panes / Tortas in the
  sketch are **samples**, not the menu.
- Placeholders: `[HORARIO]`, `[NÚMERO DE WHATSAPP]`, every `[FOTO]`.

## 9. Motion

- Sticker parallax as specified above.
- One reveal on load: stickers settle in (small rotation and opacity), nothing else animates
  on entry.
- Cards lift subtly on hover.
- Everything respects `prefers-reduced-motion`.

## 10. Responsive

At ≤ 768 px: headline 48 / accent 40; keep two stickers, shrink them; flatten the slab angle;
cards stack; nav collapses to logo chip + the WhatsApp CTA. Gutter never below 16 px. The
body must never scroll horizontally.

## 11. Inputs — state on 2026-09-14

Still missing:

| Input                                                                                   | Needed for                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Photos: shopfront, counter/vitrina, products (landscape for the hero, square for cards) | Everything — the aesthetic is 70% photography; also the dark palette for the landing's own surfaces (§4), which cannot be decided against nothing                                                                                 |
| WhatsApp number                                                                         | The hero CTA link, which currently points nowhere                                                                                                                                                                                 |
| A contact e-mail alias on the domain                                                    | **The last thing between the WhatsApp bot and production.** `/privacy` is live and correct, but it publishes that address as the channel for exercising rights under Ley 18.331 and the zone has no `MX` records, so mail bounces |
| `Las Delicias` as SVG outlines                                                          | The logo's wordmark, provisional in Great Vibes meanwhile. Needs a Windows machine with Edwardian Script ITC; brief at `handoff-wordmark-outlines.md`                                                                             |

Resolved:

| Input                    | Answer                                                                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain                   | `lasdeliciaslp.com`, live on Vercel since 2026-09-14 with an automatic Let's Encrypt certificate                                                     |
| Hosting and deploy       | Vercel, deployed by CI on every push to `main` that passes the frontend gate                                                                         |
| Legal entity and RUT     | GERALNA LTDA., RUT `080097130018` (check digit verified) — `src/lib/legal/entity.ts`                                                                 |
| Privacy policy and terms | Written and **published** at `/privacy` and `/terms`                                                                                                 |
| Retention period         | 30 days. Published, so it now constrains the bot's storage decision                                                                                  |
| Opening hours            | Mon–Sat, 7:30–21:00 in person and 8:00–20:00 by phone — kept as two ranges in `$lib/site`, because flattening them misleads whoever arrives at 20:30 |
| Logo typeface            | Edwardian Script ITC (§3)                                                                                                                            |

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
- **Legal pages are a route group**, `src/routes/(legal)/`, so `privacy` and `terms` share a
  layout without the group appearing in the URL. That layout owns all the prose typography via
  `:global()`; each page is content only.
- Components still to build: `Nav`, `Hero`, `Sticker`, `ArcDivider`, `Slab`, `ClassicCard`,
  `IconRow`, `InkIcon` (owns the roughness filter), `Footer`.
- Parallax as a Svelte action (`use:parallax={{ depth }}`) reading pointer position from a
  shared store, one `requestAnimationFrame` loop for all stickers, guarded by the pointer and
  reduced-motion media queries.
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
  for `/privacy` and their crawler may not run it.

**A caution paid for on 2026-09-13.** `playwright.config.ts` runs `pnpm build && pnpm preview`
as its web server and waits only for the port. If the build fails, `vite preview` happily
serves the _previous_ output and the suite passes — a broken build is indistinguishable from a
green one. Two mutation checks looked conclusive and were not. When mutating, confirm the
build compiled and that the built HTML actually changed before believing the result.
