# My Design

A personal design studio in silver-white and soft ink, with muted blue, amber and matcha details. Read nine consecutive chapters in a centered single-column guide, with a compact theme toolbar and three specimen previews.

## Toolchain

The project uses **Vite+** for development, production builds, formatting (Oxfmt), linting (Oxlint), type checking and tests (Vitest). Configuration lives in `vite.config.ts`. Vite+ manages its core dependency; pnpm resolves the React plugin's Vite peer dependency without project overrides or a direct Vite alias.

Use Node.js 22.18+ and pnpm 12.4.1. Use the pnpm version pinned in `package.json`:

```bash
pnpm install --frozen-lockfile
pnpm run dev
pnpm run check
pnpm test
pnpm run build
pnpm run preview
```

The package scripts invoke the local `vp` CLI. Direct equivalents are available through `pnpm exec vp check`, `pnpm exec vp test --run`, and `pnpm exec vp build`.

Direct dependencies use exact versions; `pnpm-lock.yaml` records the complete dependency tree for `pnpm install --frozen-lockfile`. Development and preview use the tool's default host. Pass `--host` explicitly when needed, for example `pnpm run dev --host`.

- `pnpm run check`: formatting, lint and types.
- `pnpm run format`: format with Vite+.
- `pnpm test`: interaction regressions, token boundaries, contrast and locale structure.
- `pnpm run test:coverage`: V8 coverage across all application TypeScript, with an HTML report in `coverage/index.html`.
- `pnpm run build`: checks, tests and a production build in `dist/`.

All configuration and tests use TypeScript.

DOM interaction tests use React Testing Library and jsdom. They cover theme and language preferences, draft preservation, keyboard focus in the accessibility panel, form submission, retry cancellation, clipboard feedback and document actions. Native dialog focus trapping and print layout still require browser verification. Coverage does not exclude untested application files or impose an arbitrary percentage target.

## Structure

- `src/content/showcase.json`: copy, section definitions, specimen data, theme summary and metadata.
- `src/content/documents.json`: essay, resume and report sample content.
- `src/styles/palette.css`: physical color definitions.
- `src/styles/tokens.css`: semantic mappings, fonts, radii, shadows and durations.
- `src/styles/global.css`: shared component and specimen styling.
- `src/styles/showcase.css`: centered page, opening title, toolbar and responsive chapter layout.
- `src/styles/examples.css`: A/B typography, expanded interactions and printable document layouts.
- `src/styles/fonts.css`: locally bundled Geist, Geist Mono and Lora.
- `src/components/`: reusable chapters, live specimens and working examples.
- `src/lib/`: theme state and token inspection.
- `tests/`: all tests, including component accessibility, comment validation, locale behavior and design contracts. Application source contains no test files.
- `AGENTS.md`: instructions for agents working in this repository.
- `docs/DESIGN.md`: theme identity, visual rules and interaction contract.

## Editing

Keep display content in the JSON file and color values in the palette. Components use semantic CSS variables. Token labels read the active computed values rather than repeating a separate value table.

Read [AGENTS.md](AGENTS.md) and [docs/DESIGN.md](docs/DESIGN.md) before changing the design. Maintain the palette and tokens directly; this independent theme does not import replacements from another project.

## Interaction scope

All chapters remain in the document, with native anchor targets for direct links. Theme preferences persist locally; without a valid saved preference the theme follows the operating system. Specimens use native modal dialogs. Note, collection and reading controls are local demonstrations. Reduced-motion preferences disable animations.

Typography uses shared responsive size and line-height tokens. The A/B comparison presents identical content in Reading (serif, generous spacing) and Everyday (sans, compact spacing) variants. Expanded component examples include a validated comment form, replies, deletion confirmation, a share sheet and loading, empty, error and long-title states. Comments stay in memory and reset on refresh; the form does not send data to a server.

The specimen chapter links to `?document=essay`, `?document=resume` and `?document=report`. Each standalone sample has a print action for browser printing or saving as PDF, with an A4 stylesheet and light print colors. Final pagination depends on browser print settings.

## Icon actions

Lucide React provides the shared icons. `IconButton` requires a localized readable label, hides its SVG from assistive technology, preserves native button states, and shows a hint on hover or keyboard focus. Escape dismisses the hint. Example action targets stay at least 44 pixels; the compact toolbar uses 34-pixel desktop targets and 36-pixel touch targets. State messages and form labels remain visible text.

## Showcase controls

The top-right controls use an independent language capsule and two circular icon actions for theme and accessibility. The language control toggles between Chinese and English. English is the default; the selected language persists locally. Translations live in `showcase.zh.json` and `documents.zh.json`, with matching structures checked during builds. Font names, code and token identifiers stay unchanged.

Accessibility preferences provide larger text, stronger keyboard focus and reduced motion for the current page session. System reduced-motion settings always apply. Scrollbars use a thin semantic-color treatment and fall back to system colors in forced-colors mode. The principles section uses a compact numbered list; chapter spacing and specimen padding keep the guide dense enough to scan.

## GitHub Pages

The production domain is `design.you-find.me`. The workflow in `.github/workflows/deploy.yml` builds and deploys `dist/` on pushes to `main`, or when manually dispatched from `main`. It uses the local Vite+ toolchain and runs checks and tests before deployment.

Configure the repository under **Settings → Pages**:

1. Select **GitHub Actions** as the build and deployment source.
2. Set **Custom domain** to `design.you-find.me`.
3. At your DNS provider, add a **CNAME** record with host `design` and target `pleasurecruise.github.io`.
4. Enable **Enforce HTTPS** when GitHub has provisioned the certificate.

`public/CNAME` is copied to the build output. With Actions deployments, GitHub uses the repository's custom-domain setting rather than the CNAME file; both the Pages setting and DNS record must be configured. See [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

The custom domain serves the app at its root, so Vite's default `base: "/"` is appropriate. Keep the build output out of Git; Actions uploads it as a deployment artifact.
