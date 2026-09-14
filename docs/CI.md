# CI

Two quality gates, one per stack. Written 2026-09-13.

## Branch model

```text
working-branch  →  claude-master  →  main
      ↓                  ↓             ↓
  gate (PR)         gate (push)   gate (push)
```

No preview tier. The site deploys to Vercel from `main` via `deploy-prod.yml`; the backend has
nowhere to deploy to yet. The deploy workflow carries **no quality steps** (`ENGINEERING.md`):
pull settings, build, ship — queued rather than cancelled so concurrent merges serialise.

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

Neither **gate** reads a secret. Both declare `permissions: contents: read` with
`persist-credentials: false` on checkout — nothing there needs authenticated git, so the token
is not left behind in `.git/config`.

The **deploy** needs three repository secrets:

| Secret              | Where it comes from                                                             |
| ------------------- | ------------------------------------------------------------------------------- |
| `VERCEL_TOKEN`      | Vercel → Account Settings → Tokens. Scope it to the team that owns the project. |
| `VERCEL_ORG_ID`     | `frontend/.vercel/project.json` after running `vercel link` once, locally.      |
| `VERCEL_PROJECT_ID` | same file.                                                                      |

`.vercel/` is gitignored, so `project.json` never reaches the repository — only the two ids it
contains, as secrets.

Every one of them is read through `env`, never interpolated into a script body. `${{ }}` is
substituted **before** the shell parses the line, so shell syntax inside a variable would
execute on a runner that is holding the deploy credentials.

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

## Deploying

`deploy-prod.yml`. It chains on the frontend gate's completion (`workflow_run`) rather than on
`push: branches: [main]`, which is the obvious shape and the wrong one here.

`push` only orders correctly when the gate is a **required status check**, so nothing can reach
`main` without passing. These gates are not required — a path-filtered workflow that gets
skipped never reports a status — so a plain `push` trigger would deploy a red build. Chaining
on the gate's own conclusion is what actually guarantees it cannot.

Two consequences:

- A push to `main` touching only `backend/` or `docs/` never runs the frontend gate, so it
  never deploys. That is right: nothing changed in the site. `workflow_dispatch` is there for
  when you want a deploy anyway.
- The workflow couples to the gate's exact display name. **Renaming
  "Quality gate (frontend)" silently stops every deploy.**

The checkout pins `github.event.workflow_run.head_sha`: a `workflow_run` job otherwise checks
out the default branch's tip, which is not necessarily the commit that was verified.

### Setting the Vercel project up — one time, by hand

1. Create the project in Vercel from this repository.
2. **Root Directory: `frontend`.** This is a monorepo; the default of `/` finds no app and the
   failure is confusing.
3. **Turn Vercel's own Git deploys off**, or the two paths race and Vercel ships builds our gate
   never saw. Either disconnect the Git integration, or set Settings → Git → _Ignored Build
   Step_ to a command that always skips. Mind the inverted convention there: exit code **1**
   means _continue the build_, and any other code **cancels** it — so `exit 0` is the one that
   skips. Confirm it in the UI rather than trusting this line.
4. Run `vercel link` once inside `frontend/` to produce `.vercel/project.json`, and copy the two
   ids into the repository secrets above along with a token.

### Pointing lasdeliciaslp.com at it — GoDaddy

Add both `lasdeliciaslp.com` and `www.lasdeliciaslp.com` in the Vercel project's Domains tab.
Vercel then shows the exact records to create; use those values rather than any written here,
since they change.

Keep DNS at GoDaddy and add only those records. **Do not move the nameservers to Vercel** — and
this is not a preference:

> The privacy policy publishes a contact address on this same domain, and e-mail needs MX
> records. Nameservers at GoDaddy means the mail alias is configured where it already lives.
> Moving them to Vercel moves the whole zone, and the MX records have to be recreated there or
> mail silently stops arriving — at the address the legal page tells people to write to.

GoDaddy's own friction: it has no ALIAS/ANAME at the apex, so the apex uses the plain `A` record
Vercel gives. Its parked defaults (an `A` on `@` pointing at GoDaddy's parking page, and a
`CNAME` on `www`) have to be removed first, or the new records sit alongside them and resolution
is a coin toss.

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

## First run, 2026-09-13 — what actually happened

Pushed to `claude-master` at `f5c58d5`. Both gates ran, because the bootstrap push touches both
areas and GitHub evaluates `paths` against the whole push range; later single-area pushes will
run one gate each.

- **Frontend gate: green.** Audit, typecheck, lint, 58 unit tests, build, 13 e2e.
- **Backend gate: red**, on the audit step.

### Open: RUSTSEC-2026-0235 in `rkyv` 0.7.46

`cargo audit` found it on the first run, and `fail-fast` then **skipped** format, clippy and
tests — so the two known `main.rs` problems below were never even reported. That is the gate
working, but it is worth knowing that an audit failure hides everything after it.

The advisory is real. Whether it reaches this binary is a different question, and the evidence
says it does not:

- `rkyv` is declared by `rust_decimal` 1.42.1 as an **optional** dependency behind a feature.
- That feature is not enabled here: `cargo tree --invert rkyv --target all` prints nothing,
  meaning nothing in the build graph reaches it.
- It is in `Cargo.lock` regardless, and `cargo audit` scans the lockfile without resolving
  features — so it reports a crate that is never compiled into the binary.

**This needs a decision, and it is not one to take quietly.** Silencing it means an
`audit.toml` with `ignore = ["RUSTSEC-2026-0235"]`, which narrows a security check; the
alternative is to leave the gate red until `rust_decimal` bumps its optional dependency. Either
way the reasoning belongs here, with a date, so the next person does not find a bare ignore and
have to guess.

### Still open on `main.rs`, behind the audit failure

Both are the author's own code and both will surface once the audit step is resolved:

- `cargo fmt --check` — no trailing newline.
- `cargo clippy` — `#[tokio::main]` sits on a synchronous `fn main()`. The macro rewrites an
  `async fn main` into a sync one that builds the runtime and blocks on the returned future;
  with no `async` there is no future to drive, so it rejects the declaration.

### Pending confirmation

Federico will confirm the backend gate's first green run **when his Fable usage resets**. Until
then, the backend gate has never been seen green end to end, and nothing here should be
described as verified.

## Traps paid for

- **A green Playwright run can hide a failed build.** `playwright.config.ts` starts its own
  web server and the runner waits only for the port to open. If `pnpm build` fails,
  `pnpm preview` serves the _previous_ output and the suite passes against stale code. Two
  mutation checks looked conclusive on 2026-09-13 and were not. Always confirm the build
  compiled before believing a test result.
- **A tool's cache must not be keyed on the project's lockfile.** `cargo-audit` was first
  cached alongside `~/.cargo/registry` under a `Cargo.lock` key, so every dependency bump
  invalidated it and recompiled the audit tool from source — precisely when Dependabot produces
  the most runs. It now has its own cache keyed on a pinned `CARGO_AUDIT_VERSION`, so the
  compile is paid once per tool version. The install step also lost a `|| true` that would have
  let a failed install skip the audit silently.
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
