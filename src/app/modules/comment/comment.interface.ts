import mongoose from 'mongoose'

export interface IComment {
  post: mongoose.Types.ObjectId
  author: mongoose.Types.ObjectId
  content: string
  createdAt: Date
  replies?: IComment[]
}
