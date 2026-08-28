export default {
  name: 'contact',
  title: 'Contact messages',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 6,
    },
    {
      // Set by the Netlify contact function so messages can be sorted by date.
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
    },
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'email' },
  },
};
