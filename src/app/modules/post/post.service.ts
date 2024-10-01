// *create post in database

import httpStatus from 'http-status'
import QueryBuilder from '../../builder/queryBuilder'
import AppError from '../../errors/AppError'
import { User } from '../User/user.model'
import { PostSearchableFields } from './post.constant'
import { IPost } from './post.interface'
import { Post } from './post.model'
import { TUser } from '../User/user.interface'
import { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'

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
    .paginate()
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

const upadteUpVoteIntoDB = async (postId: string, payload: JwtPayload) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    // find user
    const exitsedUser = await User.findById(payload._id)

    if (!exitsedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    // find post
    const post = await Post.findById(postId)

    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
    }

    // check if user already upvoted
    const isUpvoted = post?.upvotes?.find((upvote) => {
      return upvote.toString() === exitsedUser._id.toString()
    })

    if (isUpvoted) {
      //Remove upvote
      const newUpVote = post?.upvotes?.filter(
        (upvote) => upvote.toString() != exitsedUser._id.toString(),
      )
      const updatePostVotes = await Post.findByIdAndUpdate(
        postId,
        {
          upvotes: newUpVote,
        },
        { new: true },
      )

      if (!updatePostVotes) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
      }

      const postAuthor = post?.author as unknown as TUser

      await User.findByIdAndUpdate(
        postAuthor._id,
        {
          upvotes: (postAuthor?.upvotes as number) - 1 || 0,
        },
        { new: true },
      )
      const result = await Post.findById(postId)
        .populate('author')
        .populate('upvotes')
      await session.commitTransaction()
      await session.endSession()
      return result
    } else {
      const newUpVote = [...(post?.upvotes || []), exitsedUser._id]

      const updatePostVotes = await Post.findByIdAndUpdate(
        postId,
        {
          upvotes: newUpVote,
        },
        { new: true },
      )

      if (!updatePostVotes) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
      }

      const postAuthor = post?.author as unknown as TUser

      await User.findByIdAndUpdate(
        postAuthor._id,
        {
          upvotes: (postAuthor?.upvotes as number) + 1 || 1,
        },
        { new: true },
      )
      const result = await Post.findById(postId)
        .populate('author')
        .populate('upvotes')
      await session.commitTransaction()
      await session.endSession()
      return result
    }
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
  }
}

export const postServices = {
  createPostIntoDatabase,
  getAllPostsFromDatabase,
  updatePostIntoDatabase,
  deletePostFromDatabase,
  upadteUpVoteIntoDB,
}
