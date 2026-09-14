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

`pnpm install` → `pnpm build` → `vercel deploy --prebuilt --prod`. Three steps, and the two
missing ones are the interesting part.

Vercel's documented CI shape is `vercel pull` → `vercel build` → `vercel deploy --prebuilt`.
Both of the first two are absent here, for two independent reasons that happen to agree:

- **`vercel build` has nothing to do.** The SvelteKit Vercel adapter already writes the Build
  Output API directory (`.vercel/output`) as part of `pnpm build`. Running Vercel's builder over
  it would only rebuild what exists.
- **`vercel pull` and `vercel build` resolve the authenticated user before doing anything**, and
  a **project-scoped** token cannot — it reads its own project and nothing else, which is the
  whole point of it. `deploy --prebuilt` makes no such call. Verified the hard way: with a
  project token, `pull` fails with "Could not retrieve Project Settings", `pull --scope` fails
  with "Not able to load user", and `deploy --prebuilt` succeeds.

So the token stays scoped to `lasdelicias-web-client` instead of the account. Vercel's token
dialog offers exactly two scopes — one project, or full account — and the account-wide one is
not needed here.

**The consequence to remember:** without `vercel pull`, environment variables configured in
Vercel's dashboard never reach this build. There are none today. The day there are, they have to
arrive as repository secrets in this workflow, not from Vercel.

Three more details that are corrections, not preferences:

- **Authentication is the `VERCEL_TOKEN` environment variable, not `--token`.** A flag lands in
  the runner's process listing, where any other step on that machine can read it. Vercel's CI
  guidance says so explicitly, and the first version of this workflow got it wrong.
- **The CLI version is pinned**, not `@latest`. Vercel's guidance is explicit that a CLI updating
  itself under the pipeline turns an unrelated release into a failed deploy.
- **The CLI is installed with `npm`, not `pnpm add --global`.** pnpm's global bin directory is not
  on `PATH` until `pnpm setup` has run, which it has not on a fresh runner —
  `ERR_PNPM_GLOBAL_BIN_DIR_NOT_IN_PATH`, the same failure that bites locally. npm's global bin is
  already on `PATH` via `setup-node`.

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

Done on 2026-09-14. The domain is attached and verified on the project; what follows is the
record of what was set and the rules for changing it.

`vercel domains verify <domain>` prints the records Vercel wants, which is where these came
from. Re-read them from there before reconfiguring rather than trusting this table — it is a
record of what was set, not a specification.

| Type    | Name  | Value                                  |
| ------- | ----- | -------------------------------------- |
| `A`     | `@`   | `216.198.79.1`                         |
| `A`     | `@`   | `64.29.17.1`                           |
| `CNAME` | `www` | `e2a0bdd63786450c.vercel-dns-017.com.` |

Both `A` records, not one: they are Vercel's anycast addresses and having the pair is the
failover. The `www` value is specific to this project, not a generic Vercel hostname.

GoDaddy's parked defaults — an `A` on `@` pointing at its parking page (`13.248.243.5`,
`76.223.105.230`) and a `CNAME` on `www` — have to be **deleted first**. Left in place they sit
alongside the new ones and resolution becomes a coin toss: neither broken nor working, which is
the hardest kind of failure to read. GoDaddy also has no ALIAS/ANAME at the apex, so the apex
must use plain `A` records.

**TTL: 3600, matching the zone's other records.** These values essentially never change, so a
short TTL only buys extra lookups. The discipline that matters is the order:

> Lower the TTL **before** a planned change, never after discovering you need one. Drop to 600,
> wait out the old TTL, then change the records. Raising first and needing an urgent change
> afterwards leaves up to an hour where some resolvers answer with the old address and some with
> the new — not broken, not working, both at once.

**Do not move the nameservers to Vercel.** The zone holds no `MX` records today (checked
2026-09-14 — none, and no `TXT` either), so nothing would be lost this minute. The reason is
prospective: the privacy policy publishes a contact address on this domain, that alias will need
`MX` records, and they belong where the domain is administered. Moving the zone to Vercel means
recreating them there or mail silently stops arriving — at the address the legal page tells
people to write to.

### Certificate — nobody runs certbot here, and why

Issued automatically by **Let's Encrypt** the moment DNS resolved: 90 days of validity, renewed
by Vercel at around 60. Nothing was bought, installed or configured.

It is worth knowing the mechanism, because the parts that can break it are not obvious.

Vercel runs an ACME client — the same protocol `certbot` speaks, just operated by someone else.
Let's Encrypt asks it to publish a specific value at a path on the domain and then fetches that
path over **port 80**. Control of the DNS is the proof of ownership; there is no other check.

That is what the odd minute during setup was: HTTP answering `200` with `Server: Vercel` and no
`<title>` was the challenge being served. It also explains the ordering — attempting issuance
before the GoDaddy records changed would have sent the challenge to the parking page and failed.

Expect a few minutes of `000` and TLS handshake errors on individual paths right after issuance,
while the certificate propagates across edge nodes: `/` can succeed while `/privacy` fails on the
same host. That is propagation, not misconfiguration. Re-check before changing anything.

**Two things would break renewal, both quietly:**

- **A `CAA` record that omits `letsencrypt.org`.** The zone has none today (checked 2026-09-14).
  Adding one that forbids the issuer does not break anything immediately — the current
  certificate keeps working. Renewals start failing, and the site goes down about two months
  later, long after the change that caused it. It is one of the hardest self-inflicted outages to
  trace backwards.
- **DNS no longer resolving to Vercel.** The same thing that proved ownership is what keeps
  proving it every renewal.

**This is free here because the site is on a PaaS.** When the Rust API or the WhatsApp bot land
on a VPS, none of it comes along: Meta's webhooks only go to HTTPS, so a real certificate is
required there too. Reach for **Caddy** before nginx + certbot — it does ACME natively, so
issuance and renewal need no cron job and no renewal hook. See `~/Code/panaderia-bot`.

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
