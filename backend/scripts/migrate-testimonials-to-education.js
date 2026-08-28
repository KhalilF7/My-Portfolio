/**
 * One-off migration: `testimonials` documents -> `education` documents.
 *
 * The old `testimonials` type was being used to hold education entries, with the
 * years packed into a free-text `feedback` field like "2020-2023". This copies
 * each one into the new `education` type with real fields.
 *
 * Run it once, from the backend folder:
 *
 *   SANITY_PROJECT_ID=xxxx SANITY_WRITE_TOKEN=sk... node scripts/migrate-testimonials-to-education.js
 *
 * Add --delete to remove the old testimonials documents once you have checked
 * the result in the Studio. Without it, nothing is deleted.
 *
 * The token is read from the environment and is never written to a file.
 */
const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_WRITE_TOKEN;
const dataset = process.env.SANITY_DATASET || 'production';
const shouldDelete = process.argv.includes('--delete');

if (!projectId || !token) {
  console.error('Set SANITY_PROJECT_ID and SANITY_WRITE_TOKEN before running this.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2022-12-11', useCdn: false });

/** "2020-2023" -> { startYear: 2020, endYear: 2023 } */
function parseYears(feedback) {
  const years = String(feedback || '').match(/\d{4}/g) || [];
  return {
    startYear: years[0] ? Number(years[0]) : undefined,
    endYear: years[1] ? Number(years[1]) : undefined,
  };
}

(async () => {
  const olds = await client.fetch('*[_type == "testimonials"]');
  if (!olds.length) {
    console.log('No testimonials documents found — nothing to migrate.');
    return;
  }

  console.log(`Found ${olds.length} document(s) to migrate.\n`);

  for (const old of olds) {
    const { startYear, endYear } = parseYears(old.feedback);
    const doc = {
      _type: 'education',
      degree: old.name,
      school: old.company,
      ...(startYear && { startYear }),
      ...(endYear && { endYear }),
      ...(old.imageurl && { logo: old.imageurl }),
    };

    const created = await client.create(doc);
    console.log(`  created education "${created.degree}" (${created._id})`);

    if (shouldDelete) {
      await client.delete(old._id);
      console.log(`  deleted old testimonial ${old._id}`);
    }
  }

  console.log('\nDone.');
  if (!shouldDelete) {
    console.log('Old testimonials were kept. Re-run with --delete once you have verified the Studio.');
  }
})().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
