// *create post in database

import QueryBuilder from '../../builder/queryBuilder'
import { PostSearchableFields } from './post.constant'
import { IPost } from './post.interface'
import { Post } from './post.model'

const createPostIntoDatabase = async (payload: IPost) => {
  const result = await Post.create(payload)
  return result
}

const getAllPostsFromDatabase = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post.find(), query)
    .filter()
    .search(PostSearchableFields)
    .sort()
    .fields()
    .populate('author')

  const result = await postQuery.modelQuery
  return result
}

const updatePostIntoDatabase = async (postId: string, payload: IPost) => {
  const result = await Post.findByIdAndUpdate(postId, payload, { new: true })
  return result
}

const deletePostFromDatabase = async (postId: string) => {
  const result = await Post.findByIdAndDelete(postId)
  return result
}

export const postServices = {
  createPostIntoDatabase,
  getAllPostsFromDatabase,
  updatePostIntoDatabase,
  deletePostFromDatabase,
}
