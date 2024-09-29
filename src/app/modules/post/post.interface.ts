import mongoose from 'mongoose'

export interface IComment {
  author: string
  content: string
  createdAt: Date
  replies?: IComment[]
}

export interface IPost {
  title: string
  content: string
  images: string[]
  author: mongoose.Types.ObjectId
  upvotes: number
  downvotes: number
  category: 'Tip' | 'Story'
  comments: IComment[]
  isPremium: boolean
  premiumPrice: number
  createdAt?: Date
  updatedAt?: Date
}
