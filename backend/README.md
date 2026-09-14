# backend

The bakery's API. Rust, Axum over SeaORM against PostgreSQL.

**Skeleton — it does not compile yet.** `#[tokio::main]` sits on a synchronous `fn main()`; the
macro rewrites an `async fn main` into a sync one that builds the runtime and blocks on the
returned future, so with no `async` there is no future to drive and it rejects the declaration.
`src/main.rs` also has no trailing newline, which `cargo fmt --check` rejects separately.

## Running it

```bash
cargo run
```

Configuration comes from `.env` (gitignored). Settings are mapped once in `src/settings.rs`;
nothing reads the environment directly.

## Quality gate

```bash
cargo audit          # cargo install cargo-audit --locked --version 0.22.2, once
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test
```

Same order as CI, and it is fail-fast: the audit currently stops on RUSTSEC-2026-0235, which
means format, clippy and tests have never run here. The advisory and the decision it needs are
written up in [`docs/CI.md`](docs/CI.md).
