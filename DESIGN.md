# COMPEL 2027 — design direction

This file governs every visual decision. Where it disagrees with SPEC.md section 4, this file wins. SPEC.md still governs content, routes, data model and acceptance.

## Point of view

The site belongs to a power-electronics workshop at UT Austin, and its logo already says what it should look like: the UT tower drawn as a line that turns into a switching waveform. So the site is built from two things only — heavy condensed lettering like an instrument front panel, and one orange waveform line. Everything else is quiet: white page, slate ink, serif reading text. It should read as designed by someone who knows what a duty cycle is, not as a conference template.

Avoid, without exception: gradients of any kind (including dark overlays on photos), glass/blur effects, glows, drop shadows, emoji, icon sets, rounded "cards" in a grid, centered hero text, all-caps labels, small "eyebrow" labels above headings, arrows appended to links or buttons, monospace type, Inter/Roboto/system-ui as a visible face, carousels, countdown timers, scroll-triggered fade-ins.

## Tokens

Colour (one accent):

| Token | Hex | Use |
|---|---|---|
| `--orange` | `#BF5700` | The accent. Primary button fill, table header band, active nav marker, the waveform line. |
| `--orange-deep` | `#9C4700` | Text links on white and hover state of orange fills (same hue, darker for contrast). |
| `--slate` | `#1D2B33` | Nav bar, footer, headings, secondary button outline. |
| `--text` | `#1A2228` | Body text. |
| `--muted` | `#56646C` | Secondary text. |
| `--rule` | `#C8D0D3` | 1px rules and table lines. |
| `--panel` | `#EEF1F1` | Occasional flat background band. |
| `--paper` | `#FFFFFF` | Page. |

Type (self-hosted through `@fontsource-variable/archivo` and `@fontsource-variable/source-serif-4`; import the Archivo file that includes the width axis):

- Archivo — display, headings, nav, buttons, tables, all UI. Headings use the narrow width: `font-stretch: 75%` (`font-variation-settings: "wdth" 75`), weight 800, line-height 0.95–1.05, letter-spacing −0.01em. Nav and buttons: width 100%, weight 600.
- Source Serif 4 — all running text, 18px/1.6 (17px on phones), max line length 68ch.
- Scale (px): 14, 16, 18, 22, 28, 38, 54, 76; the home title goes to `clamp(64px, 10vw, 136px)`.
- Sentence case everywhere in interface copy. Source content keeps its own capitalisation. Dates and table figures use `font-variant-numeric: tabular-nums`.

Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 72, 112. Use only these.

Shape: square corners on everything structural; buttons have a 2px radius. No shadows. Rules are 1px `--rule`; emphasis rules are 3px `--slate` or `--orange`.

Grid: 12 columns, 24px gutters, max content width 1200px, side padding 24px (16px on phones). Everything is left-aligned. Layouts are deliberately lopsided (7/5, 8/4 with an empty column), never mirrored halves or three equal boxes.

## Header (every page)

1. Logo strip: white, `logo-banner.png` at left, 72px tall on desktop and 48px on phones, links to Home. Nothing else in the strip.
2. Nav bar: full-bleed `--slate`, 56px tall, white Archivo 16px/600, sticky at the top once the logo strip scrolls away.
   - Left: Home, Author information, Program, Logistics. The three groups are buttons that open a dropdown panel (slate, 1px lighter rule between items) on click, Enter/Space, and hover; Escape closes; arrow keys optional. Current page or group carries a 3px orange bar along the top edge of the item.
   - Right: the two calls to action, always visible: "Registration" (orange fill, white text) and "Digest Submission" (1px white outline). These are the same links the old nav carried; the single-item "Submission" dropdown is flattened into the "Digest Submission" button.
   - Under 860px: logo strip stays; nav bar shows a "Menu" text button at left and the two call-to-action buttons at right (shorten nothing; let them wrap under the bar on very narrow screens). The menu opens a full-width slate panel with groups expanded as plain lists.
   - Dropdown open/close is the only hover/press animation: 120ms opacity and 4px translate.

## Home

```
[logo strip                                             ]
[slate nav: Home  Author information  Program  Logistics      [Registration][Digest Submission]]
[ campus panorama, full-bleed, no overlay, 34vw tall (240–420px)                              ]
+----------------------------------+
| COMPEL 2027                      |      (white block overlapping the photo by 72px, cols 1–7)
| 28th Annual Workshop on Control  |      [ Registration        ]  (cols 9–12, orange, 72px tall)
| and Modeling for Power Electronics      [ Digest Submission   ]  (slate outline, 72px tall)
| University of Texas at Austin — June 14-17, 2027
+----------------------------------+
~~~~ sine-PWM waveform line, full width, orange 2px ~~~~
[ Important dates table (cols 1–7) ]   [ Welcome to COMPEL 2027! paragraph (cols 9–12) ]
[ Announcements, scrolls inside 420px box (cols 1–9)                                   ]
[ Our Sponsors (hidden while empty)                                                    ]
```

- Hero image: `hero-campus.jpg`, `object-fit: cover; object-position: center top`. Until a clean photo arrives the hero source is the top band of `header-current.png` (its lower half has the logo composited on it, so only the top ~38% may show). Make the hero a separate file `public/images/hero-campus.jpg` so it is a one-file swap.
- The title block: `h1` "COMPEL 2027" at the huge size; below it one line "28th Annual Workshop on Control and Modeling for Power Electronics" (Archivo 28px/700, narrow), then "University of Texas at Austin" and "June 14-17, 2027" (Archivo 22px/500, `--muted`), on one line on desktop separated by a 1px vertical rule, stacked on phones. No dots or dashes as separators.
- The two big buttons sit to the right of the title block on desktop, bottom-aligned with it, and full-width directly under it on phones. Text 22px/700. Both must be on the first screen at 1440×900 and 390×844.
- The waveform: an inline SVG polyline, 48px tall, spanning the viewport, drawn as real sinusoidal PWM (about 40 pulses whose widths follow one period of a sine, so it visibly breathes from narrow to wide and back). On first load it draws left to right once over 1.4s (`stroke-dashoffset`); with `prefers-reduced-motion` it is simply present. This is the only decorative element on the site and it appears only here. Mark it `aria-hidden`.
- Important dates: a real `<table>` with `<caption>` "Important dates" styled as the section heading (Archivo narrow 38px). Header row: orange band, white text, columns "Milestone" and "Date". Rows 56px tall, 1px rules, milestone in Archivo 18px/600, date right-aligned in tabular figures. Below the table: "11:59 PM CT for all dates". A small inline script adds a struck-through, muted state to rows whose date has passed (dates stored as ISO in `dates.json`). On phones the table keeps two columns and wraps text; no horizontal scroll.
- Welcome: heading in Archivo narrow 28px, paragraph in serif. It sits beside the dates table on desktop; on phones the order is dates, announcements, welcome.
- Announcements: heading "Announcements" (38px). The list lives in a region with `max-height: 420px; overflow-y: auto`, a 3px slate rule on its left edge, `tabindex="0"` and an `aria-label` so it is keyboard-scrollable. Items are separated by 1px rules, not boxed: title Archivo narrow 28px, body serif, then a secondary button. Show an item's date only if its frontmatter has one.
- Sponsors: when populated, logos on a white band in a left-aligned row, greyscale off; hidden entirely when `sponsors.json` is empty.

## Inner pages

```
[header]
Page title (Archivo narrow 76px desktop / 44px phone, left, 72px top padding, 3px slate rule under it spanning cols 1–12)
[ group rail, cols 1–3 ]   [ content, cols 5–12 (max 68ch for text) ]
```

- The rail lists the other pages in the same nav group (for example Venues, Travel, Committee, Contact Us), Archivo 16px, current page marked with a 3px orange left bar and `aria-current="page"`. It is sticky under the nav on desktop. On phones it becomes a wrapping row of plain text links above the content.
- Content headings: h2 Archivo narrow 38px with 48px above; h3 22px. The source content has bold-inside-heading markup; render headings once, not doubly bold.
- Lists: hanging square bullets in `--orange` (6px squares), 12px between items.
- File downloads: a row with the file name (Archivo 18px/600), "PDF" and file size in `--muted`, and a "Download" secondary button at right; 1px rule above and below. No icons.
- Buttons: primary = orange fill, white 18px/700 Archivo, 56px tall, 24px side padding. Secondary = 1px slate outline, slate text; hover fills slate with white text. Focus: 3px outline, `--slate` on orange and white surfaces, white on slate surfaces, 2px offset. External links get no icon; the Fourwaves links open in the same tab.
- Empty pages (Keynotes, Schedule at a Glance, Travel): title, then one serif line "Details coming soon." Nothing else — no illustration.
- Venues: three rows, each a 7-column photo and a 5-column text block, the photo alternating sides, 72px between rows. Venue name h2; the role ("Conference Venue (Sessions & Expo Hall)", "Lab Tours") as an italic serif line directly under the name; address as a link; then the description. Photos 3:2, cropped with `object-fit: cover`.
- Committee: General Chair as one lopsided row (photo cols 1–4, name in Archivo narrow 54px with affiliation under it, cols 6–12). Organizing Committee: three portraits in a row at cols 1–9 with name and affiliation beneath each (4:5 crop, no boxes or borders); then the remaining names as a plain three-column list (two on tablet, one on phone), name in Archivo 18px/600 with affiliation in serif `--muted` under it, 1px rule above each entry. Empty groups render nothing.
- Contact: the sentence from the source set large (serif 28px) with the email as a link.

## Footer

Full-bleed `--slate`, white text, 72px padding. Three uneven columns (5/4/3): contact email; location address; dates plus the IEEE Power Electronics Society link. Archivo 16px, link underline on hover only. No logo, no Fourwaves branding, no social icons.

## Quality floor

- 360px to 1440px+, no horizontal scroll, tap targets ≥ 44px.
- Visible focus on every interactive element; dropdowns and mobile menu fully keyboard operable; skip-to-content link.
- Colour contrast AA: never put `--orange` text smaller than 18px bold on white — use `--orange-deep` for links.
- Images have real alt text; decorative SVG is `aria-hidden`.
- JavaScript is limited to: nav dropdown/mobile menu, the past-dates marker. The site must be fully readable with JS off (dropdown groups fall back to links to their first page; menu content reachable via the footer or a no-JS fallback).

## Placeholder assets

The real images and PDFs cannot be downloaded in this build environment. Until they arrive, `public/images/` holds generated placeholders with the exact final file names (flat `--panel` fill with the file name in slate text, at the real aspect ratio), and `public/files/` holds no PDFs (download links still point to the final paths). A manually triggered GitHub workflow replaces them with the real files. Never design around a placeholder's appearance.
