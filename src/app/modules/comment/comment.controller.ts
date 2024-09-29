import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { commentServices } from './comment.sevice'

// * create comment in database
const createComment = catchAsync(async (req: Request, res: Response) => {
  const commentData = req.body
  const result = await commentServices.createCommentIntoDatabase(commentData)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Comment Created successfully',
    data: result,
  })
})
// * get all comments from database
const getAllComments = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
  const result = await commentServices.getAllCommentsFromDatabase(query)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All Comments fetched successfully',
    data: result,
  })
})
// * update comment in database
const updateComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.id
  const commentData = req.body
  const result = await commentServices.updateCommentIntoDatabase(
    commentId,
    commentData,
  )
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Comment Updated successfully',
    data: result,
  })
})
// * delete comment from database
const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.id as string
  const result = await commentServices.deleteCommentFromDatabase(commentId)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment Deleted successfully',
    data: result,
  })
})

export const commentControllers = {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
}
