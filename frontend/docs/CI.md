# CI — frontend

The site's quality gate and its deploy. Repo-wide matters — the branch model, why the gates are
split by path, Dependabot — live in [`../../docs/CI.md`](../../docs/CI.md).

## The gate

`quality-frontend.yml`, one fail-fast job: audit → typecheck → lint → unit → build → e2e. It
runs on pull requests to and pushes on `main` and `claude-master`, filtered to `frontend/**`.

Locally, in the same order, from `frontend/`:

```bash
pnpm install --frozen-lockfile
pnpm audit --audit-level high
pnpm check
pnpm lint
pnpm test:unit --run
pnpm build
pnpm test:e2e
```

Playwright's browsers are cached on the lockfile hash and installed **before** the unit step,
not just before e2e: the Vitest `client` project runs component specs in headless chromium.

**Deviation from `ENGINEERING.md`'s precedent:** this gate audits dependencies and
`eron-client-sv` does not. The written standard puts a vulnerability audit in the gate and only
the C# repo implements it; `pnpm audit` is free here, so the document wins over the precedent.
Pinned at `--audit-level high` so a moderate advisory in a dev dependency does not block
unrelated work.

## Deploying

`deploy-prod.yml` chains on this gate's completion (`workflow_run`) rather than on
`push: branches: [main]`.

`push` only orders correctly when the gate is a **required status check**, so nothing can reach
`main` without passing. It cannot be one here — a path-filtered workflow that gets skipped never
reports a status — so a plain `push` trigger would happily deploy a red build. Chaining on the
conclusion is what actually stops it.

Two consequences:

- A push to `main` touching only `backend/` or `docs/` never runs this gate, so it never
  deploys. That is right: nothing changed in the site. `workflow_dispatch` covers the case where
  you want one anyway.
- It couples to this gate's exact display name. **Renaming "Quality gate (frontend)" silently
  stops every deploy.**

The checkout pins `github.event.workflow_run.head_sha`: a `workflow_run` job otherwise checks out
the default branch's tip, which is not necessarily the revision that passed.

### What the workflow does, and why those exact steps

`vercel pull --yes --environment=production` → `vercel build --prod` →
`vercel deploy --prebuilt --prod`. That is Vercel's own documented CI shape: `--prebuilt` splits
the build from the ship, so the build can be cached and gated at our level rather than run
opaquely on their side.

Three details that are corrections, not preferences:

- **Authentication is the `VERCEL_TOKEN` environment variable, not `--token`.** A flag lands in
  the runner's process listing, where any other step on that machine can read it. Vercel's CI
  guidance says so explicitly, and the first version of this workflow got it wrong.
- **The CLI version is pinned**, not `@latest`. Vercel's guidance is explicit that a CLI updating
  itself under the pipeline turns an unrelated release into a failed deploy.
- **The CLI is installed with `npm`, not `pnpm add --global`.** pnpm's global bin directory is not
  on `PATH` until `pnpm setup` has run, which it has not on a fresh runner —
  `ERR_PNPM_GLOBAL_BIN_DIR_NOT_IN_PATH`, the same failure that bites locally. npm's global bin is
  already on `PATH` via `setup-node`.
- **There is no explicit `pnpm install`.** `vercel build` performs its own install in the project
  directory; an extra one only pays for it twice. pnpm still has to _exist_ for that install to
  use, which is what the `pnpm/action-setup` step is for.

### Secrets

| Secret              | Where it comes from                                                             |
| ------------------- | ------------------------------------------------------------------------------- |
| `VERCEL_TOKEN`      | Vercel → Account Settings → Tokens. Scope it to the team that owns the project. |
| `VERCEL_ORG_ID`     | `frontend/.vercel/project.json`, after running `vercel link` once, locally.     |
| `VERCEL_PROJECT_ID` | same file.                                                                      |

`.vercel/` is gitignored, so `project.json` never reaches the repository — only the two ids it
contains, as secrets.

Each is read through `env`, never interpolated into a script body. `${{ }}` is substituted
**before** the shell parses the line, so shell syntax inside a variable would execute on a runner
that is holding the deploy credentials.

The gate itself reads no secret, and declares `permissions: contents: read` with
`persist-credentials: false` on checkout.

### Setting the Vercel project up — one time, by hand

1. Create the project in Vercel from this repository.
2. **Root Directory: `frontend`.** This is a monorepo; the default of `/` finds no app and the
   failure is confusing.
3. **Turn Vercel's own Git deploys off**, or the two paths race and Vercel ships builds the gate
   never saw. Either disconnect the Git integration, or set Settings → Git → _Ignored Build Step_
   to a command that always skips. Mind the inverted convention: exit code **1** means _continue
   the build_, and any other code **cancels** it — so `exit 0` is the one that skips. Confirm it
   in the UI rather than trusting this line.
4. Run `vercel link` once inside `frontend/` to produce `.vercel/project.json`, and copy the two
   ids into the repository secrets along with a token.

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

## First run, 2026-09-13

Green on `f5c58d5`: audit, typecheck, lint, 58 unit tests, build, 13 e2e.

## Traps paid for

- **A green Playwright run can hide a failed build.** `playwright.config.ts` starts its own web
  server and the runner waits only for the port to open. If `pnpm build` fails, `pnpm preview`
  serves the _previous_ output and the suite passes against stale code. Two mutation checks
  looked conclusive on 2026-09-13 and were not. Confirm the build compiled before believing a
  test result.
- The config skips its own rebuild when `CI` is set, because the gate already built. Locally it
  still builds, so `pnpm test:e2e` on a laptop never tests a stale bundle.
