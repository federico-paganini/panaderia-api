# CI

Two quality gates, one per stack. Written 2026-09-13.

## Branch model

```text
working-branch  →  claude-master  →  main
      ↓                  ↓             ↓
  gate (PR)         gate (push)   gate (push)
```

No preview tier and no deploy workflow yet — the frontend deploys through Vercel's own Git
integration, and the backend has nowhere to deploy to. When either changes, deploys go in
their own workflow with **no quality steps inside them** (`ENGINEERING.md`): build, push, roll
out, queued rather than cancelled so concurrent merges serialise.

`claude-master` does not exist yet. The workflows already name it, so it works the day it is
created.

## The two gates

| Workflow               | Runs when                          | Steps                                         |
| ---------------------- | ---------------------------------- | --------------------------------------------- |
| `quality-frontend.yml` | anything under `frontend/` changes | audit → typecheck → lint → unit → build → e2e |
| `quality-backend.yml`  | anything under `backend/` changes  | audit → fmt → clippy → test                   |

Each also triggers on a change to its own file, so editing a gate re-runs it.

Both cancel a superseded **pull-request** run and never cancel a **push** run. A cancelled run
on a deployable branch leaves that commit with no status, which reads as "not checked" rather
than "passed" — the opposite of the point.

## The path filter, and what it costs

Splitting by `paths` is why a frontend change does not spend twenty minutes compiling Rust.

**The trap, before branch protection is ever turned on:** a workflow that the path filter
_skips_ never reports a status at all. If it is a **required status check**, the pull request
waits forever for a result that will never arrive. GitHub does not warn about this.

Today neither gate is required, so this is only a note. If required checks are wanted, do not
mark these two — replace them with a single always-running workflow that computes what changed
(a `changes` job), dispatches the real jobs with `if:` conditions, and ends in a `gate` job
with `if: always()` that fails when any needed job failed. Make **that** job the required
check: it always runs, so it always reports.

## Secrets and variables

None. Neither gate reads a secret, and both declare `permissions: contents: read` with
`persist-credentials: false` on checkout — nothing here needs authenticated git, so the token
is not left behind in `.git/config`.

Vercel holds its own deploy credentials; they never pass through these workflows.

## Dependabot

`.github/dependabot.yml`. Three ecosystems, weekly on Monday 04:00 Montevideo: **npm** in
`/frontend`, **cargo** in `/backend`, **github-actions** in `/`.

All three target `claude-master`, per `ENGINEERING.md`: bumps enter at the integration branch
so every working branch inherits current dependencies, instead of landing on `main` behind the
branch people actually work on.

Minor and patch bumps are grouped into one rollup per ecosystem so there is a single PR to
review; majors get their own PR, which is where breakage lives.

Two things that bite:

1. **`claude-master` must exist** before this file reaches `main`. Dependabot errors on every
   run against a target branch it cannot find.
2. **Dependabot reads the config from the default branch**, so editing it on a working branch
   changes nothing until that edit lands on `main`.

The directories line up with the gates' `paths` filters, so a Dependabot PR runs exactly the
gate it concerns and no other.

## Running the gate locally

Frontend, in order, from `frontend/`:

```bash
pnpm install --frozen-lockfile
pnpm audit --audit-level high
pnpm check
pnpm lint
pnpm test:unit --run
pnpm build
pnpm test:e2e
```

Backend, from `backend/`:

```bash
cargo audit          # cargo install cargo-audit --locked, once
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test
```

## Known-red on first push

The backend gate fails today, on the author's own code, which is what it is for:

- `cargo fmt --check` — `src/main.rs` has no trailing newline.
- `cargo clippy` — `#[tokio::main]` sits on a synchronous `fn main()`. The macro rewrites an
  `async fn main` into a sync one that builds the runtime and blocks on the returned future;
  with no `async` there is no future to drive, so it rejects the declaration.

## Traps paid for

- **A green Playwright run can hide a failed build.** `playwright.config.ts` starts its own
  web server and the runner waits only for the port to open. If `pnpm build` fails,
  `pnpm preview` serves the _previous_ output and the suite passes against stale code. Two
  mutation checks looked conclusive on 2026-09-13 and were not. Always confirm the build
  compiled before believing a test result.
- The frontend config skips its rebuild when `CI` is set, because the gate already built.
  Locally it still builds, so `pnpm test:e2e` on a laptop never tests a stale bundle.

## Deviations from `ENGINEERING.md`, deliberate

- **Two gates, not one.** The standard asks for a single gate — "one job, one red dot to
  read". That assumes one stack per repository. This repository holds a Rust API and a
  SvelteKit site, and running both on every push is the waste the split exists to avoid. Each
  gate is still a single fail-fast job.
- **The frontend audits dependencies, which `eron-client-sv` does not.** The written standard
  puts a vulnerability audit in the gate; only the C# repo actually implements it. `pnpm audit`
  is free here, so the document wins over the precedent. Pinned at `--audit-level high` so a
  moderate advisory in a dev dependency does not block unrelated work.
- **Actions are pinned by tag, not by commit SHA.** `eron-client-sv` pins SHAs;
  `eron-backend-csharp` uses tags. Tags are chosen here for a single-maintainer repository
  with no third-party actions beyond `pnpm/action-setup`. Revisit if that list grows.
