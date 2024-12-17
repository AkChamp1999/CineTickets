import {defineType} from 'sanity'

export default defineType({
  name: 'movie',
  title: 'Movie',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'poster_path',
      type: 'string',
    },
    {
      name: 'overview',
      type: 'string',
    },
    {
      name: 'original_language',
      type: 'string',
    },
    {
      name: 'createdAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      description: 'The date when the movie was added',
    },
  ],
})
