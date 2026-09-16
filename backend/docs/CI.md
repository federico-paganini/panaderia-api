# CI — backend

The Rust gate. Repo-wide matters — the branch model, why the gates are split by path,
Dependabot — live in [`../../docs/CI.md`](../../docs/CI.md).

## The gate

`quality-backend.yml`, one fail-fast job: audit → fmt → clippy → test. It runs on pull requests
to and pushes on `main` and `claude-master`, filtered to `backend/**`.

Formatting runs before clippy on purpose: it needs no compilation, so a formatting-only failure
reports in seconds instead of after a full build.

Locally, from `backend/`:

```bash
cargo audit          # cargo install cargo-audit --locked --version 0.22.2, once
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test
```

The runner's preinstalled stable toolchain is used, with only `rustfmt` and `clippy` added —
that avoids a third-party action for two lines.

## First green run, 2026-09-16

The gate was red from its first run until now, and everything below is how it got closed —
kept because the reasoning matters more than the outcome.

**RUSTSEC-2026-0235 in `rkyv` 0.7.46 — resolved, not silenced.** The plan of record was an
`audit.toml` carrying an ignore, on the argument that `rust_decimal` declared `rkyv` behind a
feature that is not enabled here, so the crate sat in `Cargo.lock` without ever reaching the
binary. Trying the honest fix first turned out to be enough: `cargo update -p rust_decimal`
(1.42.1 → 1.43.0) removed `rkyv` and its thirteen transitive crates from the lockfile
altogether. The lockfile shrank by 133 lines. No security check was narrowed, and there is no
ignore for anyone to find later and have to reconstruct.

**RUSTSEC-2026-0285 in `rustls` 0.23.43 — appeared while fixing the first.** Published
2026-09-14, two days before. Unlike the last one this crate is genuinely in the build graph
(`sea-orm` with `runtime-tokio-rustls`). `cargo update -p rustls` to 0.23.45.

The lesson worth keeping: the first advisory hid the second. Fail-fast means the audit stops at
the first finding, so a clean run is the only evidence that there is exactly one problem.

**`src/main.rs`** — `#[tokio::main]` sat on a synchronous `fn main()`. The macro rewrites an
`async fn main` into a sync one that builds the runtime and blocks on the returned future; with
no `async` there is no future to drive, so it rejected the declaration. Now `async fn main`, and
the file ends in a newline, which `cargo fmt --check` wanted separately.

All four steps verified locally before the push: audit, fmt, clippy with `-D warnings`, and
tests, each checked on its own exit code rather than through a pipe.

## Traps paid for

- **A tool's cache must not be keyed on the project's lockfile.** `cargo-audit` was first cached
  alongside `~/.cargo/registry` under a `Cargo.lock` key, so every dependency bump invalidated it
  and recompiled the audit tool from source — precisely when Dependabot produces the most runs.
  It now has its own cache keyed on a pinned `CARGO_AUDIT_VERSION`, so the compile is paid once
  per tool version. The install step also lost a `|| true` that would have let a failed install
  skip the audit silently.
