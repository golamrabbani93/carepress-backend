import { z } from 'zod'

// Zod validation schema for Comment
export const PaymentValidationSchema = z.object({
  body: z.object({
    paymentId: z.string({
      required_error: 'Payment Id is required',
      invalid_type_error: 'Payment Id must be a string',
    }),
    userId: z.string({
      required_error: 'User Id is required',
      invalid_type_error: 'User Id must be a string',
    }),
    amount: z.number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    }),
  }),
})
