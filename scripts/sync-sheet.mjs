#!/usr/bin/env node
/**
 * Pull the organizers' Google Sheet into the site's content files.
 *
 *   SHEET_ID=<id from the sheet URL> node scripts/sync-sheet.mjs [--dry-run]
 *
 * The sheet must be shared as "Anyone with the link: Viewer". It has three tabs:
 *   Settings       Key | Value            -> merged into src/data/site.json, note into dates.json
 *   Dates          Milestone | Date | Display (optional)   -> src/data/dates.json
 *   Announcements  Show | Title | Date | Order | Body | Button label | Button link
 *                                          -> src/content/announcements/*.md (replaced wholesale)
 *
 * Nothing is written unless every tab downloads and validates, so a bad edit or an outage
 * leaves the current site content alone. Exits non-zero with a readable message on any problem.
 * No dependencies.
 */
import { readFileSync, writeFileSync, readdirSync, unlinkSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = process.argv.includes('--dry-run');
const sheetId = process.env.SHEET_ID;
const csvDir = process.env.SHEET_CSV_DIR; // testing: read <Tab>.csv from a folder instead of Google
if (!sheetId && !csvDir) fail('SHEET_ID is not set. Set the SHEET_ID repository variable (see README, "Editing content from the spreadsheet").');

function fail(message) {
  console.error(`sync-sheet: ${message}`);
  process.exit(1);
}

// ---------- download + CSV ----------

async function fetchTab(name) {
  if (csvDir) return parseCsv(readFileSync(join(csvDir, `${name}.csv`), 'utf8'));
  const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;
  const res = await fetch(url, { redirect: 'follow' });
  const text = await res.text();
  if (!res.ok) fail(`Could not download the "${name}" tab (HTTP ${res.status}). Check SHEET_ID and that the tab exists.`);
  if (/^\s*<(!doctype|html)/i.test(text)) {
    fail(`The "${name}" tab came back as a web page, not data. Share the sheet as "Anyone with the link: Viewer".`);
  }
  return parseCsv(text);
}

/** RFC 4180 parser: quoted fields, doubled quotes, newlines inside quotes. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      rows.push(row); row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

/** Rows -> objects keyed by lower-cased header. */
function table(rows, required, tab) {
  if (!rows.length) fail(`The "${tab}" tab is empty.`);
  const header = rows[0].map((h) => h.trim().toLowerCase());
  for (const col of required) {
    if (!header.includes(col)) fail(`The "${tab}" tab needs a "${col}" column (found: ${header.join(', ') || 'none'}).`);
  }
  return rows.slice(1).map((r, i) => {
    const obj = { _row: i + 2 };
    header.forEach((h, j) => { obj[h] = (r[j] ?? '').trim(); });
    return obj;
  });
}

// ---------- dates ----------

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/** Accepts 2027-02-19, 2/19/2027, 2/19/27, "February 19, 2027", "Feb 19 2027". Returns YYYY-MM-DD or null. */
function parseDate(value) {
  const s = value.trim();
  let y, m, d, hit;
  if ((hit = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) [y, m, d] = [+hit[1], +hit[2], +hit[3]];
  else if ((hit = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/))) [m, d, y] = [+hit[1], +hit[2], hit[3].length === 2 ? 2000 + +hit[3] : +hit[3]];
  else if ((hit = s.match(/^([A-Za-z]+)\.?\s+(\d{1,2}),?\s+(\d{4})$/))) {
    m = MONTHS.findIndex((name) => name.startsWith(hit[1].toLowerCase().slice(0, 3))) + 1;
    [d, y] = [+hit[2], +hit[3]];
  } else return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (!m || date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return date.toISOString().slice(0, 10);
}

const longDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });
const display = (iso) => longDate.format(new Date(`${iso}T00:00:00Z`));

// ---------- build ----------

const readJson = (rel) => JSON.parse(readFileSync(join(root, rel), 'utf8'));
const problems = [];
const note = (msg) => problems.push(msg);

const [settingsRows, dateRows, annRows] = await Promise.all([
  fetchTab('Settings'),
  fetchTab('Dates'),
  fetchTab('Announcements'),
]);

// Settings -> site.json (+ dates note)
const settings = {};
for (const r of table(settingsRows, ['key', 'value'], 'Settings')) if (r.key) settings[r.key] = r.value;

const site = readJson('src/data/site.json');
const siteKeys = ['dates', 'email', 'registrationUrl', 'submissionUrl'];
for (const key of siteKeys) if (settings[key]) site[key] = settings[key];
for (const key of ['startDate', 'endDate']) {
  if (!settings[key]) continue;
  const iso = parseDate(settings[key]);
  if (iso) site[key] = iso;
  else note(`Settings: "${key}" is not a date I understand: "${settings[key]}"`);
}
for (const key of ['registrationUrl', 'submissionUrl']) {
  if (!/^https?:\/\//.test(site[key] ?? '')) note(`Settings: "${key}" must start with https://`);
}
if (site.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(site.email)) note(`Settings: "email" doesn't look like an email address`);

// Dates -> dates.json
const dates = readJson('src/data/dates.json');
if (settings.datesNote) dates.note = settings.datesNote;
dates.rows = [];
for (const r of table(dateRows, ['milestone', 'date'], 'Dates')) {
  if (!r.milestone && !r.date) continue;
  const iso = parseDate(r.date);
  if (!r.milestone) note(`Dates row ${r._row}: missing milestone`);
  else if (!iso) note(`Dates row ${r._row} ("${r.milestone}"): can't read the date "${r.date}". Use e.g. 2027-02-19.`);
  else dates.rows.push({ milestone: r.milestone, date: iso, display: r.display || display(iso) });
}
if (!dates.rows.length) note('Dates: no rows. Refusing to publish an empty dates table.');
dates.rows.sort((a, b) => a.date.localeCompare(b.date)); // stable: ties keep sheet order

// Announcements -> markdown files
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'announcement';
const announcements = [];
for (const r of table(annRows, ['title', 'body'], 'Announcements')) {
  if (!r.title && !r.body) continue;
  if (/^(no|n|false|hide|0)$/i.test(r.show ?? '')) continue;
  if (!r.title) { note(`Announcements row ${r._row}: missing title`); continue; }
  let iso;
  if (r.date) {
    iso = parseDate(r.date);
    if (!iso) { note(`Announcements row ${r._row}: can't read the date "${r.date}"`); continue; }
  }
  const label = r['button label'];
  const link = r['button link'];
  if (!!label !== !!link) note(`Announcements row ${r._row}: a button needs both a label and a link`);
  if (link && !/^(https?:\/\/|\/)/.test(link)) note(`Announcements row ${r._row}: button link must start with https:// or /`);
  const order = r.order === '' || r.order === undefined ? undefined : Number(r.order);
  if (order !== undefined && Number.isNaN(order)) note(`Announcements row ${r._row}: order must be a number`);
  announcements.push({ title: r.title, date: iso, order, label, link, body: r.body });
}

if (problems.length) {
  console.error('sync-sheet: the sheet has problems, so the site was NOT updated:\n');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

const front = (a) => {
  const lines = ['---', `title: ${JSON.stringify(a.title)}`];
  if (a.date) lines.push(`date: ${a.date}`);
  if (a.order !== undefined) lines.push(`order: ${a.order}`);
  if (a.label && a.link) lines.push(`buttonLabel: ${JSON.stringify(a.label)}`, `buttonHref: ${JSON.stringify(a.link)}`);
  lines.push('---', '', a.body.replace(/\r\n?/g, '\n').trim(), '');
  return lines.join('\n');
};

if (dryRun) {
  console.log(`dry run OK: ${dates.rows.length} dates, ${announcements.length} announcements, settings: ${Object.keys(settings).join(', ')}`);
  process.exit(0);
}

const write = (rel, data) => writeFileSync(join(root, rel), `${JSON.stringify(data, null, 2)}\n`);
write('src/data/site.json', site);
// dates.json keeps one row per line like the hand-edited file
writeFileSync(
  join(root, 'src/data/dates.json'),
  `{\n  "note": ${JSON.stringify(dates.note)},\n  "rows": [\n${dates.rows.map((r) => `    ${JSON.stringify(r).replace(/","/g, '", "').replace(/":"/g, '": "').replace(/^\{/, '{ ').replace(/\}$/, ' }')}`).join(',\n')}\n  ]\n}\n`,
);

const annDir = join(root, 'src/content/announcements');
mkdirSync(annDir, { recursive: true });
for (const f of readdirSync(annDir)) if (f.endsWith('.md')) unlinkSync(join(annDir, f));
announcements.forEach((a, i) => {
  writeFileSync(join(annDir, `${String(i + 1).padStart(2, '0')}-${slugify(a.title)}.md`), front(a));
});

console.log(`synced: ${dates.rows.length} dates, ${announcements.length} announcements`);
