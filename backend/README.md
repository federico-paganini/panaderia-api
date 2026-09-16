# backend

The bakery's API. Rust, Axum over SeaORM against PostgreSQL.

**Skeleton.** It compiles, runs and passes its gate, but it does nothing yet: `main.rs` prints
and exits, and `factory.rs`, `settings.rs` and `api/routes.rs` are empty files not yet declared
as modules.

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

Same order as CI, and it is fail-fast — which is worth knowing: the audit stopping hides
everything after it, and that is exactly how one advisory concealed a second here. See
[`docs/CI.md`](docs/CI.md).
