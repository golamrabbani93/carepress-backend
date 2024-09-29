import { z } from 'zod'

export const RegisterValidatioonSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).trim(),

    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Please fill a valid email address' })
      .trim(),

    password: z
      .string({
        invalid_type_error: 'Password must be String',
        required_error: 'Password is required',
      })
      .min(4, { message: 'Password must be 4 characters or more' }),
  }),
})
export const LoginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        invalid_type_error: 'Email must be string',
        required_error: 'Email is required',
      })
      .email({ message: 'Email is required And Email must be string' }),
    password: z.string({
      invalid_type_error: 'Password must be String',
      required_error: 'Password is required',
    }),
  }),
})

export const authValidationSchemas = {
  RegisterValidatioonSchema,
  LoginValidationSchema,
}
