import mongoose, { model, Schema } from 'mongoose'
import { IPost } from './post.interface'

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    category: { type: String, enum: ['Tip', 'Story'], required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    isPremium: { type: Boolean, default: false },
    premiumPrice: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// * Create User Model
export const Post = model<IPost>('Post', PostSchema)
