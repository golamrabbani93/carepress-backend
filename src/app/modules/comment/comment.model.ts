import mongoose from 'mongoose'
import { IComment } from './comment.interface'

const CommentSchema = new mongoose.Schema<IComment>(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },

    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // This allows replies to be sub-documents of the comment model
      },
    ],
  },
  { timestamps: true },
)

export const Comment = mongoose.model('Comment', CommentSchema)
