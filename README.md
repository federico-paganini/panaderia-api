# panaderia-api

Panadería y Confitería **Las Delicias** — Lavalleja 714, Las Piedras, Canelones, Uruguay.
Legal entity GERALNA LTDA.

Two things live here, deliberately in one repository and deliberately independent:

|                          | What                                          | State                                                      |
| ------------------------ | --------------------------------------------- | ---------------------------------------------------------- |
| [`frontend/`](frontend/) | The bakery's public site, SvelteKit on Vercel | **Live** at [lasdeliciaslp.com](https://lasdeliciaslp.com) |
| [`backend/`](backend/)   | The bakery API, Rust with Axum and SeaORM     | Skeleton; compiles and passes its gate, does nothing yet   |

A third piece is a separate repository: [`panaderia-bot`](https://github.com/federico-paganini/panaderia-bot),
the WhatsApp assistant for the party venue. It is coupled to this one in exactly one place —
it cannot be published until this site serves a public privacy policy, which it now does at
[`/privacy`](https://lasdeliciaslp.com/privacy).

## Getting started

The two stacks share nothing but the repository. Work in one without installing the other.

```bash
# Site
cd frontend && pnpm install && pnpm dev

# API
cd backend && cargo run
```

## Documentation

Each stack documents itself; only what is true of the whole repository sits at the root.

- [`docs/CI.md`](docs/CI.md) — branch model, why the gates are split by path, Dependabot.
- [`frontend/docs/`](frontend/docs/) — the [design spec](frontend/docs/landing-design-spec.md),
  the [CI and deploy runbook](frontend/docs/CI.md), and the
  [wordmark handoff](frontend/docs/handoff-wordmark-outlines.md).
- [`backend/docs/CI.md`](backend/docs/CI.md) — the Rust gate and its open items.

That split is a rule, not an accident: an agent or a person working on the API should not have
to read a GoDaddy runbook to find out how to run `cargo clippy`.

## Working here

Branches promote one way: a working branch → `claude-master` → `main`. There is no preview
tier. A push to `main` that passes the frontend gate deploys the site automatically.

Three quality gates run, each filtered to the files it cares about, so a change to the site
never compiles Rust and a change to a document never runs an end-to-end suite. Details in
[`docs/CI.md`](docs/CI.md).
