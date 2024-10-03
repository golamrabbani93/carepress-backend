import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { TImageFile } from '../../interface/image.interface'
import { postServices } from './post.service'

// * create post in database
const createPost = catchAsync(async (req: Request, res: Response) => {
  const { images } = req?.files as unknown as { images: TImageFile[] }

  const postData = req.body
  const newPostData = {
    ...postData,
    images: images?.map((image: TImageFile) => image.path),
  }
  const result = await postServices.createPostIntoDatabase(newPostData)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Post Created successfully',
    data: result,
  })
})
// * get all posts from database
const getMyPosts = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const result = await postServices.getMyPostsFromDatabase(user)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'MY Posts fetched successfully',
    data: result,
  })
})

// * get all posts from database
const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
  const result = await postServices.getAllPostsFromDatabase(query)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All Posts fetched successfully',
    data: result,
  })
})
// * update post in database
const updatePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id
  const { images } = req?.files as unknown as { images: TImageFile[] }
  const postData = req.body
  const newPostData = {
    ...postData,
    images: images?.map((image: TImageFile) => image.path),
  }
  const result = await postServices.updatePostIntoDatabase(postId, newPostData)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Post Updated successfully',
    data: result,
  })
})
// * delete post from database
const deletePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id
  const result = await postServices.deletePostFromDatabase(postId)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post Deleted successfully',
    data: result,
  })
})

// !Post up vote
const upadteUpVote = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id
  const user = req.user
  const result = await postServices.upadteUpVoteIntoDB(postId, user)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post upvoted successfully',
    data: result,
  })
})
// !Post down vote
const upadteDownVote = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id
  const user = req.user
  const result = await postServices.updateDownVoteIntoDB(postId, user)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post Downvoted successfully',
    data: result,
  })
})

// *toggle post status
const togglePostStatus = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id
  const result = await postServices.togglePostStatusIntoDB(postId)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post status changed successfully',
    data: result,
  })
})

export const postControllers = {
  createPost,
  getMyPosts,
  getAllPosts,
  updatePost,
  deletePost,
  upadteUpVote,
  upadteDownVote,
  togglePostStatus,
}
