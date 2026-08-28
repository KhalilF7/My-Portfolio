export default {
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    {
      name: 'degree',
      title: 'Degree',
      description: 'e.g. Master of Engineering in Computer Science',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'school',
      title: 'School / University',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'startYear',
      title: 'Start year',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1950).max(2100),
    },
    {
      name: 'endYear',
      title: 'End year',
      description: 'Leave empty if still ongoing.',
      type: 'number',
      validation: (Rule) => Rule.integer().min(1950).max(2100),
    },
    {
      name: 'description',
      title: 'Description',
      description: 'Optional. Specialisation, thesis topic, honours.',
      type: 'text',
      rows: 3,
    },
    {
      name: 'logo',
      title: 'School logo',
      type: 'image',
      options: { hotspot: true },
    },
  ],
  // Newest qualification first in the Studio list.
  orderings: [
    {
      title: 'End year, newest first',
      name: 'endYearDesc',
      by: [{ field: 'endYear', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'degree', subtitle: 'school', media: 'logo' },
  },
};
