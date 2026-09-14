# frontend

The public site for Panadería y Confitería Las Delicias, live at
**[lasdeliciaslp.com](https://lasdeliciaslp.com)**.

SvelteKit with Svelte 5 runes, TypeScript strict, SCSS, deployed to Vercel. Every route is
prerendered — there is no server-side work to do, and building it as static output is what
makes the legal pages readable without JavaScript.

## Running it

```bash
pnpm install
pnpm dev
```

| Command                | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `pnpm check`           | svelte-check over the whole project              |
| `pnpm lint`            | Prettier + ESLint                                |
| `pnpm test:unit --run` | Vitest                                           |
| `pnpm test:e2e`        | Playwright (builds first, unless `CI` is set)    |
| `pnpm build`           | Produces `.vercel/output` via the Vercel adapter |

Run all of them in that order before calling something done — it is exactly what the CI gate
does, and the list lives in [`docs/CI.md`](docs/CI.md).

## Routes

| Route                         | Notes                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| `/`                           | The landing. Still a placeholder; the design spec has the plan                                     |
| `/privacy`                    | Privacy policy. **On the WhatsApp bot's critical path** — Meta will not publish the app without it |
| `/terms`                      | Terms of use                                                                                       |
| `/robots.txt`, `/sitemap.xml` | Generated from one route list, so a page cannot exist without an entry                             |

Route names are English per the repository convention while the copy is Spanish (es-UY). The
legal pages sit in a `(legal)` route group, so they share a layout without the group appearing
in the URL.

## Conventions worth knowing before editing

- **No component writes a literal colour.** Every colour is a `var(--color-*)` token defined in
  `src/lib/styles/_themes.scss`, which is the only file allowed to hold one. A test enforces it,
  in style blocks _and_ in SVG paint attributes. That discipline is what makes the dark theme
  cheap, and dropping it is what would make a third theme expensive.
- **Svelte config lives in `svelte.config.js`, not inline in `vite.config.ts`.** `svelte-check`
  reads only that file; with the config inline it silently skips every component carrying
  `<style lang="scss">` and still reports zero errors.
- **Internal links go through `resolve()`** from `$app/paths` — ESLint enforces it and it
  type-checks that the route exists.

## Documentation

- [`docs/landing-design-spec.md`](docs/landing-design-spec.md) — the design decisions, what is
  settled and what is still open.
- [`docs/CI.md`](docs/CI.md) — the gate, the Vercel deploy, the domain and its certificate.
- [`docs/handoff-wordmark-outlines.md`](docs/handoff-wordmark-outlines.md) — a brief for
  whoever has Edwardian Script ITC.
