/**
 * DEPRECATED — kept so the existing documents stay visible and editable in the
 * Studio.
 *
 * This type was being used to store education entries, with the years packed
 * into the free-text `feedback` field as "2020-2023". The `education` type
 * replaces it with real fields.
 *
 * Nothing here is deleted automatically. The site reads `education` first and
 * falls back to these documents, so both work. Once you have run
 * scripts/migrate-testimonials-to-education.js and checked the result, you can
 * delete these documents and remove this file.
 */
export default {
  name: 'testimonials',
  title: 'Education (old format — deprecated)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Degree',
      description: 'Migrates to the "degree" field on Education.',
      type: 'string',
    },
    {
      name: 'company',
      title: 'School',
      description: 'Migrates to the "school" field on Education.',
      type: 'string',
    },
    {
      name: 'imageurl',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'feedback',
      title: 'Years',
      description: 'Free text such as "2020-2023". Becomes startYear / endYear on Education.',
      type: 'string',
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'company', media: 'imageurl' },
  },
};
