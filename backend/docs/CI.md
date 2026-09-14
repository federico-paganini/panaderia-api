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

## First run, 2026-09-13 — red

On `f5c58d5`, at the audit step. Fail-fast then **skipped** format, clippy and tests, so the two
known `main.rs` problems below were never reported. That is the gate working as designed, but it
is worth knowing that an audit failure hides everything after it.

### Open decision: RUSTSEC-2026-0235 in `rkyv` 0.7.46

The advisory is real. Whether it reaches this binary is a different question, and the evidence
says it does not:

- `rkyv` is declared by `rust_decimal` 1.42.1 as an **optional** dependency behind a feature.
- That feature is not enabled here: `cargo tree --invert rkyv --target all` prints nothing,
  meaning nothing in the build graph reaches it.
- It is in `Cargo.lock` regardless, and `cargo audit` scans the lockfile without resolving
  features — so it reports a crate that is never compiled into the binary.

**This needs a decision, and it is not one to take quietly.** Silencing it means an `audit.toml`
carrying `ignore = ["RUSTSEC-2026-0235"]`, which narrows a security check; the alternative is to
leave the gate red until `rust_decimal` bumps its optional dependency. Either way the reasoning
belongs here, with a date, so the next person does not find a bare ignore and have to guess.

### Still open on `main.rs`, behind the audit failure

Both will surface once the audit step is resolved:

- `cargo fmt --check` — no trailing newline.
- `cargo clippy` — `#[tokio::main]` sits on a synchronous `fn main()`. The macro rewrites an
  `async fn main` into a sync one that builds the runtime and blocks on the returned future;
  with no `async` there is no future to drive, so it rejects the declaration.

### Pending confirmation

Federico will confirm this gate's first green run **when his Fable usage resets**. Until then it
has never been seen green end to end, and nothing here should be described as verified.

## Traps paid for

- **A tool's cache must not be keyed on the project's lockfile.** `cargo-audit` was first cached
  alongside `~/.cargo/registry` under a `Cargo.lock` key, so every dependency bump invalidated it
  and recompiled the audit tool from source — precisely when Dependabot produces the most runs.
  It now has its own cache keyed on a pinned `CARGO_AUDIT_VERSION`, so the compile is paid once
  per tool version. The install step also lost a `|| true` that would have let a failed install
  skip the audit silently.
