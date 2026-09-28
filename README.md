# My Design

A bilingual design guide and Vesper character profile built with React, TypeScript and Vite+.

`design.you-find.me` serves the design site. `l0ad.ing` shows a random [Loading UI](https://www.loading-ui.com/) animation on black, then redirects to the Chinese character profile after 1.8 seconds. Both use the same build; the intro runs only on `l0ad.ing`.

## Development

Use Node.js 22.22.2+, 24.15+ or 26+, and pnpm 12.6.0.

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

| Command                  | Purpose                          |
| ------------------------ | -------------------------------- |
| `pnpm run format`        | Format source                    |
| `pnpm run check`         | Check formatting, lint and types |
| `pnpm test`              | Run tests                        |
| `pnpm run test:coverage` | Report application coverage      |
| `pnpm run build`         | Check, test and build `dist/`    |
| `pnpm run preview`       | Preview the production build     |

Host routing starts in `src/main.tsx`; content, styles and tests live in `src/content/`, `src/styles/` and `tests/`. See [AGENTS.md](AGENTS.md) for contribution rules and [docs/DESIGN.md](docs/DESIGN.md) for the design contract. The `commit-ci` workflow checks commit messages on pushes and pull requests.

## Sharing assets

Images, icons and the sitemap are committed under `public/`. After changing their source content, run `pnpm run og` locally and commit the generated files. Install Chromium once with `pnpm exec playwright install --only-shell chromium`. Deployment builds use the committed assets directly.

## Deployment

Build from the repository root with `pnpm run build`; the output is `dist/`.

| Host                 | Service            | Configuration                                                                                             |
| -------------------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| `design.you-find.me` | GitHub Pages       | `.github/workflows/deploy.yml` deploys `main`; select GitHub Actions in Settings → Pages                  |
| `l0ad.ing`           | Cloudflare Workers | Connect `main`; deploy with `pnpm dlx wrangler@4.143.0 deploy`; `wrangler.jsonc` configures static assets |

For GitHub Pages, set the custom domain to `design.you-find.me`, enable HTTPS, and point the `design` DNS CNAME to `pleasurecruise.github.io`. Keep `public/CNAME` set to this domain.

For Cloudflare, set `NODE_VERSION=26.10.0` and `PNPM_VERSION=12.6.0`. Add `l0ad.ing` under the Worker's Settings → Domains & Routes → Custom Domain, using its Cloudflare DNS zone.

Cloudflare Pages is also supported: choose no framework preset, use the same build command and `dist` output directory, then add `l0ad.ing` under Custom domains. Pages manages deployment without a custom deploy command.
