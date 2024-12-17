import {defineType} from 'sanity'

export default defineType({
  name: 'ticket',
  title: 'Ticket',
  type: 'document',
  fields: [
    {
      name: 'transactionId',
      title: 'Transaction ID',
      type: 'string',
      description: 'The unique ID of the payment transaction',
    },
    {
      name: 'userEmail',
      title: 'User Email',
      type: 'string',
      description: 'Email of the user who made the purchase',
    },
    {
      name: 'selectedSeats',
      title: 'Selected Seats',
      type: 'array',
      of: [
        defineType({
          name: 'seat',
          title: 'Seat',
          type: 'object',
          fields: [
            {
              name: 'row',
              title: 'Row',
              type: 'string',
            },
            {
              name: 'seat',
              title: 'Seat Number',
              type: 'string',
            },
          ],
        }),
      ],
      description: 'List of seats the user selected for the movie',
    },
    {
      name: 'movieName',
      title: 'Movie Name',
      type: 'string',
      description: 'The movie name',
    },
    {
      name: 'mall',
      title: 'Mall Name',
      type: 'string',
      description: 'The mall where the movie is being shown',
    },
    {
      name: 'showtime',
      title: 'Showtime',
      type: 'string',
      description: 'The showtime for the movie',
    },
    {
      name: 'date',
      title: 'Show Date',
      type: 'string',
      description: 'The date of the movie show',
    },
    {
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
      description: 'The total amount paid for the tickets and food',
    },
    {
      name: 'createdAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      description: 'The date when the ticket was added',
    },
  ],
})
