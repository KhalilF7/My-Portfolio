/**
 * Stage one of adding the SEO Revolution role without a write token.
 *
 * A Sanity write token is normally needed to create documents and upload
 * assets. The Studio running on localhost:3333 is already authenticated, so the
 * browser can do the writing with its own session instead — but it cannot read
 * the images: fetching seo-revolution.com or a local PNG from the Studio origin
 * is blocked by CORS, and the screenshots only exist on disk.
 *
 * So this script does the parts Node is good at — downloading logos and photos,
 * capturing screenshots — writes everything to a temp folder alongside a
 * manifest, and serves that folder with a permissive CORS header. The browser
 * then fetches from here and uploads to Sanity using the Studio's session.
 *
 *   node scripts/prepare-assets.js
 *
 * Environment (optional):
 *   STAGING_USER / STAGING_PASS   HTTP basic auth for the staging sites
 *   PORT                          defaults to 4180
 *   SKIP_SHOTS=1                  reuse screenshots already in the temp folder
 *
 * Leave it running while the browser side works, then stop it with Ctrl+C.
 */

const fs = require('fs');
const http = require('http');
const path = require('path');

const {
  ROLE, PROJECT_DETAILS, TEAM, PROJECTS, SKILLS_TO_ADD,
} = require('./add-seo-revolution-experience');

const OUT_DIR = path.join(__dirname, '..', '.tmp-assets');
const PORT = Number(process.env.PORT) || 4180;
const SKIP_SHOTS = process.env.SKIP_SHOTS === '1';

const stagingAuth = process.env.STAGING_USER && process.env.STAGING_PASS
  ? { username: process.env.STAGING_USER, password: process.env.STAGING_PASS }
  : null;

const CONTENT_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const slugify = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const HIDE_CONSENT_CSS = `
  #cmplz-cookiebanner-container, .cmplz-cookiebanner,
  #CybotCookiebotDialog, #CybotCookiebotDialogBodyUnderlay,
  .cookie-notice-container, #cookie-notice,
  .borlabs-cookie-box, #BorlabsCookieBox, #BorlabsCookieBoxWrap,
  .cky-consent-container, .cky-overlay,
  #usercentrics-root, #onetrust-consent-sdk,
  .moove_gdpr_cookie_modal, #moove_gdpr_cookie_modal,
  .pum-overlay, .wpcc-container,
  [id*="cookie-law"], [class*="cookie-banner"], [id*="cookieConsent"] {
    display: none !important;
  }
  html, body { overflow: auto !important; }
`;

async function download(url, filename) {
  const target = path.join(OUT_DIR, filename);
  if (fs.existsSync(target)) return { filename, cached: true };

  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);

  fs.writeFileSync(target, Buffer.from(await res.arrayBuffer()));
  return { filename, cached: false };
}

async function captureScreenshots() {
  const pending = PROJECTS.filter((p) => !fs.existsSync(path.join(OUT_DIR, `shot-${p.slug}.png`)));

  if (SKIP_SHOTS || !pending.length) {
    console.log(pending.length ? 'SKIP_SHOTS set — using what is already on disk.' : 'All screenshots already captured.');
    return;
  }

  const mod = await import('puppeteer');
  const puppeteer = mod.default || mod;

  console.log(`\nCapturing ${pending.length} screenshot(s)...`);
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const project of pending) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

      if (project.needsAuth) {
        if (!stagingAuth) {
          console.warn(`  ! ${project.slug}: needs STAGING_USER / STAGING_PASS — skipped`);
          await page.close();
          continue;
        }
        await page.authenticate(stagingAuth);
      }

      await page.goto(project.url, { waitUntil: 'networkidle2', timeout: 60000 });
      // Consent banners are hidden, not accepted — accepting would be
      // consenting on someone else's behalf.
      await page.addStyleTag({ content: HIDE_CONSENT_CSS });
      await new Promise((r) => setTimeout(r, 2500));

      fs.writeFileSync(path.join(OUT_DIR, `shot-${project.slug}.png`), await page.screenshot({ type: 'png' }));
      console.log(`  ${project.slug}`);
    } catch (err) {
      console.warn(`  ! ${project.slug}: ${err.message.split('\n')[0]}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Downloading company logo and team photos...');
  const companyLogoFile = 'company-logo.svg';
  await download(ROLE.companyLogoUrl, companyLogoFile).catch((e) => console.warn(`  ! logo: ${e.message}`));

  const members = [];
  for (const member of TEAM) {
    const filename = `member-${slugify(member.name)}.webp`;
    try {
      await download(member.photo, filename);
      members.push({ name: member.name, role: member.role, file: filename });
      console.log(`  ${member.name}`);
    } catch (err) {
      console.warn(`  ! ${member.name}: ${err.message}`);
      members.push({ name: member.name, role: member.role, file: null });
    }
  }

  console.log('\nDownloading skill logos...');
  const skills = [];
  for (const skill of SKILLS_TO_ADD) {
    if (!skill.url) {
      skills.push({ name: skill.name, file: null });
      console.log(`  ${skill.name} (no logo, initials)`);
      continue;
    }
    const filename = `skill-${skill.file}`;
    try {
      await download(skill.url, filename);
      skills.push({ name: skill.name, file: filename });
      console.log(`  ${skill.name}`);
    } catch (err) {
      console.warn(`  ! ${skill.name}: ${err.message}`);
      skills.push({ name: skill.name, file: null });
    }
  }

  await captureScreenshots();

  const results = PROJECTS.map((project) => {
    const file = `shot-${project.slug}.png`;
    return {
      slug: project.slug,
      title: project.title,
      description: `${project.description} ${project.url}`,
      file: fs.existsSync(path.join(OUT_DIR, file)) ? file : null,
    };
  });

  const manifest = {
    role: {
      year: ROLE.year,
      name: ROLE.name,
      company: ROLE.company,
      desc: ROLE.desc,
      startDate: ROLE.startDate,
      endDate: ROLE.endDate,
      tags: ROLE.tags,
      companyLogoFile: fs.existsSync(path.join(OUT_DIR, companyLogoFile)) ? companyLogoFile : null,
    },
    projectDetails: {
      title: PROJECT_DETAILS.title,
      description: PROJECT_DETAILS.description,
      role: PROJECT_DETAILS.role,
      startDate: PROJECT_DETAILS.startDate,
      endDate: PROJECT_DETAILS.endDate,
      technologies: PROJECT_DETAILS.technologies,
    },
    skills,
    members,
    results,
  };

  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

  const missingShots = results.filter((r) => !r.file);
  console.log(`\nmanifest.json written. ${results.length - missingShots.length}/${results.length} screenshots ready.`);
  if (missingShots.length) console.log(`  missing: ${missingShots.map((r) => r.slug).join(', ')}`);

  // Permissive CORS so the Studio origin can read these. Local only, and only
  // while this process is running.
  http.createServer((req, res) => {
    const name = path.basename(decodeURIComponent(req.url.split('?')[0]));
    const file = path.join(OUT_DIR, name);

    res.setHeader('Access-Control-Allow-Origin', '*');

    if (!name || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404).end('not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': CONTENT_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  }).listen(PORT, '127.0.0.1', () => {
    console.log(`\nServing ${OUT_DIR}\n  http://127.0.0.1:${PORT}/manifest.json`);
    console.log('Leave this running, then stop it with Ctrl+C when the import is done.');
  });
}

main().catch((err) => {
  console.error(`\nFailed: ${err.message}`);
  process.exit(1);
});
