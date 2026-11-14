# COMPEL 2027 website — build spec

You are building a custom static website for IEEE COMPEL 2027 (28th Annual Workshop on Control and Modeling for Power Electronics, University of Texas at Austin, June 14–17, 2027). It replaces the conference's Fourwaves-hosted event site, whose page builder is too limited. All content below was copied from the Fourwaves site editor on 2026-11-13 and is the source of truth; do not invent content.

Work in this folder. Read this whole file before starting.

## 1. Requirements

From Elaine (organizer):

- Same content as the current Fourwaves site: every tab, text block, file and link. Just make it look good and modern.
- Fully custom site, free to host. GitHub Pages is the target. The official COMPEL domain will be pointed at it later.
- Photos are placeholders and will change; make every image trivially swappable (one file per image in `public/images/`, referenced from content files).
- Registration and Digest Submission stay on Fourwaves. Link to exactly these URLs:
  - Registration: `https://event.fourwaves.com/compel2027/registration`
  - Digest Submission: `https://event.fourwaves.com/compel2027/submission`

From Alex (general chair), cosmetic:

1. The conference logo (see `logo-banner.png` in section 6) at the top of every page.
2. The navigation bar must be high contrast against the rest of the page so it is obviously the navigation.
3. Home page, first screen: the logo, a nice image of UT campus, a big Registration button and a big Digest Submission button (both linking to the Fourwaves URLs above).
4. Important dates as a real HTML table, not an image.
5. Below the important dates, a scrollable list of announcements.

Deadline: reviewable by Monday 2026-11-16. Public launch 2026-11-26.

## 2. Stack and repo layout

- Astro (latest stable), static output, no client framework. Plain CSS (one global stylesheet plus component styles). No Tailwind, no UI kit.
- Content lives in Markdown/JSON so a non-developer can edit it on github.com:
  - `src/content/pages/*.md` — one file per content page
  - `src/content/announcements/*.md` — one file per announcement (frontmatter: `title`, `date`, optional `buttonLabel`, `buttonHref`)
  - `src/data/dates.json` — important dates rows
  - `src/data/committee.json` — committee members
  - `src/data/nav.json` — navigation tree
  - `src/data/site.json` — the two Fourwaves URLs, contact email, event name/dates/location
- `public/images/`, `public/files/` — assets (section 6).
- `.github/workflows/deploy.yml` — build and deploy to GitHub Pages with the official `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages` actions on push to `main`.
- `astro.config.mjs`: read `site` and `base` from env vars (`SITE_URL`, `BASE_PATH`) defaulting to a project-pages path (`/compel2027-website`), so switching to the custom domain later is a one-line change (`base: '/'` plus a `public/CNAME` file). All internal links and asset URLs must respect `base`.
- `README.md` — how to edit content, add an announcement, swap an image, and connect the custom domain (section 8).

## 3. Site map and navigation

Keep the existing navigation grouping. External items open in the same tab.

| Nav item | Type | Route / target |
|---|---|---|
| Home | page | `/` |
| Registration | external | Fourwaves registration URL |
| Submission ▸ Digest Submission | external | Fourwaves submission URL |
| Author Information ▸ Digest Information | page | `/digest-information/` |
| Author Information ▸ Pitch Information | page | `/pitch-information/` |
| Program ▸ Tutorials | page | `/tutorials/` |
| Program ▸ Keynotes | page | `/keynotes/` |
| Program ▸ Schedule at a Glance | page | `/schedule/` |
| Logistics ▸ Venues | page | `/venues/` |
| Logistics ▸ Travel | page | `/travel/` |
| Logistics ▸ Committee | page | `/committee/` |
| Logistics ▸ Contact Us | page | `/contact/` |

Pages that exist in Fourwaves but are empty and hidden from its nav — do not build them: Pitch Submission, Final Materials Submission, Final Materials Information, Full Program, Presentations, Participants.

Any link in the content that pointed to `https://event.fourwaves.com/compel2027/pages/<id>` must point to the matching local route instead:

- `…/pages/30359f42-f30b-417b-b310-b69f001e39de` → `/pitch-information/`
- `…/pages/bd17b77c-c4e4-4c65-b420-82b40ed8fc69` → `/tutorials/`
- `…/pages/11f01a14-4fd7-484e-b918-60c9a7afe266` → `/digest-information/`

## 4. Design

- Palette: UT burnt orange `#BF5700` as the accent (the logo and the current site's buttons are burnt orange; current button colour is `#B1610B`). Nav bar: solid dark charcoal (`#1F2328` or similar) with white text and an orange active/hover indicator, sitting directly under a white logo strip. Body: white / very light warm grey, near-black text (`#101828`).
- Check contrast: body text and nav text at least WCAG AA (4.5:1). White text on `#BF5700` passes for large/bold button text; use bold ≥ 18px on orange buttons.
- Type: one clean sans-serif family, self-hosted or system stack (no layout shift, no third-party font request required). Large confident headings.
- Header on every page: white strip with `logo-banner.png` at left (links to Home, height ~64–80px desktop), then the dark nav bar. Nav is sticky on scroll. Dropdowns open on hover and on click/focus, are keyboard accessible, and collapse into a hamburger menu under ~860px.
- Home hero: full-width campus image (`hero-campus.jpg`) with a dark gradient overlay; over it the event name "COMPEL 2027", "University of Texas at Austin", "June 14–17, 2027", and two large buttons side by side: **Registration** (solid orange) and **Digest Submission** (white with orange text). The logo is already visible in the header strip above the hero.
- Home below the hero, in this order: Important Dates table → Announcements (fixed-height box, ~420px, scrolls internally, newest first, each item is a card with title, body, optional button) → Welcome text → Sponsors.
- Important Dates table: real `<table>` with a caption, orange header band, two columns (milestone, date), and the note "11:59 PM CT for all dates". Must stay readable on a 360px-wide phone.
- Inner pages: page title band, then content at a comfortable reading width (~760px), with wider layouts for Venues (alternating image/text rows) and Committee (card grid).
- Footer on every page: contact email, location (University of Texas at Austin, 2501 Speedway, Austin, Texas, United States, 78712), event dates, link to IEEE Power Electronics Society (`https://www.ieee-pels.org/`). No Fourwaves branding.
- The current site repeats the logo banner at the bottom of every page because Fourwaves could not put it at the top. Do not repeat it at the bottom.
- Responsive from 360px to 1440px+. No horizontal scroll. Images use `loading="lazy"` (except hero) and have alt text.
- Empty pages (Keynotes, Schedule at a Glance, Travel) get a tidy "Details coming soon." placeholder under the title.

## 5. Page content (verbatim)

### 5.1 Home

Hero text: **COMPEL 2027** / University of Texas at Austin / June 14-17, 2027. Buttons: Registration, Digest Submission.

Important dates (`src/data/dates.json`):

| Milestone | Date |
|---|---|
| Tutorial Proposal Deadline | February 19, 2027 |
| Digest Submission | February 19, 2027 |
| Notification of Acceptance | March 26, 2027 |
| Oral Pitch Submission | April 9, 2027 |
| Oral Notification | May 10, 2027 |
| Final Material Submission | June 1, 2027 |

Note under the table: "@ 11:59 PM CT for all dates".

Announcement 1 — **New this year for oral presentations**

> All **accepted** authors who indicate a preference to present their paper in an oral session will be required to submit a recorded elevator pitch. The committee will use these pitches to help assign oral/poster session slots.
>
> Pitch submission link will be made available and sent to accepted authors on the notification of acceptance date (3/27/27).
>
> For more information about the pitch, navigate to the [Author Submission > Pitch Information tab](/pitch-information/) or click below:

Button: "Pitch Information" → `/pitch-information/`

Announcement 2 — **The COMPEL 2027 organizing team is currently accepting proposals for tutorials.**

> For more information about submitting a tutorial proposal, navigate to [Program > Tutorials](/tutorials/) or click below:

Button: "Tutorial Proposal" → `/tutorials/`

Welcome block — **Welcome to COMPEL 2027!**

> The [IEEE Power Electronics Society](https://www.ieee-pels.org/) announces the 28th Annual Workshop on Control and Modeling for Power Electronics, IEEE COMPEL 2027. This workshop brings together researchers, engineers and students from academia and industry for an interactive discussion on the latest advances in modeling, simulation, analysis and control of power electronic devices, circuits and systems.

Sponsors block — heading **Our Sponsors**. No sponsor logos exist yet. Build the section as a logo grid driven by `src/data/sponsors.json` (empty array) and hide the whole section while the array is empty.

### 5.2 Digest Information (`/digest-information/`)

**Call for Papers**

Click below to download the call for papers.

File: "IEEE COMPEL 2027 Call for Papers Flyer.pdf" → `/files/IEEE-COMPEL-2027-Call-for-Papers-Flyer.pdf`

**Digest Formatting Requirements**

- Must not exceed **five** single-column, double-spaced, US letter-sized pages (8.5 in x 11 in)
- References are **not included** in the page limit
- In PDF format
- Use standard fonts e.g. Arial, Calibri, Courier, Helvetica, Times New Roman, etc.
- All font sizes can be no smaller than 10 pt and no larger than 12 pt
- First page should contain paper title and 100 word (max) abstract
- No indication of authors' names or affiliations should be included in the digest

File: "digest_sample_compel_2027.pdf" → `/files/digest_sample_compel_2027.pdf`

**To submit your digest, navigate to the [Author Submission > Digest Submission tab.](https://event.fourwaves.com/compel2027/submission) Or click below:**

Button: "Digest Submission" → Fourwaves submission URL

**New this year for oral presentations**

All **accepted** authors who indicate a preference to present their paper in an oral session will be required to submit a recorded elevator pitch. The committee will use these pitches to help assign oral/poster session slots.

Pitch submission link will be made available and sent to accepted authors after the notification of acceptance date (3/27/27).

For more information about the pitch, navigate to the [Author Submission > Pitch Information tab](/pitch-information/) or click below:

Button: "Pitch Information" → `/pitch-information/`

### 5.3 Pitch Information (`/pitch-information/`)

**New this year: elevator pitches for oral presentation selection**

Accepted authors will indicate their preference to present their work in oral or poster sessions. To be considered for an oral presentation, authors **must** submit a short video recording of an elevator pitch for their digest. The committee will evaluate both the digests and pitches to make final oral presentation selections.

This new step is intended to help the committee select high-quality oral presentations and provide conference attendees with previews of the work being presented in oral sessions.

**Pitch Submission Deadline**

The pitch submission deadline is **April 9, 2027 at 11:59 PM CT.**

**Pitch Guidelines**

The pitch should advertise the submitted digest, summarize the work's key takeaways, and highlight its impact. Pitches will be evaluated for their clarity and effectiveness in communicating the work.

Pitch videos must:

- Be less than 3 minutes long
- Be submitted as a .mp4 file with the naming convention: "SubmissionID_LastName_FirstName_pitch.mp4"

Authors may narrate a short slide deck containing **no more than 3 slides**. Authors using slides are not required to appear on camera.

**Pitch Submission Link**

The pitch submission link will be made available to accepted authors **on March 26, 2027 at 11:59 PM CT**, when authors will be notified of their acceptance decisions.

### 5.4 Tutorials (`/tutorials/`)

**The COMPEL 2027 organizing team is currently accepting proposals for tutorials.**

Deadline for tutorial proposals is **Friday February 26, 2027 at 11:59 PM CT.**

**Tutorial Format**

COMPEL 2027 will have two 90 minute tutorial sessions. **Up to 3 presenters** can present each tutorial, but the organizing team will coordinate with a "main presenter".

As part of the proposal application, prospective tutorial presenters must submit a **2 page (max) outline AND (up to) 10 min recorded pitch** for their talk. More details are provided in the application form.

Submit a proposal through this [Google Form](https://forms.gle/8kqRxCufLcfTK12a9) or click below:

Button: "Tutorial Proposal Submission" → `https://forms.gle/8kqRxCufLcfTK12a9`

### 5.5 Keynotes (`/keynotes/`), Schedule at a Glance (`/schedule/`), Travel (`/travel/`)

No content yet. Title plus "Details coming soon."

### 5.6 Venues (`/venues/`)

Three image + text rows.

**Welch Hall** — *Conference Venue (Sessions & Expo Hall)* — image `venue-welch.jpg`

[105 E 24th St, Austin, TX 78712](https://maps.app.goo.gl/MgEuXuqVNpgCEKXP9)

Welch Hall contains some of the largest lecture halls and classrooms on main campus and will be the main venue for COMPEL 2027.

**Engineering Education and Research Center (EER)** — *Lab Tours* — image `venue-eer.jpg`

[2501 Speedway, Austin, TX 78712](https://maps.app.goo.gl/TTWEH4vJVQJzuEEE8)

Home to [UT Austin's Chandra Department of Electrical and Computer Engineering](https://ece.utexas.edu/), the Engineering Education and Research Center ([EER](https://cockrell.utexas.edu/about/facilities/eerc-building/)) spans over 450,000 square feet of learning and research space. It houses [Texas Inventionworks](https://inventionworks.engr.utexas.edu/)' 23,000-square-foot makerspace, the [Texas Materials Institute](https://tmi.utexas.edu/)'s advanced materials analysis and nanofabrication facilities, and the [Texas Innovation Center](https://texasinnovationcenter.utexas.edu/) for emerging ventures and startups.

Attendees can sign up for the tour of EER's facilities on Friday 6/17 as part of their registration at no additional cost.

**J. J. Pickle Research Campus** — *Lab Tours* — image `venue-pickle.jpg`

[10500 Exploration Way, Austin, TX 78758](https://maps.app.goo.gl/kShyZpnGUfZNeTwc7) (CEM)

The Pickle Research campus is UT Austin's 475 acre research facility located in northwest Austin (9 mi from main campus). Among its facilities include the [Microelectronics Research Center (MER)](https://research.utexas.edu/mrc), which facilitates research in electronic, spintronic, and MEMS materials, devices and systems with its 12,000 ft of class 100 cleanroom space. The [Center for Electromechanics](https://cem.utexas.edu/content/about-us) (CEM) supports research in electric machines, grid solutions, and hydrogen energy systems.

Attendees can sign up for the tour of Pickle campus on Monday 6/14 as part of their registration at no additional cost. Transportation to Pickle from main campus will be provided.

### 5.7 Committee (`/committee/`)

**General Chair** (large card with photo `committee-hanson.jpg`): Prof. Alex J. Hanson — University of Texas at Austin

**Organizing Committee** — three cards with photos:

| Name | Affiliation | Photo |
|---|---|---|
| Prof. Alex Q. Huang | University of Texas at Austin | `committee-huang.jpg` |
| Prof. Brian Johnson | University of Texas at Austin | `committee-johnson.jpg` |
| Prof. Yicheng Zhu | University of Texas at Austin | `committee-zhu.jpg` |

Then a name grid without photos, in this order:

| Name | Affiliation |
|---|---|
| Elaine Ng | University of Texas at Austin |
| Alyssa Brown | University of Texas at Austin |
| Jakob Triemstra | University of Texas at Austin |
| Yihao Wu | University of Texas at Austin |
| Dr. Andrey Vulfovich | University of Texas at Austin |
| Ajinkya Phanse | University of Texas at Austin |
| Belle Howell | University of Texas at Austin |
| Ike Ogbu | University of Texas at Austin |
| Nathaniel Roe | University of Texas at Austin |
| Deepta Gupta | University of Texas at Austin |
| Param Shah | University of Texas at Austin |
| Li-Chen Yu | University of Texas at Austin |
| Dr. Pushkar Saraf | AWS-Annapurna Labs |
| Dr. Soham Roy | AWS-Annapurna Labs |
| Cuauhtémoc Macías | University of Texas at Austin |
| Yayun Zhao | University of Texas at Austin |
| Zach Miles | University of Texas at Austin |
| Vishal Meena | University of Texas at Austin |

**Technical Program Committee Chairs** and **Technical Program Committee** — headings exist with no members yet. Model them as empty groups in `committee.json`; render a group's heading only when it has members.

### 5.8 Contact Us (`/contact/`)

If you have any questions, please email us at [compel2027organizers@gmail.com](mailto:compel2027organizers@gmail.com)

## 6. Assets

Run `bash fetch-assets.sh` from this folder first. It downloads everything below into `assets-src/`; copy images to `public/images/` and PDFs to `public/files/`. If a PDF download returns an HTML page or a 401/403, stop and ask the user to download that file by hand from the Digest Information page of the Fourwaves site.

| Local name | What it is | Source |
|---|---|---|
| `logo-banner.png` (1706×422) | Conference logo: orange UT tower line art + "IEEE Workshop on Control and Modeling for Power Electronics, 14 – 17 June 2027, Austin, Texas, USA". Use in the header. White background. | `https://cdn.fourwaves.com/static/media/filecontent/1235f310-b9ea-48fc-a941-563d8c7a0e1d/be24bbef-b3b7-4593-a271-ae069b0d248d.png` |
| `header-current.png` (1469×753) | Current site header: aerial UT campus photo with the logo composited over it. Reference only. As the hero, crop it to the photo region or use it until a clean photo arrives. | `https://cdn.fourwaves.com/static/media/headers/576586d2-fed8-42b6-bc47-75de3383ab8d/7d567483-69d6-4a56-ac01-772a6881d907.png` |
| `dates-table.png` (718×562) | Screenshot of the dates table. Reference only; do not ship it. | `https://cdn.fourwaves.com/static/media/filecontent/2a965ec2-6689-4883-9d33-3005101c8d82/424b5168-55a0-4d7a-96ab-2827b2223fbd.png` |
| `venue-welch.jpg` (2880×2160) | Welch Hall | `https://cdn.fourwaves.com/static/media/filecontent/9c1c6884-a20f-4981-9066-bbe9751cb298/26091726-207e-4cf2-9ad1-fd6fcd0882bc.jpg` |
| `venue-eer.jpg` (1024×768) | EER | `https://cdn.fourwaves.com/static/media/filecontent/e476a8ca-67af-418f-bb66-28f7dc0b7e43/d0c97f34-e83e-4f2c-a63a-758bf4956b8a.jpg` |
| `venue-pickle.jpg` (1195×805) | Pickle Research Campus | `https://cdn.fourwaves.com/static/media/filecontent/efbe51a9-c116-4bb5-b1a6-9465fdec03ce/0c49ac12-8af3-417e-8110-91b608c2aabb.jpg` |
| `committee-hanson.jpg` (800×533) | Prof. Alex J. Hanson | `https://cdn.fourwaves.com/static/media/filecontent/3578c178-c001-4f91-841d-fd4b034c34f3/f1f28e2d-b1cd-411d-aa93-b120d9327b95.jpg` |
| `committee-huang.jpg` (800×533) | Prof. Alex Q. Huang | `https://cdn.fourwaves.com/static/media/speakercontent/539d04af-fe28-414f-ab2d-563cb0b39ffc/1a61da46-2e5e-47b4-90a5-2f007279531c.jpg` |
| `committee-johnson.jpg` (1600×1064) | Prof. Brian Johnson | `https://cdn.fourwaves.com/static/media/speakercontent/cf359026-e6dd-4a91-b67a-1214f18cb9dd/05b44157-729f-4f8d-b580-d40cf50639b6.jpg` |
| `committee-zhu.jpg` (1600×1064) | Prof. Yicheng Zhu | `https://cdn.fourwaves.com/static/media/speakercontent/941cbdbc-d31c-4b0e-bdcb-f4b86af692f7/07d0b648-2118-4273-8d5a-5a1e3b7eedd4.jpg` |
| `IEEE-COMPEL-2027-Call-for-Papers-Flyer.pdf` | Call for papers | `https://api.fourwaves.com/api/files/serve/8d105803-0c6c-4ea7-b8e4-53c77e64d43c` |
| `digest_sample_compel_2027.pdf` | Digest sample | `https://api.fourwaves.com/api/files/serve/452db46f-ca87-48b9-9e75-cf4010b6430f` |

Resize large photos at build time (Astro `<Image>`), max 1600px wide, and keep the logo crisp.

## 7. Content inconsistencies — do not fix silently

Copy the text exactly as given in section 5, and list these in the README under "Questions for Elaine":

1. Tutorial proposal deadline: the dates table says February 19, 2027; the Tutorials page says Friday February 26, 2027.
2. Notification of acceptance: the dates table and Pitch Information page say March 26, 2027; the Home and Digest Information announcements say 3/27/27.
3. Digest submission: the dates table says February 19, 2027; the Fourwaves submission form is configured to close March 5, 2027.
4. EER lab tour is listed as "Friday 6/17" and the Pickle tour as "Monday 6/14"; June 14, 2027 is a Monday and June 17, 2027 is a Thursday.
5. Pickle description says "12,000 ft of class 100 cleanroom space" (likely square feet).
6. "Our Sponsors" has no logos yet.

## 8. Deployment

1. `git init`, commit, create a public GitHub repo named `compel2027-website`, push to `main`. Ask the user before creating the repo or pushing.
2. Repo Settings → Pages → Source: GitHub Actions. The workflow publishes to `https://<owner>.github.io/compel2027-website/`.
3. Custom domain (later, document in README, do not do now): add the domain under Settings → Pages first; then at the DNS provider create four A records for the apex pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and a `www` CNAME to `<owner>.github.io`; add `public/CNAME` with the domain; set `BASE_PATH=/` and `SITE_URL` to the domain; enable Enforce HTTPS once the certificate is issued. DNS can take up to 24 hours.

## 9. Acceptance checklist

- [ ] `npm run build` succeeds with no warnings about broken links or missing images.
- [ ] Every route in section 3 exists; none of the "do not build" pages exist.
- [ ] Logo appears at the top of every page and links Home.
- [ ] Nav bar is dark, sticky, keyboard accessible, with working dropdowns and a mobile menu.
- [ ] Home first screen at 1440×900 and at 390×844 shows logo, campus image, and both big buttons without scrolling.
- [ ] Both buttons, and the nav's Registration and Digest Submission items, go to the exact Fourwaves URLs.
- [ ] Important dates is a `<table>` with six rows and the 11:59 PM CT note.
- [ ] Announcements scroll inside their own box and show both announcements.
- [ ] No link anywhere points to `event.fourwaves.com/compel2027/pages/…`.
- [ ] Both PDFs download from `/files/`.
- [ ] All section 5 text is present verbatim; nothing invented.
- [ ] Site works under a non-root base path (test with `BASE_PATH=/compel2027-website`) and at `/`.
- [ ] Lighthouse accessibility ≥ 95 on Home; no horizontal scroll at 360px.
- [ ] README covers editing content, adding announcements, swapping images, the custom domain steps, and the questions from section 7.

When finished, run the dev server, take screenshots of Home (desktop and mobile), Venues and Committee, and report what was built plus anything from this spec you could not satisfy.
