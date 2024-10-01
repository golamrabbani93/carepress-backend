import { z } from 'zod'

// Zod validation schema for Comment
export const CommentValidationSchema = z.object({
  body: z.object({
    post: z.string({
      required_error: 'Post is required',
      invalid_type_error: 'Post must be a string',
    }),
    author: z.string({
      required_error: 'Author is required',
      invalid_type_error: 'Author must be a string',
    }),
    content: z.string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    }),
    replies: z
      .array(
        z.lazy((): z.ZodTypeAny => CommentValidationSchema), // Recursive validation for nested replies
      )
      .optional(),
  }),
})

const UpdateCommentValidationSchema = z.object({
  body: z.object({
    post: z
      .string({
        required_error: 'Author is required',
        invalid_type_error: 'Author must be a string',
      })
      .optional(),
    author: z
      .string({
        required_error: 'Author is required',
        invalid_type_error: 'Author must be a string',
      })
      .optional(),
    content: z
      .string({
        required_error: 'Content is required',
        invalid_type_error: 'Content must be a string',
      })
      .optional(),
    replies: z
      .array(
        z.lazy((): z.ZodTypeAny => CommentValidationSchema), // Recursive validation for nested replies
      )
      .optional(),
  }),
})

export const CommentValidations = {
  CommentValidationSchema,
  UpdateCommentValidationSchema,
}
