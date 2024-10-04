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

//* get My post from database
const getMyPostsFromDatabase = async (payload: JwtPayload) => {
  const result = await Post.find({ author: payload._id })
    .populate('author')
    .populate('upvotes')
    .populate('downvotes')
    .populate({
      path: 'comments',
      populate: { path: 'author' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

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
    .populate('upvotes')
    .populate('downvotes')
    .populate({
      path: 'comments',
      populate: { path: 'author' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

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

// const upadteUpVoteIntoDB = async (postId: string, payload: JwtPayload) => {
//   const session = await mongoose.startSession()

//   try {
//     session.startTransaction()
//     // find user
//     const exitsedUser = await User.findById(payload._id)

//     if (!exitsedUser) {
//       throw new AppError(httpStatus.NOT_FOUND, 'User not found')
//     }

//     // find post
//     const post = await Post.findById(postId)

//     if (!post) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
//     }

//     //* check if user already Downvoted

//     const isDownvoted = post?.downvotes?.find((upvote) => {
//       return upvote.toString() === exitsedUser._id.toString()
//     })

//     if (isDownvoted) {
//       //Remove downvote
//       const newUpVote = post?.downvotes?.filter(
//         (upvote) => upvote.toString() !== exitsedUser._id.toString(),
//       )
//       const updatePostVotes = await Post.findByIdAndUpdate(
//         postId,
//         {
//           downvotes: newUpVote,
//           totalDownvotes: (post?.totalDownvotes as number) - 1,
//         },
//         { new: true },
//       )

//       if (!updatePostVotes) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
//       }

//       const postAuthor = post?.author as unknown as TUser

//       const updateNewvote = await User.findByIdAndUpdate(
//         postAuthor._id,
//         {
//           downvotes: (postAuthor?.downvotes as number) - 1,
//         },
//         { new: true },
//       )
//       if (!updateNewvote) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
//       }
//     }

//     // check if user already upvoted
//     const isUpvoted = post?.upvotes?.find((upvote) => {
//       return upvote.toString() === exitsedUser._id.toString()
//     })

//     if (isUpvoted) {
//       //Remove upvote
//       const newUpVote = post?.upvotes?.filter(
//         (upvote) => upvote.toString() != exitsedUser._id.toString(),
//       )
//       const updatePostVotes = await Post.findByIdAndUpdate(
//         postId,
//         {
//           upvotes: newUpVote,
//           totalUpvotes: (post?.totalUpvotes as number) - 1,
//         },
//         { new: true },
//       )

//       if (!updatePostVotes) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
//       }

//       const postAuthor = post?.author as unknown as TUser

//       await User.findByIdAndUpdate(
//         postAuthor._id,
//         {
//           upvotes: (postAuthor?.upvotes as number) - 1,
//         },
//         { new: true },
//       )
//       const result = await Post.findById(postId)
//         .populate('author')
//         .populate('upvotes')
//       await session.commitTransaction()
//       await session.endSession()
//       return result
//     } else {
//       const newUpVote = [...(post?.upvotes || []), exitsedUser._id]

//       const updatePostVotes = await Post.findByIdAndUpdate(
//         postId,
//         {
//           upvotes: newUpVote,
//           totalUpvotes: (post?.totalUpvotes as number) + 1,
//         },
//         { new: true },
//       )

//       if (!updatePostVotes) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
//       }

//       const postAuthor = post?.author as unknown as TUser

//       await User.findByIdAndUpdate(
//         postAuthor._id,
//         {
//           upvotes: (postAuthor?.upvotes as number) + 1,
//         },
//         { new: true },
//       )
//       const result = await Post.findById(postId)
//         .populate('author')
//         .populate('upvotes')
//       await session.commitTransaction()
//       await session.endSession()
//       return result
//     }
//   } catch (error) {
//     await session.abortTransaction()
//     await session.endSession()
//     throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
//   }
// }
const updateUpVoteIntoDB = async (postId: string, payload: JwtPayload) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    // Find user
    const existingUser = await User.findById(payload._id).session(session)
    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    // Find post
    const post = await Post.findById(postId).session(session)
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
    }
    const postAuthor = post?.author as unknown as TUser

    // Check if user already downvoted
    const isDownvoted = (post.downvotes ?? []).includes(existingUser._id)

    if (isDownvoted) {
      // Remove downvote
      if (post.downvotes) {
        post.downvotes = (post.downvotes ?? []).filter(
          (id) => !id.equals(existingUser._id),
        )
      }
      post.totalDownvotes = (post.totalDownvotes || 0) - 1

      await post.save({ session }) // Save the updated post
      await User.findByIdAndUpdate(
        postAuthor._id,
        { $inc: { downvotes: -1 } },
        { session },
      )
    }

    // Check if user already upvoted
    const isUpvoted = (post.upvotes ?? []).includes(existingUser._id)

    if (isUpvoted) {
      // Remove upvote
      if (post.upvotes) {
        post.upvotes = (post.upvotes ?? []).filter(
          (id) => !id.equals(existingUser._id),
        )
      }
      post.totalUpvotes = (post.totalUpvotes ?? 0) - 1

      await post.save({ session }) // Save the updated post
      await User.findByIdAndUpdate(
        postAuthor._id,
        { $inc: { upvotes: -1 } },
        { session },
      )
    } else {
      // Add upvote
      if (!post.upvotes) {
        post.upvotes = []
      }
      post.upvotes.push(existingUser._id)
      post.totalUpvotes = (post.totalUpvotes || 0) + 1

      await post.save({ session }) // Save the updated post
      await User.findByIdAndUpdate(
        postAuthor._id,
        { upvotes: (postAuthor.upvotes || 0) + 1 },
        { session },
      )
    }

    // Commit the transaction
    await session.commitTransaction()
    await session.endSession()

    // Populate and return the updated post
    return await Post.findById(postId)
      .populate('author')
      .populate('upvotes')
      .exec()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
  }
}

// const updateDownVoteIntoDB = async (postId: string, payload: JwtPayload) => {
//   const session = await mongoose.startSession()
//   try {
//     session.startTransaction()
//     // find user
//     const exitsedUser = await User.findById(payload._id)

//     if (!exitsedUser) {
//       throw new AppError(httpStatus.NOT_FOUND, 'User not found')
//     }

//     // find post
//     const post = await Post.findById(postId)

//     if (!post) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
//     }
//     // check if user already upvoted
//     const isUpvoted = post?.upvotes?.find((upvote) => {
//       return upvote.toString() === exitsedUser._id.toString()
//     })

//     if (isUpvoted) {
//       //Remove upvote
//       const newUpVote = post?.upvotes?.filter(
//         (upvote) => upvote.toString() !== exitsedUser._id.toString(),
//       )
//       const updatePostVotes = await Post.findByIdAndUpdate(
//         postId,
//         {
//           upvotes: newUpVote,
//           totalUpvotes: (post?.totalUpvotes as number) - 1,
//         },
//         { new: true },
//       )

//       if (!updatePostVotes) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
//       }

//       const postAuthor = post?.author as unknown as TUser

//       const updateNewvote = await User.findByIdAndUpdate(
//         postAuthor._id,
//         {
//           upvotes: (postAuthor?.upvotes as number) - 1,
//         },
//         { new: true },
//       )
//       if (!updateNewvote) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
//       }
//     }

//     // check if user already Downvoted
//     const isDownvotesUpvoted = post?.downvotes?.find((upvote) => {
//       return upvote.toString() === exitsedUser._id.toString()
//     })

//     if (isDownvotesUpvoted) {
//       //Remove Downvote
//       const newDownVote = post?.downvotes?.filter(
//         (downvote) => downvote.toString() != exitsedUser._id.toString(),
//       )
//       const updatePostVotes = await Post.findByIdAndUpdate(
//         postId,
//         {
//           downvotes: newDownVote,
//           totalDownvotes: (post?.totalDownvotes as number) - 1,
//         },
//         { new: true },
//       )

//       if (!updatePostVotes) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'DownVote not updated')
//       }

//       const postAuthor = post?.author as unknown as TUser

//       await User.findByIdAndUpdate(
//         postAuthor._id,
//         {
//           downvotes: (postAuthor?.downvotes as number) - 1,
//         },
//         { new: true },
//       )
//       const result = await Post.findById(postId)
//         .populate('author')
//         .populate('upvotes')
//       await session.commitTransaction()
//       await session.endSession()
//       return result
//     } else {
//       const newDownvote = [...(post?.downvotes || []), exitsedUser._id]

//       const updatePostVotes = await Post.findByIdAndUpdate(
//         postId,
//         {
//           downvotes: newDownvote,
//           totalDownvotes: (post?.totalDownvotes as number) + 1,
//         },
//         { new: true },
//       )

//       if (!updatePostVotes) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
//       }

//       const postAuthor = post?.author as unknown as TUser

//       await User.findByIdAndUpdate(
//         postAuthor._id,
//         {
//           downvotes: (postAuthor?.downvotes as number) + 1,
//         },
//         { new: true },
//       )
//       const result = await Post.findById(postId)
//         .populate('author')
//         .populate('upvotes')
//         .populate('downvotes')
//       await session.commitTransaction()
//       await session.endSession()
//       return result
//     }
//   } catch (error) {
//     await session.abortTransaction()
//     await session.endSession()
//     throw new AppError(httpStatus.BAD_REQUEST, 'Upvote not updated')
//   }
// }
const updateDownVoteIntoDB = async (postId: string, payload: JwtPayload) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    // Find user
    const existingUser = await User.findById(payload._id).session(session)
    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    // Find post
    const post = await Post.findById(postId).session(session)
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
    }
    const postAuthor = post?.author as unknown as TUser

    // Check if user already upvoted
    const isUpvoted = (post.upvotes ?? []).includes(existingUser._id)
    if (isUpvoted) {
      // Remove upvote
      post.upvotes = (post.upvotes ?? []).filter(
        (id) => !id.equals(existingUser._id),
      )
      post.totalUpvotes = (post.totalUpvotes || 0) - 1

      await post.save({ session }) // Save the updated post
      await User.findByIdAndUpdate(
        postAuthor._id,
        { $inc: { upvotes: -1 } },
        { session },
      )
    }

    // Check if user already downvoted
    const isDownvoted = (post.downvotes ?? []).includes(existingUser._id)
    if (isDownvoted) {
      // Remove downvote
      post.downvotes = (post.downvotes ?? []).filter(
        (id) => !id.equals(existingUser._id),
      )
      post.totalDownvotes = (post.totalDownvotes || 0) - 1

      await post.save({ session }) // Save the updated post
      await User.findByIdAndUpdate(
        postAuthor._id,
        { $inc: { downvotes: -1 } },
        { session },
      )
    } else {
      // Add downvote
      post.downvotes = [...(post.downvotes || []), existingUser._id]
      post.totalDownvotes = (post.totalDownvotes || 0) + 1

      await post.save({ session }) // Save the updated post
      await User.findByIdAndUpdate(
        postAuthor._id,
        { $inc: { downvotes: +1 } },
        { session },
      )
    }

    // Commit the transaction
    await session.commitTransaction()
    return await Post.findById(postId)
      .populate('author')
      .populate('downvotes')
      .exec()
  } catch (error) {
    await session.abortTransaction()
    throw new AppError(httpStatus.BAD_REQUEST, 'Downvote not updated')
  } finally {
    await session.endSession()
  }
}

const togglePostStatusIntoDB = async (postId: string) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
  }
  const status = post.status ? false : true
  const result = await Post.findByIdAndUpdate(postId, { status }, { new: true })
  return result
}

//*get single post

const getSinglePostFromDatabase = async (postId: string) => {
  const result = await Post.findById(postId)
    .populate('author')
    .populate('upvotes')
    .populate('downvotes')
    .populate({ path: 'comments', populate: { path: 'author' } })
  return result
}

export const postServices = {
  createPostIntoDatabase,
  getMyPostsFromDatabase,
  getAllPostsFromDatabase,
  updatePostIntoDatabase,
  deletePostFromDatabase,
  updateUpVoteIntoDB,
  updateDownVoteIntoDB,
  togglePostStatusIntoDB,
  getSinglePostFromDatabase,
}
