import mongoose from 'mongoose'

export interface IPost {
  title: string
  content: string
  images: string[]
  author: mongoose.Types.ObjectId
  upvotes: number
  downvotes: number
  category: 'Tip' | 'Story'
  comments: mongoose.Types.ObjectId[]
  isPremium: boolean
  premiumPrice: number
  createdAt?: Date
  updatedAt?: Date
}
