import {defineType} from 'sanity'

export default defineType({
  title: 'User',
  name: 'user',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(3).max(50).warning('Name should be between 3 and 50 characters'),
    },
    {
      title: 'Email',
      name: 'email',
      type: 'string',
      validation: (Rule) => Rule.required().email().error('Please enter a valid email address'),
    },
    {
      title: 'Mobile',
      name: 'mobile',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .regex(/^[0-9]{10}$/, {name: 'Mobile Number', invert: false})
          .error('Mobile number must be 10 digits'),
    },
    {
      title: 'Password',
      name: 'password',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(4).max(50).error('Password must be between 8 and 50 characters'),
    },
  ],
})
