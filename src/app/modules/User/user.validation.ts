import { z } from 'zod'
import mongoose from 'mongoose'

export const UserUpdateValidatioonSchema = z.object({
  body: z.object({
    _id: z.instanceof(mongoose.Types.ObjectId).optional(), // _id is optional

    name: z
      .string({
        invalid_type_error: 'Name must be a string',
        required_error: 'Name is required',
      })
      .min(1, { message: 'Name must not be empty' }) // Ensure name is not empty

      .optional(),

    email: z
      .string({
        invalid_type_error: 'Email must be a string',
        required_error: 'Email is required',
      })
      .email({ message: 'Email must be a valid email address' }) // Validate email format

      .optional(),

    password: z
      .string({
        invalid_type_error: 'Password must be a string',
        required_error: 'Password is required',
      })
      .min(4, { message: 'Password must be at least 4 characters long' }) // Minimum length for password

      .optional(),

    profilePicture: z
      .string({
        invalid_type_error: 'Profile picture must be a string',
      })
      .optional(),

    phone: z
      .string({
        invalid_type_error: 'Phone number must be a string',
      })
      .optional(),
  }),
})
export const userValidation = {
  UserUpdateValidatioonSchema,
}
