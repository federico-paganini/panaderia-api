# CI — shared

What is true of the **repository as a whole**. Everything stack-specific lives with its stack:

- **[`frontend/docs/CI.md`](../frontend/docs/CI.md)** — the site's gate, the Vercel deploy, the
  domain, its secrets.
- **[`backend/docs/CI.md`](../backend/docs/CI.md)** — the Rust gate and its open items.

Keep it that way. An agent working on the API should not have to read a GoDaddy runbook to find
out how to run `cargo clippy`.

## Branch model

```text
working-branch  →  claude-master  →  main
      ↓                  ↓             ↓
  gate (PR)         gate (push)   gate (push) + deploy
```

No preview tier. The site deploys to Vercel from `main`; the backend has nowhere to deploy to
yet. The deploy carries **no quality steps** (`ENGINEERING.md`) and chains on the gate — see the
frontend doc.

`main` is the default branch, which matters twice: Dependabot reads its config from there, and a
`workflow_run` trigger only fires from there. Until a workflow reaches `main` it does nothing.

## Two gates, split by path

| Workflow               | Runs when                          | Documented in         |
| ---------------------- | ---------------------------------- | --------------------- |
| `quality-frontend.yml` | anything under `frontend/` changes | `frontend/docs/CI.md` |
| `quality-backend.yml`  | anything under `backend/` changes  | `backend/docs/CI.md`  |

Each also triggers on a change to its own file, so editing a gate re-runs it.

Both cancel a superseded **pull-request** run and never cancel a **push** run. A cancelled run
on a deployable branch leaves that commit with no status, which reads as "not checked" rather
than "passed" — the opposite of the point.

### The path filter, and what it costs

Splitting by `paths` is why a frontend change does not spend twenty minutes compiling Rust.

**The trap, before branch protection is ever turned on:** a workflow that the path filter
_skips_ never reports a status at all. If it is a **required status check**, the pull request
waits forever for a result that will never arrive. GitHub does not warn about this.

Today neither gate is required, so this is only a note. If required checks are wanted, do not
mark these two — replace them with a single always-running workflow that computes what changed
(a `changes` job), dispatches the real jobs with `if:` conditions, and ends in a `gate` job with
`if: always()` that fails when any needed job failed. Make **that** job the required check: it
always runs, so it always reports.

This is also why the deploy chains on the gate's conclusion rather than on a push to `main`.

## Dependabot

`.github/dependabot.yml` — the one piece of CI config that genuinely spans both stacks. Three
ecosystems, weekly on Monday 04:00 Montevideo: **npm** in `/frontend`, **cargo** in `/backend`,
**github-actions** in `/`.

All three target `claude-master`, per `ENGINEERING.md`: bumps enter at the integration branch so
every working branch inherits current dependencies, instead of landing on `main` behind the
branch people actually work on.

Minor and patch bumps are grouped into one rollup per ecosystem so there is a single PR to
review; majors get their own PR, which is where breakage lives.

Two things that bite:

1. **`claude-master` must exist** before this file reaches `main`. Dependabot errors on every run
   against a target branch it cannot find.
2. **Dependabot reads the config from the default branch**, so editing it on a working branch
   changes nothing until that edit lands on `main`.

The directories line up with the gates' `paths` filters, so a Dependabot PR runs exactly the gate
it concerns and no other.

## Deviations from `ENGINEERING.md`, repo-wide and deliberate

- **Two gates, not one.** The standard asks for a single gate — "one job, one red dot to read".
  That assumes one stack per repository. This one holds a Rust API and a SvelteKit site, and
  running both on every push is the waste the split exists to avoid. Each gate is still a single
  fail-fast job.
- **Actions are pinned by tag, not by commit SHA.** `eron-client-sv` pins SHAs;
  `eron-backend-csharp` uses tags. Tags are chosen here for a single-maintainer repository with
  few third-party actions. Revisit if that list grows.
