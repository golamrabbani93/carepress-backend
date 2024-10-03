import { z } from 'zod'

//* Zod schema for Comment
export const CommentValidationSchema = z.object({
  author: z.string({
    required_error: 'Author ID is required',
    invalid_type_error: 'Author ID must be a string',
  }),
  content: z.string({
    required_error: 'Content is required',
    invalid_type_error: 'Content must be a string',
  }),
  createdAt: z.date().optional(), // Date validation for comment creation
  replies: z
    .array(z.lazy((): z.ZodTypeAny => CommentValidationSchema))
    .optional(),
})

// Zod schema for Post
export const PostValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    }),

    images: z
      .array(
        z.string().url({
          message: 'Each image must be a valid URL',
        }),
      )
      .optional(), // Array of valid image URLs
    author: z.string({
      required_error: 'Author ID is required',
      invalid_type_error: 'Author ID must be a string',
    }),

    category: z.enum(['Tip', 'Story'], {
      required_error: 'Category is required',
      invalid_type_error: 'Category must be either "Tip" or "Story"',
    }),
    comments: z.array(CommentValidationSchema).optional(), // Array of comments
    isPremium: z.boolean().default(false), // Boolean flag for premium content
    premiumPrice: z
      .number()
      .nonnegative({
        message: 'Premium price must be a non-negative number',
      })
      .default(0),
    createdAt: z.date().optional(), // Optional creation date
    updatedAt: z.date().optional(), // Optional last update date
  }),
})

// Zod schema for Comment
export const UpdateCommentValidationSchema = z.object({
  author: z
    .string({
      required_error: 'Author ID is required',
      invalid_type_error: 'Author ID must be a string',
    })
    .optional(),
  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .optional(),
  createdAt: z.date().optional(), // Optional date field
  replies: z
    .array(z.lazy((): z.ZodTypeAny => CommentValidationSchema))
    .optional(), // Optional array of replies
})

// Zod schema for Post
export const UpdatePostValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string',
      })
      .optional(),
    content: z
      .string({
        required_error: 'Content is required',
        invalid_type_error: 'Content must be a string',
      })
      .optional(),
    images: z
      .array(
        z.string().url({
          message: 'Each image must be a valid URL',
        }),
      )
      .optional(), // Optional array of image URLs
    author: z
      .string({
        required_error: 'Author ID is required',
        invalid_type_error: 'Author ID must be a string',
      })
      .optional(),
    upvotes: z
      .number()
      .int()
      .nonnegative({
        message: 'Upvotes must be a non-negative integer',
      })
      .default(0)
      .optional(),
    downvotes: z
      .number()
      .int()
      .nonnegative({
        message: 'Downvotes must be a non-negative integer',
      })
      .default(0)
      .optional(),
    category: z
      .enum(['Tip', 'Story'], {
        required_error: 'Category is required',
        invalid_type_error: 'Category must be either "Tip" or "Story"',
      })
      .optional(),
    comments: z.array(CommentValidationSchema).optional(), // Optional array of comments
    isPremium: z.boolean().default(false).optional(), // Optional premium flag
    premiumPrice: z
      .number()
      .nonnegative({
        message: 'Premium price must be a non-negative number',
      })
      .default(0)
      .optional(),
    createdAt: z.date().optional(), // Optional creation date
    updatedAt: z.date().optional(), // Optional last update date
  }),
})

export const postValidation = {
  PostValidationSchema,
  CommentValidationSchema,
  UpdatePostValidationSchema,
}
