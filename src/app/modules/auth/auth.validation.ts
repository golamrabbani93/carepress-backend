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

//*forget password schema
const ForgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      invalid_type_error: 'Email must be string',
      required_error: 'Email is required',
    }),
  }),
})
//*Reset password schema
const ResetPasswordValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      invalid_type_error: 'userId must be string',
      required_error: 'userId is required',
    }),
    newPassword: z.string({
      invalid_type_error: 'New Password  must be string',
      required_error: 'New Password  is required',
    }),
  }),
})

export const authValidationSchemas = {
  RegisterValidatioonSchema,
  LoginValidationSchema,
  ForgetPasswordValidationSchema,
  ResetPasswordValidationSchema,
}
