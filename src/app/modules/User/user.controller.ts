import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { userServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'

// *Get All Single User Profile
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAllUserFromDB()
  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users retrieved successfully',
      data: result,
    })
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: [],
    })
  }
})
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.user
  const result = await userServices.getSingleUserFromDB(userData)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  })
})

// *Upadte user Profile

const updateSingleUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.user
  const updatedData = req.body
  const image = req.file
  const newUserUpadatedData = { ...updatedData, profilePicture: image?.path }
  const result = await userServices.updateSingleUserIntoDB(
    userData,
    newUserUpadatedData,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  })
})
const updateAdminUser = catchAsync(async (req: Request, res: Response) => {
  const query = req.params.id as string

  const result = await userServices.makeAdminUserIntoDB(query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Make Admin successfully',
    data: result,
  })
})

// *follow User

const followUser = catchAsync(async (req: Request, res: Response) => {
  const followerUserID = req.params.id as string
  const user = req.user
  const result = await userServices.followUserIntoDB(followerUserID, user)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Followed successfully',
    data: result,
  })
})

export const userControllers = {
  getSingleUser,
  updateSingleUser,
  getAllUser,
  updateAdminUser,
  followUser,
}
