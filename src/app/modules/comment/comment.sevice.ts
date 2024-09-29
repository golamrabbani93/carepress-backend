import QueryBuilder from '../../builder/queryBuilder'

import { IComment } from './comment.interface'
import { Comment } from './comment.model'
import { Post } from '../post/post.model' // Import the Post model
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import mongoose from 'mongoose'

const createCommentIntoDatabase = async (payload: IComment) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    //* Check if the post exists
    const post = await Post.findById(payload.post) // Use the Post model to find the post
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
    }
    //* Update the post with the new comment
    const updatedComments = [...post.comments, payload.author]

    const UpdatedPost = await Post.findByIdAndUpdate(payload.post, {
      comments: updatedComments,
    })
    if (!UpdatedPost?._id) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Comment not created')
    }
    //* Create the comment
    const result = await Comment.create(payload)
    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Comment not created')
  }
}
const getAllCommentsFromDatabase = async (query: Record<string, unknown>) => {
  const commentQuery = new QueryBuilder(Comment.find(), query)
    .filter()
    // .search(CommentSearchableFields)
    .sort()
    .fields()
    .populate('post')
    .populate('author')

  const result = await commentQuery.modelQuery
  return result
}

const updateCommentIntoDatabase = async (
  commentId: string,
  payload: IComment,
) => {
  const result = await Comment.findByIdAndUpdate(
    commentId,
    {
      content: payload.content,
    },
    {
      new: true,
    },
  )
  return result
}

const deleteCommentFromDatabase = async (commentId: string) => {
  const result = await Comment.findByIdAndDelete(commentId)
  return result
}
export const commentServices = {
  createCommentIntoDatabase,
  getAllCommentsFromDatabase,
  updateCommentIntoDatabase,
  deleteCommentFromDatabase,
}
