import mongoose from 'mongoose'

export interface IPost {
  title: string
  content: string
  images: string[]
  author: mongoose.Types.ObjectId
  upvotes?: mongoose.Types.ObjectId[]
  downvotes?: mongoose.Types.ObjectId[]
  category: 'Tip' | 'Story'
  comments: mongoose.Types.ObjectId[]
  isPremium: boolean
  status: boolean
  premiumPrice: number
  createdAt?: Date
  updatedAt?: Date
}
