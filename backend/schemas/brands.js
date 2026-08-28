export default {
  name: 'brands',
  title: 'Companies',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Company name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'imgUrl',
      title: 'Company logo',
      type: 'image',
      options: { hotspot: true },
    },
  ],
  preview: {
    select: { title: 'name', media: 'imgUrl' },
  },
};
