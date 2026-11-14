# Handoff: COMPEL 2027 website

Read this first, then `SPEC.md` (content, routes, acceptance checklist) and `DESIGN.md` (all visual decisions; it wins over SPEC section 4 where they differ).

## What this is

A custom static website for IEEE COMPEL 2027 (UT Austin, June 14–17, 2027). It replaces the conference's Fourwaves site, keeping the same content. Registration and Digest Submission stay on Fourwaves and are plain links:

- `https://event.fourwaves.com/compel2027/registration`
- `https://event.fourwaves.com/compel2027/submission`

Requested by Elaine Ng (organizer). Alex Hanson (general chair) asked for the logo on top of every page, a high-contrast nav, a home page with the logo, a campus photo and two big buttons, dates as a real table, and scrollable announcements. Due for review Monday 2026-11-16; public launch 2026-11-26. Must be free to host (GitHub Pages).

## State as of 2026-11-13 20:25 PT

Done and building (`npm run build`, 10 pages, also works with `BASE_PATH=/`):

- Astro 7 static site, plain CSS, fonts self-hosted from npm (Archivo with width axis, Source Serif 4).
- Shared: `src/layouts/BaseLayout.astro`, `PageLayout.astro`; `src/components/Header.astro` (logo strip + sticky slate nav, dropdowns, mobile menu, always-visible Registration / Digest Submission buttons), `Footer.astro`, `Button.astro`, `FileDownload.astro`, `ComingSoon.astro`, `MarkdownPage.astro`.
- Home (`src/pages/index.astro`, `src/components/home/`): campus hero, title block, two big buttons, PWM waveform line, dates table with past-date strike-through, welcome, scrolling announcements, sponsors (hidden while empty).
- Text pages driven by Markdown in `src/content/pages/`; announcements in `src/content/announcements/`.
- Venues (`src/data/venues.json`, `src/components/venues/`) and Committee (`src/data/committee.json`, `src/components/committee/`).
- `README.md` for organizers (editing content, custom domain, questions for Elaine).
- Workflows: `.github/workflows/deploy.yml` (GitHub Pages on push to `main`) and `fetch-assets.yml` (manual; downloads the real images and PDFs from Fourwaves and commits them).

Key conventions:

- Every internal link or asset URL in `.astro` files goes through `href()` from `src/lib/url.ts`. Markdown links are prefixed automatically.
- Use tokens and classes documented at the top of `src/styles/global.css`; do not invent colours, sizes or spacing.
- A page's nav group comes from `src/data/nav.json`, looked up by route.
- In Markdown pages, a line that is only `Download: [name](/files/x.pdf)` becomes a file row; `Button: [label](url)` becomes a button; `site:registrationUrl` / `site:submissionUrl` resolve from `site.json`.

## Not done yet (in order)

1. **Real assets.** `public/images/` holds grey placeholders with the final file names; `public/files/` has no PDFs. On GitHub, run Actions → "Fetch assets" once. If the PDF downloads fail (they may need a Fourwaves login), ask the user to download the two PDFs from the Fourwaves Digest Information page and add them to `public/files/` with the names in SPEC section 6. Check the hero crop of `header-current.png` (top ~38%, right 80%) looks right; the logo is composited on the lower half of that image.
2. **Enable Pages.** Repo Settings → Pages → Source: GitHub Actions. Then confirm the deploy run succeeds and the site loads at `https://<owner>.github.io/compel2027-website/`.
3. **Verification pass** against SPEC section 9 by someone who did not build it: screenshots at 1440×900, 390×844 and 360 wide of every page; keyboard-only nav; Lighthouse accessibility ≥ 95 on Home; no horizontal scroll; every link resolves; text verbatim against SPEC section 5.
4. **Known small issues from the builders:**
   - ~~`.prose ul` margin reset beat the flow rule~~ Fixed 2026-11-13: reset now uses `:where(.prose) ul` in `global.css` and the `MarkdownPage.astro` patch is removed. Lists on Markdown pages now get the standard 24px flow gap (was 12px under the patch); eyeball a page with a list during the verification pass.
   - Images are plain `<img>` from `public/`, not Astro `<Image>` resizing (SPEC 6). The fetch workflow resizes to 1600px instead. Acceptable unless page weight is a problem.
   - The announcements box shows a scrollbar exactly between the two items on desktop; check it still reads as scrollable.
   - Venue alt text was written without seeing the real photos; recheck after step 1.
   - The past-dates script has only run with no dates passed.
5. **Questions for Elaine** (README lists them): tutorial deadline Feb 19 vs Feb 26; acceptance notification Mar 26 vs 3/27; digest deadline Feb 19 vs Fourwaves form closing Mar 5; EER tour "Friday 6/17" (June 17, 2027 is a Thursday); "12,000 ft" cleanroom. Do not change the text until she answers.
6. **Custom domain** later, per SPEC section 8 and the README. Do not do it now.

Ask the user before changing repo visibility, settings, or anything outside this repo.
