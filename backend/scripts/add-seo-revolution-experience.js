/**
 * Adds the current SEO Revolution position to the Skills & Experience section,
 * with a Project Details card covering every site worked on.
 *
 * What it creates
 *   1. An `experiences` document for 2024 holding one `workExperience` entry
 *      for the role. No endDate, so the site renders "– Present".
 *   2. A `projectDetails` document titled exactly the same as the role's `name`,
 *      which is what makes the "More Details" button appear. It carries the
 *      role summary, the technologies, the team, and one result slide per site
 *      with a homepage screenshot and a description.
 *
 * Images are uploaded to Sanity: the company logo and team photos are pulled
 * from seo-revolution.com, and homepage screenshots are captured with Puppeteer
 * (or read from a folder, see SCREENSHOT_DIR).
 *
 * Usage, from the backend folder:
 *
 *   # see exactly what would be created, no writes, no screenshots
 *   node scripts/add-seo-revolution-experience.js --dry-run
 *
 *   # the real run
 *   SANITY_PROJECT_ID=xxxx SANITY_WRITE_TOKEN=sk... \
 *   STAGING_USER=... STAGING_PASS=... \
 *   node scripts/add-seo-revolution-experience.js
 *
 * Environment
 *   SANITY_PROJECT_ID    required
 *   SANITY_WRITE_TOKEN   required. Create it in sanity.io/manage, Editor rights.
 *   SANITY_DATASET       defaults to "production"
 *   STAGING_USER/_PASS   HTTP basic auth for the password-protected staging
 *                        sites. Passed to Puppeteer at run time and never
 *                        written anywhere. Deliberately NOT hardcoded: this
 *                        repository is public.
 *   SCREENSHOT_DIR       skip Puppeteer and use <dir>/<slug>.png instead.
 *
 * Re-running is safe: it looks for documents that already exist and skips them
 * rather than creating duplicates. Pass --force to create anyway.
 */

const fs = require('fs');
const path = require('path');

const API_VERSION = '2022-12-11';

const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_WRITE_TOKEN;
const dataset = process.env.SANITY_DATASET || 'production';

const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

const stagingAuth = process.env.STAGING_USER && process.env.STAGING_PASS
  ? { username: process.env.STAGING_USER, password: process.env.STAGING_PASS }
  : null;

const screenshotDir = process.env.SCREENSHOT_DIR || null;

// ---------------------------------------------------------------------------
// The content. Edit here rather than in the Studio, then re-run with --force.
// ---------------------------------------------------------------------------

const ROLE = {
  year: '2024',
  // Must match PROJECT_DETAILS.title exactly, or the More Details button
  // will not appear on the card.
  name: 'Frontend Developer',
  company: 'SEO REVOLUTION',
  companyLogoUrl: 'https://seo-revolution.com/wp-content/uploads/seo-revolution-logo.svg',
  startDate: '2024-11-03',
  endDate: null, // ongoing — renders as "Present"
  desc:
    'Build and maintain client websites end to end with WordPress and Bricks Builder, '
    + 'implementing Figma designs as responsive, SEO-ready sites. Delivered seven full builds '
    + 'from design handover through to launch, built two technical calculators for an '
    + 'electrical cable manufacturer, delivered a bilingual German to English relaunch with '
    + 'WPML and correct hreflang, and handle ongoing maintenance, on-page SEO and design '
    + 'fixes across a portfolio of seventeen client sites.',
  // Names matching an existing `skills` document reuse its icon; the rest show
  // as initials. Kept short — these are the tags on the experience card.
  tags: ['WordPress', 'Bricks Builder', 'JavaScript', 'PHP', 'SEO'],
};

const PROJECT_DETAILS = {
  title: ROLE.name,
  role:
    'Frontend Developer at SEO Revolution. I implement designs from our UX/UI designer in '
    + 'WordPress with Bricks Builder, build the pages and templates, wire up the plugins and '
    + 'forms, handle custom JavaScript and PHP where a design needs it, and keep the sites '
    + 'maintained and technically sound for SEO afterwards.',
  description:
    'Client website delivery and maintenance at SEO Revolution, a German SEO and web agency. '
    + 'The projects below cover full builds, a German to English translation, two custom '
    + 'calculators, and ongoing SEO and design work across the client portfolio.',
  startDate: ROLE.startDate,
  endDate: null,
  /**
   * Verified by inspecting the live sites' loaded theme and plugin paths rather
   * than from memory: theme "bricks" + "bricks-child" on the agency builds,
   * Oxygen on kbe-elektrotechnik.com.
   */
  technologies: [
    'WordPress',
    'Bricks Builder',
    'Oxygen Builder',
    'Automatic.css',
    'BricksExtras',
    'Bricksforge',
    'Advanced Themer',
    'Fluent Forms',
    'WPML',
    'WooCommerce',
    'WP Rocket',
    'JavaScript',
    'PHP',
    'HTML',
    'Sass',
    'Figma',
    'Git',
  ],
};

/** Team, from seo-revolution.com/team. Khalil first so he reads as the owner. */
const TEAM = [
  {
    name: 'Khalil Fathalli',
    role: 'Frontend Developer',
    photo: 'https://seo-revolution.com/wp-content/uploads/khalil-fathalli-frontend-entwickler-767.webp',
  },
  {
    name: 'Anastasia Korepanova',
    role: 'UX/UI Designer',
    photo: 'https://seo-revolution.com/wp-content/uploads/anastasia-korepanova.webp',
  },
  {
    name: 'Toni Frisch',
    role: 'Managing Director & Head of SEO',
    photo: 'https://seo-revolution.com/wp-content/uploads/toni-frisch-geschaeftsfuehrer-der-seo-revolution-gmbh-profilansicht.webp',
  },
  {
    name: 'Khusam Alfas',
    role: 'CTO & Head of Growth',
    photo: 'https://seo-revolution.com/wp-content/uploads/khusam-alfas-profil-767.webp',
  },
  {
    name: 'Valeria Frisch',
    role: 'Project Manager',
    photo: 'https://seo-revolution.com/wp-content/uploads/valeria-frisch.webp',
  },
  {
    name: 'Sylvio Murer',
    role: 'Frontend Developer & Graphic Designer',
    photo: 'https://seo-revolution.com/wp-content/uploads/sylvio-murer.webp',
  },
  {
    name: 'David Keiser',
    role: 'Web Designer & SEO Expert',
    photo: 'https://seo-revolution.com/wp-content/uploads/david-keiser-webdesigner-seo-experte-portraet-767.webp',
  },
  {
    name: 'Ronny Krebs',
    role: 'SEO Manager',
    photo: 'https://seo-revolution.com/wp-content/uploads/ronny-krebs.webp',
  },
  {
    name: 'Jeannette Krebs',
    role: 'Copywriter',
    photo: 'https://seo-revolution.com/wp-content/uploads/jeannette-krebs.webp',
  },
];

/**
 * One result slide per site. `slug` names the screenshot file.
 * `needsAuth` marks the staging sites behind HTTP basic auth.
 */
const PROJECTS = [
  {
    slug: 'prenzl-repair',
    title: 'Prenzl Repair',
    url: 'https://prenzl-repair.de/',
    description:
      'Device repair shop in Berlin Prenzlauer Berg offering 60-minute repairs for '
      + 'smartphones, MacBooks, tablets, laptops and consoles. Built from start to finish in '
      + 'WordPress with Bricks Builder, from the Figma design through to launch: the '
      + 'device-picker journey, the repair enquiry forms in Fluent Forms, searchable service '
      + 'listings with JetSearch, and a WhatsApp contact route. Styled with Automatic.css and '
      + 'Advanced Themer, with BricksExtras and Bricksforge for the interactive components.',
  },
  {
    slug: 'domke-parkett',
    title: 'Domke Parkett',
    url: 'https://www.domke-parkett.de/',
    description:
      'Master flooring and joinery company working across Berlin and Brandenburg. Built from '
      + 'start to finish in WordPress with Bricks Builder: service pages for laying, sanding '
      + 'and restoring parquet, project galleries, and a quote request flow in Fluent Forms '
      + 'Pro. Includes a WooCommerce shop with WooCommerce Germanized for German legal '
      + 'compliance, and WP Rocket for page performance.',
  },
  {
    slug: 'trendline',
    title: 'Trendline',
    url: 'https://www.trendline.ch/',
    description:
      'Swiss interior design and architecture studio. Built from start to finish in WordPress '
      + 'with Bricks Builder, with an image-led editorial layout across the interior '
      + 'architecture, new build and renovation service pages. Set up as a multilingual site '
      + 'with WPML, styled with Automatic.css, enquiries handled by Fluent Forms.',
  },
  {
    slug: 'hey-grey',
    title: 'HEYGREY — Grey Immobilien',
    url: 'https://hey-grey.de/',
    description:
      'Estate agency in Essen with more than 25 years on the local market and two offices. '
      + 'Built from start to finish in WordPress with Bricks Builder: property valuation entry '
      + 'points and the sales, letting, valuation and management service pages. Styled with '
      + 'Automatic.css and Advanced Themer, with WP Rocket for performance and Borlabs Cookie '
      + 'for GDPR consent.',
  },
  {
    slug: 'life-to-go',
    title: 'Life to go',
    url: 'https://life.seo-revolution.com/',
    description:
      'Travel blog for a family who have been travelling since 2015 and now live in Thailand. '
      + 'Built from start to finish, with a blog architecture for destination guides and '
      + 'long-form travel content.',
  },
  // Both of these are pre-launch staging builds behind HTTP basic auth. Check
  // with the client before publishing screenshots of them.
  {
    slug: 'house-of-mobile',
    title: 'House of Mobile Berlin',
    url: 'https://homg.seo-revolution.com/',
    needsAuth: true,
    description:
      'Relaunch of houseofmobile-berlin.de, built from start to finish in WordPress with '
      + 'Bricks Builder, including the product category structure and the relationships '
      + 'between categories. Currently in development on staging.',
  },
  {
    slug: 'eventforum-bern',
    title: 'Eventforum Bern',
    url: 'https://bern.seo-revolution.com/',
    needsAuth: true,
    description:
      'Relaunch of eventforumbern.ch, an event and congress venue in Bern, built from start '
      + 'to finish in WordPress with Bricks Builder. Covers the individual room pages — event '
      + 'hall, congress hall, seminar, training, workshop and meeting rooms, and the foyer — '
      + 'the service pages for event consulting, catering, event technology, furniture and '
      + 'hybrid livestreaming, plus the booking form and its thank-you pages. Currently in '
      + 'development on staging.',
  },
  {
    slug: 'markiewicz-holztreppen',
    title: 'markiewicz Holztreppen',
    url: 'https://www.markiewicz-holztreppen.de/',
    description:
      'Bespoke wooden staircase manufacturer in Berlin, trading since 1996. I translated the '
      + 'entire site from German to English, page by page, delivering it as a proper '
      + 'bilingual WordPress site with WPML: separate language versions with correct hreflang '
      + 'annotations, so both languages are indexed cleanly and the layout and on-page SEO '
      + 'structure stayed intact throughout.',
  },
  {
    slug: 'kbe-elektrotechnik',
    title: 'KBE Elektrotechnik — technical calculators',
    url: 'https://www.kbe-elektrotechnik.com/service/rechner-querschnitt-strombelastbarkeit/',
    description:
      'Electrical cable manufacturer. I implemented two technical tools the client asked for, '
      + 'on a WordPress site built with Oxygen Builder. The first is a DC calculator that '
      + 'works out the optimal cable cross-section, the current carrying capacity and the '
      + 'percentage voltage drop for photovoltaic and direct-current installations, driven by '
      + 'the relevant electrical formulas across around thirty inputs. The second is an AWG '
      + 'table converting American Wire Gauge sizes to mm², mm and ohm/km for the North '
      + 'American market.',
  },
  {
    slug: 'italienischonlinelernen',
    title: 'Italienisch Online Lernen',
    url: 'https://www.italienischonlinelernen.de/',
    description:
      'Online Italian lessons with a native-speaker tutor and her team. On-page SEO work and '
      + 'design fixes, plus ongoing maintenance.',
  },
  {
    slug: 'umzug-schoepke',
    title: 'Umzug Schöpke',
    url: 'https://umzug-schoepke.de/',
    description:
      'Removals company. On-page SEO work and design fixes, plus ongoing maintenance.',
  },
  {
    slug: 'qualitaet-aus-polen',
    title: 'Qualität aus Polen',
    url: 'https://qualitaet-aus-polen.de/',
    description:
      'Supplier of carports, staircases and garden products manufactured in Poland. On-page '
      + 'SEO work and design fixes across the product category pages.',
  },
  {
    slug: 'house-of-cards-and-games',
    title: 'House of Cards and Games',
    url: 'https://house-of-cards-and-games.de/',
    description:
      'Berlin online shop for games consoles, trading cards, collectible figures and retro '
      + 'games. On-page SEO work and design fixes across the shop.',
  },
  {
    slug: 'mypulse',
    title: 'MY PULSE',
    url: 'https://mypulse.de/',
    description:
      'Premium gym and physiotherapy practice in Bonn with two locations. On-page SEO work '
      + 'and design fixes, plus ongoing maintenance.',
  },
  {
    slug: 'systemloesungen-hisl',
    title: 'HISL Systemlösungen',
    url: 'https://www.systemloesungen-hisl.de/',
    description:
      'Hamburg institute offering part-time systemic training, distance-learning courses and '
      + 'certified workshops. On-page SEO work and design fixes.',
  },
  {
    slug: 'sunlux24',
    title: 'Sunlux24',
    url: 'https://sunlux24.de/',
    description:
      'Online shop for made-to-measure sun protection: pleated blinds, wooden venetian '
      + 'blinds, vertical blinds and skylight blinds. On-page SEO work and design fixes.',
  },
  {
    slug: 'h24hotels',
    title: 'H24 Hotels',
    url: 'https://h24hotels.com/',
    description:
      'Hotel group offering affordable, no-frills stays. On-page SEO work and design fixes, '
      + 'plus ongoing maintenance.',
  },
];

// ---------------------------------------------------------------------------
// Sanity helpers
// ---------------------------------------------------------------------------

const baseUrl = `https://${projectId}.api.sanity.io/v${API_VERSION}`;

const authHeaders = () => ({ Authorization: `Bearer ${token}` });

async function query(groq, params = {}) {
  const url = new URL(`${baseUrl}/data/query/${dataset}`);
  url.searchParams.set('query', groq);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(`$${k}`, JSON.stringify(v)));

  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`Query failed (${res.status}): ${await res.text()}`);
  return (await res.json()).result;
}

async function mutate(mutations) {
  const res = await fetch(`${baseUrl}/data/mutate/${dataset}?returnIds=true`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Mutation failed (${res.status}): ${await res.text()}`);
  return res.json();
}

/** Uploads a buffer to the Sanity asset store and returns an image field value. */
async function uploadImage(buffer, filename, contentType) {
  const url = new URL(`${baseUrl}/assets/images/${dataset}`);
  url.searchParams.set('filename', filename);

  const res = await fetch(url, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': contentType },
    body: buffer,
  });
  if (!res.ok) throw new Error(`Asset upload failed for ${filename} (${res.status}): ${await res.text()}`);

  const { document: asset } = await res.json();
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

async function uploadImageFromUrl(sourceUrl, filename) {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Could not download ${sourceUrl} (${res.status})`);

  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const buffer = Buffer.from(await res.arrayBuffer());
  return uploadImage(buffer, filename, contentType.split(';')[0]);
}

// ---------------------------------------------------------------------------
// Screenshots
// ---------------------------------------------------------------------------

/**
 * Captures each homepage at 1440x900, 2x, above the fold.
 *
 * Consent banners are hidden with CSS rather than accepted. Clicking "accept"
 * would be consenting on someone else's behalf, and hiding is enough to get a
 * clean screenshot.
 */
const HIDE_CONSENT_CSS = `
  #cmplz-cookiebanner-container, .cmplz-cookiebanner,
  #CybotCookiebotDialog, #CybotCookiebotDialogBodyUnderlay,
  .cookie-notice-container, #cookie-notice,
  .borlabs-cookie-box, #BorlabsCookieBox,
  .cky-consent-container, .cky-overlay,
  #usercentrics-root, #onetrust-consent-sdk,
  .moove_gdpr_cookie_modal, #moove_gdpr_cookie_modal,
  .pum-overlay, .wpcc-container,
  [id*="cookie-law"], [class*="cookie-banner"], [id*="cookieConsent"] {
    display: none !important;
  }
  html, body { overflow: auto !important; }
`;

async function captureScreenshots(projects) {
  if (screenshotDir) {
    console.log(`\nUsing screenshots from ${screenshotDir}`);
    const out = new Map();
    projects.forEach((p) => {
      const file = path.join(screenshotDir, `${p.slug}.png`);
      if (fs.existsSync(file)) {
        out.set(p.slug, { buffer: fs.readFileSync(file), contentType: 'image/png' });
      } else {
        console.warn(`  ! no file for ${p.slug} (${file})`);
      }
    });
    return out;
  }

  let puppeteer;
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    puppeteer = require('puppeteer');
  } catch {
    console.error(
      '\nPuppeteer is not installed, so screenshots cannot be captured.\n'
      + '  Install it:   npm install --save-dev puppeteer\n'
      + '  Or supply your own PNGs named <slug>.png and set SCREENSHOT_DIR.\n'
      + '  Slugs: ' + projects.map((p) => p.slug).join(', '),
    );
    process.exit(1);
  }

  console.log('\nCapturing screenshots...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const out = new Map();

  for (const project of projects) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

      if (project.needsAuth) {
        if (!stagingAuth) {
          console.warn(`  ! ${project.slug} needs STAGING_USER / STAGING_PASS — skipped`);
          await page.close();
          continue;
        }
        await page.authenticate(stagingAuth);
      }

      await page.goto(project.url, { waitUntil: 'networkidle2', timeout: 60000 });
      await page.addStyleTag({ content: HIDE_CONSENT_CSS });
      // Let lazy-loaded hero images settle.
      await new Promise((r) => setTimeout(r, 2500));

      const buffer = await page.screenshot({ type: 'png' });
      out.set(project.slug, { buffer, contentType: 'image/png' });
      console.log(`  captured ${project.slug}`);
    } catch (err) {
      console.warn(`  ! ${project.slug} failed: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  return out;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const keyFor = (prefix, value) => `${prefix}-${String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 60);

async function main() {
  if (dryRun) {
    console.log('DRY RUN — nothing will be written.\n');
    console.log(`Role          : ${ROLE.name} at ${ROLE.company}`);
    console.log(`Year          : ${ROLE.year}`);
    console.log(`Dates         : ${ROLE.startDate} -> ${ROLE.endDate || 'Present (ongoing)'}`);
    console.log(`Role tags     : ${ROLE.tags.join(', ')}`);
    console.log(`Technologies  : ${PROJECT_DETAILS.technologies.join(', ')}`);
    console.log(`Team members  : ${TEAM.length}`);
    TEAM.forEach((m) => console.log(`  - ${m.name} — ${m.role}`));
    console.log(`Result slides : ${PROJECTS.length}`);
    PROJECTS.forEach((p, i) => console.log(`  ${String(i + 1).padStart(2)}. ${p.title}${p.needsAuth ? '  [needs auth]' : ''}`));
    console.log('\nRe-run without --dry-run, with SANITY_WRITE_TOKEN set, to apply.');
    return;
  }

  if (!projectId || !token) {
    console.error('Set SANITY_PROJECT_ID and SANITY_WRITE_TOKEN. See the header of this file.');
    process.exit(1);
  }

  // --- guard against duplicates ---
  const [existingDetails, existingYear] = await Promise.all([
    query('*[_type == "projectDetails" && title == $title][0]._id', { title: PROJECT_DETAILS.title }),
    query('*[_type == "experiences" && year == $year][0]{_id, "roles": works[].name}', { year: ROLE.year }),
  ]);

  if (!force && existingDetails) {
    console.error(
      `A projectDetails document titled "${PROJECT_DETAILS.title}" already exists (${existingDetails}).\n`
      + 'Delete it in the Studio, or pass --force to create another.',
    );
    process.exit(1);
  }
  if (!force && existingYear && (existingYear.roles || []).includes(ROLE.name)) {
    console.error(`The ${ROLE.year} experience document already lists "${ROLE.name}". Pass --force to add it again.`);
    process.exit(1);
  }

  // --- reuse existing skill icons where the names match ---
  const skills = await query('*[_type == "skills"]{name, bgColor, icon}');
  const skillByName = new Map(skills.map((s) => [s.name.toLowerCase(), s]));

  const toTech = (name, prefix) => {
    const existing = skillByName.get(name.toLowerCase());
    if (!existing) console.log(`  note: no skill icon for "${name}" — it will show as text only`);
    return {
      _type: 'skills',
      _key: keyFor(prefix, name),
      name,
      ...(existing && existing.bgColor ? { bgColor: existing.bgColor } : {}),
      ...(existing && existing.icon ? { icon: existing.icon } : {}),
    };
  };

  console.log('Resolving technologies...');
  const roleTags = ROLE.tags.map((n) => toTech(n, 'tag'));
  const technologies = PROJECT_DETAILS.technologies.map((n) => toTech(n, 'tech'));

  // --- images ---
  console.log('\nUploading company logo...');
  const companyLogo = await uploadImageFromUrl(ROLE.companyLogoUrl, 'seo-revolution-logo.svg');

  console.log('\nUploading team photos...');
  const members = [];
  for (const member of TEAM) {
    let photo;
    try {
      photo = await uploadImageFromUrl(member.photo, `${keyFor('member', member.name)}.webp`);
      console.log(`  uploaded ${member.name}`);
    } catch (err) {
      console.warn(`  ! ${member.name}: ${err.message}`);
    }
    members.push({
      _type: 'members',
      _key: keyFor('member', member.name),
      name: member.name,
      role: member.role,
      project: PROJECT_DETAILS.title,
      ...(photo ? { photo } : {}),
    });
  }

  const shots = await captureScreenshots(PROJECTS);

  console.log('\nUploading screenshots...');
  const results = [];
  for (const project of PROJECTS) {
    const shot = shots.get(project.slug);
    let image;
    if (shot) {
      try {
        image = await uploadImage(shot.buffer, `${project.slug}.png`, shot.contentType);
        console.log(`  uploaded ${project.slug}`);
      } catch (err) {
        console.warn(`  ! ${project.slug}: ${err.message}`);
      }
    } else {
      console.warn(`  ! ${project.slug}: no screenshot, slide will have no image`);
    }

    results.push({
      _type: 'projectResults',
      _key: keyFor('result', project.slug),
      title: project.title,
      description: `${project.description} ${project.url}`,
      ...(image ? { results: image } : {}),
    });
  }

  // --- documents ---
  const workEntry = {
    _type: 'workExperience',
    _key: keyFor('work', ROLE.name),
    name: ROLE.name,
    company: ROLE.company,
    desc: ROLE.desc,
    startDate: ROLE.startDate,
    // endDate intentionally omitted for an ongoing role.
    ...(ROLE.endDate ? { endDate: ROLE.endDate } : {}),
    companyLogo,
    tags: roleTags,
  };

  const mutations = [
    {
      create: {
        _type: 'projectDetails',
        title: PROJECT_DETAILS.title,
        description: PROJECT_DETAILS.description,
        role: PROJECT_DETAILS.role,
        startDate: PROJECT_DETAILS.startDate,
        ...(PROJECT_DETAILS.endDate ? { endDate: PROJECT_DETAILS.endDate } : {}),
        technologies,
        members,
        results,
      },
    },
  ];

  if (existingYear) {
    // Append to the existing year rather than creating a second 2024 document.
    mutations.push({
      patch: {
        id: existingYear._id,
        setIfMissing: { works: [] },
        insert: { after: 'works[-1]', items: [workEntry] },
      },
    });
  } else {
    mutations.push({ create: { _type: 'experiences', year: ROLE.year, works: [workEntry] } });
  }

  console.log('\nWriting documents...');
  const res = await mutate(mutations);
  console.log(`Done. Document ids: ${(res.results || []).map((r) => r.id).join(', ')}`);
  console.log(
    '\nCheck it in the Studio, then reload the site. The role appears under '
    + `${ROLE.year} in Skills & Experience with a "More Details" button.`,
  );
}

main().catch((err) => {
  console.error(`\nFailed: ${err.message}`);
  process.exit(1);
});
