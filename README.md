# My Design

A personal design studio sharing Qiye / Vesper’s warm-white, charcoal, slate-blue and gold identity, with occasional matcha details. A sidebar connects the nine-chapter design guide and an original-character profile, with language and theme controls at its foot.

## Toolchain

The project uses **Vite+** for development, production builds, formatting (Oxfmt), linting (Oxlint), type checking and tests (Vitest). Configuration lives in `vite.config.ts`. Vite+ 1.0.0-rc.1 bundles Vitest 5.0.1; the coverage provider is pinned to the same version. Vite+ manages its core dependency; pnpm resolves the React plugin's Vite peer dependency without project overrides or a direct Vite alias.

Use Node.js 22.22.2+, 24.15+ or 26+ and pnpm 12.6.0. Use the pnpm version pinned in `package.json`:

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

DOM interaction tests use React Testing Library and jsdom. They cover theme and language preferences, draft preservation, sidebar navigation, the localized character page, form submission, retry cancellation, clipboard feedback and document actions. Native dialog focus trapping and print layout still require browser verification. Coverage does not exclude untested application files or impose an arbitrary percentage target.

## Structure

- `src/content/showcase.json`: copy, section definitions, specimen data, theme summary and metadata.
- `src/content/documents.json`: essay, resume and report sample content.
- `src/styles/palette.css`: physical color definitions.
- `src/styles/tokens.css`: semantic mappings, fonts, radii, shadows and durations.
- `src/styles/global.css`: shared component and specimen styling.
- `src/styles/showcase.css`: sidebar, opening title, controls and design-guide layout.
- `src/styles/character.css`: OC chapters, artwork layouts, outfit controls, sticker collection and image viewer.
- `src/styles/examples.css`: A/B typography, expanded interactions and printable document layouts.
- `src/styles/fonts.css`: locally bundled Geist, Geist Mono and Lora.
- `src/App.tsx`: shared site shell and page selection.
- `src/components/DesignPage.tsx`: design-guide chapters, token display and motion specimens.
- `src/components/CharacterPage.tsx`: OC content and collection selection; wardrobe, stickers, artwork rendering and the viewer have separate components with local interaction state.
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

The specimen chapter links to `/documents/essay/`, `/documents/resume/` and `/documents/report/` (with `/zh` prefixes in Chinese). Each standalone sample has a print action for browser printing or saving as PDF, with an A4 stylesheet and light print colors. Final pagination depends on browser print settings.

## Icon actions

Lucide React provides the shared icons. `IconButton` requires a localized readable label, hides its SVG from assistive technology, preserves native button states, and shows a hint on hover or keyboard focus. Escape dismisses the hint. Example action targets stay at least 44 pixels; the compact toolbar uses 34-pixel desktop targets and 36-pixel touch targets. State messages and form labels remain visible text.

## Navigation and controls

A fixed 248px sidebar links to the design guide and the original-character profile (`/oc/`, `/zh/oc/`). The guide keeps all nine chapters in one document, with a sidebar chapter index. The sidebar fits the viewport without independent scrolling. Spacing tightens at heights from 641px to 800px; at widths up to 960px or heights up to 640px it becomes compact top navigation.

The character page introduces Qiye / Vesper through four anchored chapters: identity, wardrobe, art book and stickers. The sidebar links to these chapters; there is no duplicate in-page index. Six paired entries connect core behavior to concrete everyday scenes: curiosity, problem-solving, competition, teasing, companionship and commitment. Each scene develops the trait through actions and dialogue. Paired rows align on desktop and stack trait-before-scene on narrow screens. The bilingual profile describes Qiye as relaxed, perceptive, interest-driven and competitive, with clear thinking, a free spirit and a persistent romantic streak. Her current written design specifies a height of about 167 cm, an ice-blue left eye and gold-amber right eye (her own left and right), real cat ears and a tail, head-mounted goggles and a ring choker. Five current PNG illustrations under `public/oc/` provide the portrait and front, blue-eye profile, amber-eye profile and back views. The default outfit pairs a light crew-neck top and loose grey-blue zip hoodie with dark relaxed shorts, white casual socks and sneakers. The wardrobe uses an outfit selector with one large illustration and bilingual notes. The art book leads with three equal 4:3 scene previews, followed by a compact four-view reference grid and an always-visible detail sheet. Scene thumbnails use cover cropping; the viewer preserves each full composition. Artwork opens in an accessible in-page viewer with previous/next controls and an original-file link. Two alternate outfits, three everyday scenes and an accessories reference sheet extend the wardrobe and gallery. The sticker chapter displays 24 expressions from a 1024×1536 source sheet using individually measured CSS windows in a responsive grid and linking to the full sheet. The sticker collection displays all expressions with individual in-page previews. Outfit selection survives language and theme changes. Viewer navigation stays within the selected wardrobe, gallery or sticker collection. Language changes work for the current session even if storage is blocked. Original image backgrounds are preserved. Browser and home-screen icons and social cards are generated from the current portrait.

Language and theme controls sit at the foot of the sidebar. The language control toggles between Chinese and English. On first visit, the first supported browser language selects English or Chinese, with English as the fallback. A saved manual choice takes priority; explicit `/zh/` routes remain Chinese. Translations live in `showcase.zh.json` and `documents.zh.json`, with matching structures checked during builds. Font names, code and token identifiers stay unchanged.

Keyboard focus, skip navigation and system reduced-motion settings remain supported. Scrollbars use a thin semantic-color treatment and fall back to system colors in forced-colors mode. The principles section uses a compact numbered list; chapter spacing and specimen padding keep the guide dense enough to scan.

## GitHub Pages

The production domain is `design.you-find.me`. The workflow in `.github/workflows/deploy.yml` builds and deploys `dist/` on pushes to `main`, or when manually dispatched from `main`. It uses the local Vite+ toolchain and runs checks and tests before deployment.

Configure the repository under **Settings → Pages**:

1. Select **GitHub Actions** as the build and deployment source.
2. Set **Custom domain** to `design.you-find.me`.
3. At your DNS provider, add a **CNAME** record with host `design` and target `pleasurecruise.github.io`.
4. Enable **Enforce HTTPS** when GitHub has provisioned the certificate.

`public/CNAME` is copied to the build output. With Actions deployments, GitHub uses the repository's custom-domain setting rather than the CNAME file; both the Pages setting and DNS record must be configured. See [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

The custom domain serves the app at its root, so Vite's default `base: "/"` is appropriate. Keep the build output out of Git; Actions uploads it as a deployment artifact.

Run `pnpm exec playwright install chromium` once locally; `pnpm run og` generates browser and home-screen icons, ten 1200×630 cards and the sitemap from the current portrait, locale JSON and CSS tokens. The production build runs it automatically. Chromium renders offline without a preview server; the build-only Chinese font stays in dependencies. English and Chinese guides (`/`, `/zh/`), character profiles (`/oc/`, `/zh/oc/`) and document pages (`/documents/essay/`, `/zh/documents/essay/`, likewise resume/report) each receive static HTML metadata, a canonical URL, language alternates and their own image. Legacy `?document=` links remain supported in the browser.
