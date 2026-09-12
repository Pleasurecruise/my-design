# Design contract

## Identity

A personal design system inspired by Rana Kaname's silver hair, contrasting blue and amber eyes, quiet independence and fondness for matcha. Express these qualities through color, typography and a small feline mark. Character artwork is not part of the interface.

The tone is calm, curious and slightly playful. Japanese influence comes from natural tones, careful spacing and restrained serif headings. Avoid ornamental motifs, pink-led palettes and decorative card framing.

Yohaku informs the continuous showcase format and breadth of examples. Keep this system's palette, typography and independent corner controls distinct. Do not claim a numerical similarity score.

## Sources of truth

| Concern                                      | File                                                      |
| -------------------------------------------- | --------------------------------------------------------- |
| Physical colors                              | `src/styles/palette.css`                                  |
| Semantic roles, type scale, shape and motion | `src/styles/tokens.css`                                   |
| Bundled fonts                                | `src/styles/fonts.css`                                    |
| Shared components                            | `src/styles/global.css`                                   |
| Showcase layout and controls                 | `src/styles/showcase.css`                                 |
| Comparison, interaction and print layouts    | `src/styles/examples.css`                                 |
| English showcase and document copy           | `src/content/showcase.json`, `src/content/documents.json` |
| Chinese translations                         | Matching `*.zh.json` files                                |

Read computed token values for displayed swatches and specifications. Do not maintain a separate numeric table in components.

## Color

| Role                | Light     | Dark      | Use                                    |
| ------------------- | --------- | --------- | -------------------------------------- |
| Primary: slate blue | `#526682` | `#AFC3DF` | Primary actions, links, keyboard focus |
| Secondary: amber    | `#806127` | `#DCC18D` | Occasional secondary emphasis          |
| Identity: matcha    | `#607149` | `#B1BEA0` | Feline mark and small identity details |
| Page                | `#F6F6F2` | `#1C201F` | Silver-white / soft ink                |
| Muted surface       | `#E9ECE6` | `#272D29` | Quiet surfaces                         |
| Border              | `#D8DDD3` | `#3C453F` | Fine outlines                          |
| Strong border       | `#9FA79B` | `#727D72` | Defined boundaries                     |
| Secondary text      | `#61685F` | `#B0B8AC` | Supporting text                        |
| Primary text        | `#2B302E` | `#EFEFE7` | Body and headings                      |

The neutral system has **six roles in three tiers: surfaces, boundaries and text**. It is a subtly green-tinted gray family, not an invented ten-step neutral scale. Status colors retain their own success, warning and error roles; always accompany them with words or recognizable symbols.

Keep most surfaces neutral. Amber and matcha support slate blue rather than acting as competing primary colors. Light and dark modes share component structure and semantic names.

## Typography

| Role  | Family     | Usage                                     |
| ----- | ---------- | ----------------------------------------- |
| Sans  | Geist      | Interface and everyday text               |
| Serif | Lora       | Headings, reflective prose and quotations |
| Mono  | Geist Mono | Code, values and metadata                 |

These three Latin fonts are bundled locally. Chinese sans text uses the system fallback chain; serif text falls back to Songti SC, Noto Serif SC and Source Han Serif SC. JetBrains Mono is a mono fallback, not a bundled font. Do not describe fallback fonts as guaranteed to be installed.

| Size role              | Desktop | Up to 720px |
| ---------------------- | ------- | ----------- |
| Display                | 72px    | 44px        |
| Section heading        | 30px    | 26px        |
| Card heading           | 20px    | 18px        |
| Interface/body         | 14px    | 14px        |
| Reading                | 18px    | 17px        |
| Supporting text / code | 13px    | 13px        |
| Caption                | 12px    | 12px        |

Values above describe the default root size; use rem tokens so the larger-text preference can scale them. Body line height is 1.6, reading 1.8, headings 1.35 and display 1.15. Use weights 400, 500 and 600. Avoid heavy or synthetic bold and negative tracking on Chinese headings.

The A/B study uses identical content and palette: A is serif-led and spacious; B is sans-led and compact. These are contextual layouts, not separate themes.

## Layout and density

- Maintain a centered, continuous page with a maximum width of 1120px. No sidebar, split hero or chapter-swapping navigation.
- Keep nine numbered chapters: specimens, principles, color, typography, structure, motion, components, usage and decisions.
- The opening contains the name, a concise description and explicit primary, neutral and font definitions.
- Show three specimen previews across on desktop and stack them on narrow screens. Use compact padding; do not inflate preview heights to create empty space.
- Present principles as a two-column numbered rule list, collapsing to one column on narrow screens.
- Separate chapters with a fine rule and a deliberate pause. Avoid stacking large top padding, bottom padding and margins around the same boundary.
- Keep forms, replies and extra states in the component chapter's disclosure. Document samples open from compact links.
- Use small radii: 2/3/5/7/10px for progressively larger surfaces. Full rounding is reserved for pills, circular controls and badges.
- Prefer borders and tonal differences to shadows. Use the existing soft shadow tokens only where depth helps.

## Controls and accessibility

The fixed top-right controls are an independent language capsule and two circular icon actions for theme and accessibility. Do not wrap them in a shared segmented frame. Desktop targets are 34px, touch targets 36px; general example actions remain 44px.

Use Lucide icons with readable localized names, hover/focus hints and visible keyboard focus. Language is shown as a short text label beside its icon. Keep labels, validation and outcomes in visible text. Content links may use text.

The accessibility panel offers larger text, stronger focus and reduced motion. Respect the system reduced-motion setting even when the local option is off. Escape closes the panel and returns focus to its trigger. Outside clicks dismiss it. Use thin semantic-colored scrollbars, with system colors in forced-colors mode.

Theme and locale preferences persist locally. English is the default. Keep document language metadata synchronized with locale. Accessibility preferences and demonstration comments are session-local; form examples do not send data to a backend.

Motion tokens are 100/180/320ms. Use short feedback, ease out on entry and ease in on exit. Theme changes suppress intermediate color transitions.

## Required examples and validation

Preserve notes, essays, collections, A/B typography, named code blocks, validated fields, replies, deletion confirmation, share sheet, loading, empty, error/retry and long-title states. Provide essay, resume and report documents with A4 print styles; final pagination depends on browser settings.

Automated tests check semantic token boundaries, token references, locale structure and selected text contrast pairs in both themes. They do not prove complete accessibility or visual fidelity. Review keyboard use, both languages, narrow layouts and print pagination separately when the relevant browser tooling is available.
