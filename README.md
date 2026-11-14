# COMPEL 2027 website

The website for IEEE COMPEL 2027 (University of Texas at Austin, June 14-17, 2027). It is a set of plain text files that GitHub turns into the site. Every time a change is saved to the `main` branch, the site rebuilds and republishes itself in about two minutes.

You can make every change below on github.com: open the file, click the pencil icon, edit, then click "Commit changes".

## Where things are

| What | File |
|---|---|
| Text of a page | `src/content/pages/<page>.md` |
| Announcements on the home page | `src/content/announcements/` (one file each) |
| Important dates table | `src/data/dates.json` |
| Committee members | `src/data/committee.json` |
| Sponsors | `src/data/sponsors.json` |
| Registration and submission links, contact email, address | `src/data/site.json` |
| Menu | `src/data/nav.json` |
| Pictures | `public/images/` |
| PDFs | `public/files/` |

## Edit the text of a page

Open the page's file in `src/content/pages/`:

`digest-information.md`, `pitch-information.md`, `tutorials.md`, `keynotes.md`, `schedule.md`, `travel.md`, `contact.md`

The top of each file, between the two `---` lines, holds the page title. Everything under it is the page text, written in Markdown:

```
## A section heading

A paragraph. **Bold text.** A [link to another page](/tutorials/) or to [another site](https://www.ieee-pels.org/).

- A bullet
- Another bullet
```

Three extras, each on a line of its own with a blank line above and below:

- A file download row: `[Download: Name shown to readers.pdf](/files/the-file.pdf)`
- A button: `[Button: Label](/pitch-information/)` or `[Button: Label](https://example.org/)`
- To link to registration or digest submission, use `site:registrationUrl` or `site:submissionUrl` as the link, for example `[Button: Digest Submission](site:submissionUrl)`. The real addresses are kept in one place, `src/data/site.json`.

Links to pages of this site start with `/` (for example `/venues/`). Do not link to `event.fourwaves.com/compel2027/pages/...`.

Keynotes, Schedule at a Glance and Travel are empty and show "Details coming soon." As soon as you write text in their file, the text replaces that line.

## Add an announcement

In `src/content/announcements/`, click "Add file" then "Create new file". Name it something like `hotel-block.md` and write:

```
---
title: The headline
date: 2027-01-15
buttonLabel: Read more
buttonHref: /travel/
---

The text of the announcement.
```

`date`, `buttonLabel` and `buttonHref` are optional; leave those lines out if you do not need them. Newest dates come first. For announcements without a date, add a line `order: 3`; the higher number is listed first. To remove an announcement, delete its file.

## Change the important dates

Open `src/data/dates.json`. Each row looks like this:

```
{ "milestone": "Digest Submission", "date": "2027-02-19", "display": "February 19, 2027" }
```

`display` is what readers see. `date` is the same day written as year-month-day; the site uses it to cross out dates that have passed. Change both together. To add a row, copy a line and keep the comma between rows (no comma after the last one).

## Add committee members

Open `src/data/committee.json`. It has one group per heading (General Chair, Organizing Committee, Technical Program Committee Chairs, Technical Program Committee). Add a person to a group's `members` list:

```
{ "name": "Dr. Jane Doe", "affiliation": "University of Texas at Austin" }
```

To show a portrait, upload it to `public/images/` and add `"photo": "/images/committee-doe.jpg"` to that person. A group with no members is not shown; it appears as soon as it has one.

## Add sponsors

Upload the logo to `public/images/`, then add an entry to `src/data/sponsors.json`. An entry looks like this (`url` is optional):

```
{ "name": "Sponsor name", "logo": "/images/sponsor-name.png", "url": "https://sponsor.example" }
```

The "Our Sponsors" section stays hidden while this file is an empty list (`[]`).

## Swap an image

Every picture is one file in `public/images/`. To replace one, upload a new picture with exactly the same file name ("Add file", "Upload files"); it takes the old one's place everywhere.

| File | Where it appears |
|---|---|
| `logo-banner.png` | Top of every page |
| `hero-campus.jpg` | Campus photo on the home page |
| `venue-welch.jpg`, `venue-eer.jpg`, `venue-pickle.jpg` | Venues |
| `committee-hanson.jpg`, `committee-huang.jpg`, `committee-johnson.jpg`, `committee-zhu.jpg` | Committee |

The two PDFs on the Digest Information page work the same way, in `public/files/`: `IEEE-COMPEL-2027-Call-for-Papers-Flyer.pdf` and `digest_sample_compel_2027.pdf`.

## Fetch the real images and PDFs

The site starts with grey placeholder pictures and no PDFs. To bring over the real files from the Fourwaves site:

1. On github.com open the "Actions" tab.
2. Choose "Fetch real assets" on the left.
3. Click "Run workflow", then the green "Run workflow" button.

When it finishes, the pictures and PDFs are saved into the site and it republishes. If the run shows a warning that a PDF did not download, download that PDF by hand from the Digest Information page of the Fourwaves site and upload it to `public/files/` with the file name given above.

## Run the site on your own computer (optional)

You need [Node.js](https://nodejs.org/) 20 or newer. In a terminal, inside this folder:

```
npm install
npm run dev
```

Then open the address it prints. To make the finished site the way GitHub does:

```
npm run build
```

The result is in the `dist` folder.

## Publish on GitHub Pages

1. Put this folder in a public GitHub repository named `compel2027-website`, on the `main` branch.
2. In the repository: Settings, Pages, Source: "GitHub Actions".
3. The site appears at `https://<owner>.github.io/compel2027-website/`.

## Connect the official domain

Do these in order:

1. In the repository: Settings, Pages, "Custom domain". Enter the domain and save.
2. At the company where the domain is registered (the DNS provider), create four A records for the bare domain pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and one CNAME record for `www` pointing to `<owner>.github.io`.
3. Add a file `public/CNAME` whose only content is the domain (for example `compel2027.org`).
4. The site must now be built with `BASE_PATH` set to `/` and `SITE_URL` set to the domain. The publishing workflow reads both from the Pages settings, so after step 1 this happens by itself on the next publish (Actions tab, "Run workflow", or any saved change). Only if you build the site yourself do you set them by hand: `BASE_PATH=/ SITE_URL=https://compel2027.org npm run build`.
5. Back in Settings, Pages, tick "Enforce HTTPS" once the certificate has been issued.

DNS changes can take up to 24 hours.

## Questions for Elaine

The text was copied exactly from the Fourwaves site. These points disagree with each other or look like slips, and were left as they are:

1. Tutorial proposal deadline: the dates table says February 19, 2027; the Tutorials page says Friday February 26, 2027.
2. Notification of acceptance: the dates table and Pitch Information page say March 26, 2027; the Home and Digest Information announcements say 3/27/27.
3. Digest submission: the dates table says February 19, 2027; the Fourwaves submission form is configured to close March 5, 2027.
4. EER lab tour is listed as "Friday 6/17" and the Pickle tour as "Monday 6/14"; June 14, 2027 is a Monday and June 17, 2027 is a Thursday.
5. Pickle description says "12,000 ft of class 100 cleanroom space" (likely square feet).
6. "Our Sponsors" has no logos yet.
