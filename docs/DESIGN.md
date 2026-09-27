# Design contract

## Identity

A personal design system sharing Qiye / Vesper’s visual identity: black-to-gold hair, blue-and-gold eyes, a grey-blue jacket, warm-white knitwear and a relaxed, perceptive temperament. Express these qualities through color, typography and a small feline mark. The design guide uses the small feline mark; character artwork appears in browser icons, home-screen icons and social-preview avatars. The original-character page presents Vesper’s portrait, four full-body views, alternate outfits, scenes and design reference sheet without recoloring or background removal. Scene previews use consistent crops; the viewer preserves full compositions. Social cards place page content on a silver panel beside an ink-dark identity panel, with blue and amber edge accents and an occasional matcha detail.

The tone is calm, curious and slightly playful. Japanese influence comes from natural tones, careful spacing and restrained serif headings. Avoid ornamental motifs, pink-led palettes and decorative card framing.

Use continuous chapters to organize the examples. Keep the palette, typography and sidebar controls consistent with this system’s identity.

## Sources of truth

| Concern                                      | File                                                      |
| -------------------------------------------- | --------------------------------------------------------- |
| Physical colors                              | `src/styles/palette.css`                                  |
| Semantic roles, type scale, shape and motion | `src/styles/tokens.css`                                   |
| Bundled fonts                                | `src/styles/fonts.css`                                    |
| Shared components                            | `src/styles/global.css`                                   |
| Showcase layout and controls                 | `src/styles/showcase.css`                                 |
| Character chapters and artwork viewer        | `src/styles/character.css`                                |
| Comparison, interaction and print layouts    | `src/styles/examples.css`                                 |
| English showcase and document copy           | `src/content/showcase.json`, `src/content/documents.json` |
| Chinese translations                         | Matching `*.zh.json` files                                |

Read computed token values for displayed swatches and specifications. Do not maintain a separate numeric table in components.

## Color

| Role                | Light     | Dark      | Use                                    |
| ------------------- | --------- | --------- | -------------------------------------- |
| Primary: slate blue | `#526682` | `#AFC3DF` | Primary actions, links, keyboard focus |
| Secondary: amber    | `#806127` | `#DCC18D` | Occasional secondary emphasis          |
| Detail: matcha      | `#607149` | `#B1BEA0` | Occasional everyday accents            |
| Page                | `#F7F6F2` | `#202127` | Warm white / charcoal                  |
| Muted surface       | `#E9EBEF` | `#2B2E36` | Quiet surfaces                         |
| Border              | `#D6DAE1` | `#414651` | Fine outlines                          |
| Strong border       | `#9CA4B0` | `#77808F` | Defined boundaries                     |
| Secondary text      | `#606775` | `#B5BCC8` | Supporting text                        |
| Primary text        | `#2D3038` | `#F1EFE8` | Body and headings                      |

The neutral system has **six roles in three tiers: surfaces, boundaries and text**. It is a softly cool gray family with warm-white reading surfaces, not an invented ten-step neutral scale. Status colors retain their own success, warning and error roles; always accompany them with words or recognizable symbols.

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

Values above describe the default root size; use rem tokens so browser font preferences can scale them. Body line height is 1.6, reading 1.8, headings 1.35 and display 1.15. Use weights 400, 500 and 600. Avoid heavy or synthetic bold and negative tracking on Chinese headings.

The A/B study uses identical content and palette: A is serif-led and spacious; B is sans-led and compact. These are contextual layouts, not separate themes.

## Layout and density

- Use a fixed 248px sidebar and a continuous content column with a maximum width of 1120px. The sidebar links to the design system and the original-character page, with chapter indexes on both pages. Fit the sidebar within the viewport without an independent scroll area or clipped controls. Tighten spacing at heights from 641px to 800px. At widths up to 960px or heights up to 640px use compact top navigation.
- The original-character page has four anchored chapters: identity, wardrobe, art book and stickers. Keep stable chapter IDs across locales and expose the chapter index in the sidebar only. Six paired entries connect core behavior to concrete everyday scenes: curiosity, problem-solving, competition, teasing, companionship and commitment. Each scene develops the trait through actions and dialogue. Paired rows align on desktop and stack trait-before-scene on narrow screens. Keep bilingual character prose aligned across appearance, facial habits, personality and daily-life snippets. Qiye combines feline independence and interest-driven behavior with a playful, competitive approach to games and problem-solving; her thinking is clear and focused. Her written design specifies approximately 167 cm, an ice-blue left eye and gold-amber right eye from her own perspective, real cat ears and a tail, head-mounted goggles and a ring choker. The default outfit pairs a light crew-neck top, loose grey-blue zip hoodie, dark relaxed mid-thigh shorts, ankle socks and sneakers. Shorts have roomy leg openings and hems visible below the hoodie, leaving the legs exposed. Keep the silhouette comfortable and easy to move in. Five current illustrations provide the portrait and four full-body views; preserve their original backgrounds. Display the default outfit with garment notes and distinguish the blue-eye and amber-eye profiles by visible eye color. Image alt text must describe the actual artwork. Preserve complete compositions in the viewer and link to full-size files from `public/oc/`.
- The wardrobe uses three selection buttons above a single large image and outfit notes. The art book leads with three equal-width 4:3 scene previews in an aligned row, stacking up to 720px. Previews use top-aligned cover cropping to retain faces and ears; the viewer shows uncropped images. Below, four reference views use four columns, reducing to two up to 720px. Display the detail sheet directly under its heading. Retain original backgrounds. Artwork opens in a native modal with previous/next controls scoped to its collection, an original-file link and focus restoration on close.
- The sticker collection displays all expressions with individual previews, with six columns on wide screens, four up to 1100px and three up to 720px. Use measured per-sticker CSS windows over the original 1024×1536 sheet, whose rows are uneven. Preserve the original reading order, grey background and white outlines. Sticker tiles use square frames with proportional centered artwork and aligned captions. Sticker previews use a compact modal with artwork constrained by viewport height to avoid internal scrolling. The modal links to the full sheet rather than claiming an individual file export. Do not imply transparency or higher source resolution. Dedicated artwork-paper and sticker-field tokens remain light in both themes to match the supplied raster backgrounds. Preserve outfit selection across theme and locale changes. Icons use proportional resizing of the current portrait; source artwork is never altered.
- Chapter headers show a code, title and introduction without implementation-status badges. Render only populated chapters. Do not infer unconfirmed production rules, exact character palettes or lore. Interface colors interpret the OC rather than defining illustration colors. Use amber for the shared feline mark and small OC headings; slate blue remains the action color.
- Keep nine numbered chapters: specimens, principles, color, typography, structure, motion, components, usage and decisions.
- The opening contains the name, a concise description and explicit primary, neutral and font definitions.
- Show three specimen previews across on desktop and stack them on narrow screens. Use compact padding; do not inflate preview heights to create empty space.
- Present principles as a two-column numbered rule list, collapsing to one column on narrow screens.
- Separate chapters with a fine rule and a deliberate pause. Avoid stacking large top padding, bottom padding and margins around the same boundary.
- Keep forms, replies and extra states in the component chapter's disclosure. Document samples open from compact links.
- Use small radii: 2/3/5/7/10px for progressively larger surfaces. Full rounding is reserved for pills, circular controls and badges.
- Prefer borders and tonal differences to shadows. Use the existing soft shadow tokens only where depth helps.

## Controls and accessibility

The sidebar footer contains a language capsule and one circular theme action. On narrow screens they sit beside the brand above the two page links. Desktop targets are 34px, touch targets 36px; general example actions remain 44px.

Use Lucide icons with readable localized names, hover/focus hints and visible keyboard focus. Language is shown as a short text label beside its icon. Keep labels, validation and outcomes in visible text. Content links may use text.

Respect the system reduced-motion setting. Provide skip navigation, a localized navigation landmark and an explicit current-page state. Use thin semantic-colored scrollbars, with system colors in forced-colors mode.

Theme and locale preferences persist locally. Use the first supported browser language on first visit, falling back to English. Saved manual choices take priority over browser preferences; explicit `/zh/` routes remain Chinese. Keep document language metadata synchronized with locale. Demonstration comments are session-local; form examples do not send data to a backend.

Motion tokens are 100/180/320ms. Use short feedback, ease out on entry and ease in on exit. Theme changes suppress intermediate color transitions.

## Required examples and validation

Preserve notes, essays, collections, A/B typography, named code blocks, validated fields, replies, deletion confirmation, share sheet, loading, empty, error/retry and long-title states. Provide essay, resume and report documents with A4 print styles; final pagination depends on browser settings.

Automated tests check semantic token boundaries, token references, locale structure and selected text contrast pairs in both themes. They do not prove complete accessibility or visual fidelity. Review keyboard use, both languages, narrow layouts and print pagination separately when the relevant browser tooling is available.
