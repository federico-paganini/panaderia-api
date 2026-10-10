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

| Route                                                        | Notes                                                                                              |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `/`                                                          | The landing. The nav and the hero are built; the remaining sections are planned in the design spec |
| `/privacy`                                                   | Privacy policy. **On the WhatsApp bot's critical path** — Meta will not publish the app without it |
| `/terms`                                                     | Terms of use                                                                                       |
| `/party-times`, `/party-times/privacy`, `/party-times/terms` | The party venue, a separate company: skeleton pages, `noindex` until its legal facts arrive        |
| `/robots.txt`, `/sitemap.xml`                                | Generated from one route list, so a page cannot exist without an entry                             |

Route names are English per the repository convention while the copy is Spanish (es-UY). The
site publishes two businesses: the bakery's pages sit in a `(bakery)` route group and the party
venue's — `/party-times`, `/party-times/privacy`, `/party-times/terms`, a skeleton until its
legal facts arrive — in `(party-times)`. Each group loads its brand, and the shared components
render whichever brand the page belongs to (spec §12).

## Conventions worth knowing before editing

- **No component writes a literal colour.** Every colour is a `var(--color-*)` token defined in
  `src/lib/styles/_themes.scss`, which is the only file allowed to hold one. A test enforces it,
  in style blocks _and_ in SVG paint attributes. That discipline is what makes the dark theme
  cheap, and dropping it is what would make a third theme expensive.
- **SvelteKit 3: the whole Svelte config is in `vite.config.ts`**, passed to the `sveltekit()`
  plugin; there is no `svelte.config.js`. `svelte-check` reads it from there — checked by
  mutation, since under SvelteKit 2 an inline config made it skip every SCSS component in
  silence.
- **Library imports use `#lib/…` with the file extension** (`#lib/bakery/brand.js`), a
  `package.json` subpath import; `$lib` is gone in SvelteKit 3. Sass still reaches the design
  scale with `@use 'styles' as *`, through its own `loadPaths`.
- **Photos are shown only through `src/lib/shared/Photo.svelte`**, never with `<enhanced:img>` in a
  component that has SCSS — the plugin parses the file before Sass does, and the build fails
  with an error that points nowhere near the cause. The spec's §12 has the detail.
- **Internal links go through `resolve()`** from `$app/paths` — ESLint enforces it and it
  type-checks that the route exists.

## Documentation

- [`docs/landing-design-spec.md`](docs/landing-design-spec.md) — the design decisions, what is
  settled and what is still open.
- [`docs/CI.md`](docs/CI.md) — the gate, the Vercel deploy, the domain and its certificate.
