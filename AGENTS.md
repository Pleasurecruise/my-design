# Repository instructions

## Read first

- Read [docs/DESIGN.md](docs/DESIGN.md) before changing visuals, content or interactions.
- Read [README.md](README.md) for setup and project entry points.
- CSS files are the source of truth for values; DESIGN.md defines their intended use. Update both when changing the contract.

## Scope and implementation

- Make restrained changes to the requested area. Preserve unrelated work.
- Use Conventional Commits: `type(scope): description`, with an optional scope, for example `feat: add loading-domain entry` or `ci: validate commit messages`. The `commit-ci` workflow checks push and pull-request commits using commitlint's conventional configuration.
- Use TypeScript and the existing Vite+ toolchain. Do not add `.mjs` or `.cjs` files or a second formatter, linter or build system.
- Use the pnpm version pinned in `package.json` and `pnpm-lock.yaml`; do not introduce other package-manager lockfiles.
- Pin direct dependencies to exact versions and update the lockfile together. Do not add dependency overrides or hardcode a host in development and preview scripts. Keep only dependencies with an actual application, testing or tooling use.
- Prefer inferred types and explicit data models. Do not silence errors with type assertions or non-null assertions.
- Avoid unnecessary `typeof` probes or type-query aliases. Use the known runtime and explicit models instead of adding compatibility scaffolding.
- Handle expected failures where they occur. Do not add broad try/catch blocks, silent defaults or speculative compatibility layers.
- Extract helpers only for shared behavior or a substantial algorithm. Avoid one-use wrappers and unnecessary dependencies.
- Keep display copy in the locale JSON files. English is the base and fallback locale; maintain Chinese translations with the same structure. Select the initial interface language from browser preferences unless a saved manual choice or explicit Chinese URL takes priority. Keep code, identifiers and font names stable across languages.
- Do not embed developer filesystem paths or external project contents in application code.
- Use semantic tokens in components. Add physical color values to `palette.css`, then map them in `tokens.css`.
- Use the existing Lucide icons and accessible controls. Preserve form input when changing locale or theme.

## Verification

- `pnpm run format` formats with Vite+.
- `pnpm run check` checks formatting, lint and types.
- `pnpm test` runs behavior and design-contract tests, including tokens, contrast and locale structure.
- `pnpm run build` runs checks and tests before generating `dist/`.
- Keep all test files in the root `tests/` directory. Do not mix `.test.ts` files into application source or add a second test location.
- Extend the existing test files before creating additional files. Do not add scattered setup files or one-use test helpers.
- `pnpm run test:coverage` reports all application TypeScript through V8. Prioritize meaningful behavior coverage; do not exclude untested source to inflate the result.
- Add tests for meaningful behavior changes; do not add tests that merely repeat implementation details.
- For visual changes, inspect both themes and languages at desktop and narrow widths when browser access is available. State clearly if visual verification was unavailable.
- The preview server was intentionally stopped. Do not start it unless the user requests it again.

## Documentation maintenance

- Keep agent workflow instructions here, design rules in `docs/DESIGN.md`, and setup instructions in README.md.
- Document the current implementation, not abandoned directions or conversation history.
- Keep documentation in English. Chinese interface translations belong in `*.zh.json`.
