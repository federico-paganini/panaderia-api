# Handoff — "Las Delicias" wordmark as SVG outlines

**For:** an agent or person on a Windows machine that has **Edwardian Script ITC** installed
(it ships with Microsoft Office).
**From:** the `panaderia-api` frontend. Written 2026-09-13.
**Effort:** one sitting. Everything below is mechanical once the font is present.

---

## 1. Why you and not us

The bakery's logo wordmark is set in Edwardian Script ITC. We are rebuilding the logo as SVG so it
can be recoloured by CSS and stop being a JPEG with a white background. Neither of our machines has
the font, and buying it only to trace twelve letters is not worth it.

We also cannot ship the font itself: Office bundles **desktop** rights, which do not cover webfont
embedding. But a logo converted to curves is _artwork_, not a redistributed font, and desktop
licences permit creating one. So the split is: you own the font, you produce the artwork, only the
artwork travels.

## 2. Hard constraints — what must NOT come back

- **Do not send the font file.** No `.ttf`, no `.otf`, no subset, not zipped, not "just for
  reference". It is not needed and it is not licensed to travel.
- **No `<text>` elements and no `@font-face` in the SVG.** Either one needs the font at render time,
  which defeats the entire purpose of this task.
- **No raster as the deliverable.** A PNG is welcome as a visual check (§6) but the artwork is
  vector paths.

## 3. The exact string

```
Las Delicias
```

Capital `L`, capital `D`, one ordinary space between the words. No accent, no period, no trailing
space. Font: **Edwardian Script ITC**, Regular weight, no italic/oblique slant applied on top (the
face is already slanted).

## 4. What it has to match

The reference image is attached to this message — the bakery's existing logo, a blue oval with the
wordmark in white across the middle. Three details in it are how we will judge the result:

1. The capital **L** has a long, flat horizontal swash running out of its base that **crosses back
   over itself** and underlines the `as`.
2. The capital **D** does the same thing under the `e`.
3. There is a small **teardrop-shaped dot** sitting free inside the bowl of the `L`.

Those flourishes may be default glyphs, or they may be OpenType **swash / stylistic / contextual
alternates**. Finding out is part of the job — see §5, step 3, and §7.

## 5. How to produce it

Any of Inkscape (free), Adobe Illustrator, or CorelDRAW works. Inkscape recipe, since it costs
nothing:

1. **Text tool** (`T`). Set font family `Edwardian Script ITC`, style Regular, size **300 px**.
2. Type `Las Delicias`.
3. **Try the alternates.** Open `Text → Text and Font`, and in the Variants/Features panel enable
   swash (`swsh`), stylistic alternates (`salt`) and contextual alternates (`calt`), one at a time.
   Keep whichever combination reproduces the crossing underline swashes from §4. If none of them
   do, that is a real finding — report it (§7) rather than faking the swash by hand.
4. **Duplicate the text object** (`Ctrl+D`) and move the copy aside. You are delivering two
   versions, one welded and one not — see §6.
5. On the first copy: `Path → Object to Path` (`Shift+Ctrl+C`), then `Path → Union` (`Ctrl+Plus`).
   Union welds the overlapping connected strokes of the script into one continuous shape, which is
   what stops seams showing when the mark is drawn at partial opacity.
6. On the second copy: `Path → Object to Path` only. **No union.** One subpath per glyph.
7. For each: select the artwork, then `File → Document Properties → Resize page to content`
   (`Ctrl+Shift+R`) so the page hugs the ink exactly.
8. `File → Save As…` → choose **Plain SVG**, not Inkscape SVG. Inkscape SVG carries a large
   `sodipodi`/`inkscape` namespace payload we would only have to strip.

## 6. Deliverables

| File                  | What it is                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `wordmark-union.svg`  | The welded version from step 5 — ideally a single `<path>`.                                                 |
| `wordmark-glyphs.svg` | The un-welded version from step 6 — one path per glyph, in reading order.                                   |
| `wordmark-check.png`  | Either version rendered at ~1200 px wide, white on a mid-blue ground, for eyeballing against the reference. |

Requirements on both SVG files:

- `viewBox` tight to the ink. No stray margin, no page-sized canvas around it.
- **No `transform` attributes left on the paths** — flatten them into the coordinates. A transform
  we do not notice is a mark that silently sits in the wrong place.
- No `fill` colour baked in, or `fill="currentColor"` if your tool insists on writing one. The mark
  gets recoloured by CSS custom properties on our side, including for dark mode.
- Coordinates rounded to 2 decimals. More is noise.
- No `<style>` blocks, no `<metadata>`, no editor namespaces, no embedded raster.
- Each file well under 100 KB. If `wordmark-union.svg` is much larger than that, the union probably
  failed and left hundreds of overlapping subpaths — check it.

## 7. Report back with the files

Short answers are fine:

1. **Which OpenType features did you end up enabling?** Name them, so the result is reproducible.
2. **Did the crossing underline swashes come out of the font, or not at all?** If not, say so
   plainly — we would then draw them by hand as separate paths, and it is far cheaper to know now
   than to discover it when the logo is being assembled.
3. **Which version of the font did you use?** (Right-click the font in `C:\Windows\Fonts` →
   Properties → Details → File version.) Different versions ship different glyph sets.
4. **The ink bounding box** of the union version in px at the 300 px setting, so we know the scale
   the coordinates are in.

## 8. What happens to it afterwards — context, not work for you

The paths become the wordmark inside a rebuilt logo that also carries a redrawn oval and ring, a
wheat ear drawn parametrically as SVG, and the arched "PANADERÍA Y CONFITERÍA" caps line — which we
are **not** asking you for, because we are deliberately re-setting it in Barlow Condensed, the
display face the rest of the site already uses. Keeping the paths colour-agnostic (§6) is what lets
the whole mark repaint for the dark theme.
