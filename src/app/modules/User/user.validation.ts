import { z } from 'zod'
import { Role } from './user.constant'

export const UserUpdateValidatioonSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Name must be string',
        required_error: 'Name is required',
      })
      .min(1)
      .optional(),
    email: z
      .string({
        invalid_type_error: 'Email must be string',
        required_error: 'Email is required',
      })
      .email({ message: 'Email is required And Email must be string' })
      .optional(),
    password: z
      .string({
        invalid_type_error: 'Password must be String',
        required_error: 'Password is required',
      })
      .min(4, { message: 'Password must be 4 charecter or more ' })
      .optional(),
    phone: z
      .string({
        invalid_type_error: 'Phone Number must be String',
        required_error: 'Phone Number is required',
      })
      .optional(),
    address: z
      .string({
        invalid_type_error: 'Address must be String',
        required_error: 'Address is required',
      })
      .optional(),
    role: z
      .enum([...Role] as [string, ...string[]], {
        invalid_type_error: 'Role must be String',
        required_error: 'Role is required',
      })
      .optional(),
  }),
})
export const userValidation = {
  UserUpdateValidatioonSchema,
}
