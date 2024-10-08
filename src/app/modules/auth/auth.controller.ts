import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { authServices } from './auth.services'
import catchAsync from '../../utils/catchAsync'
import { Request, Response } from 'express'

// *Register A User
const RegisterUser = catchAsync(async (req: Request, res: Response) => {
  const image = req.file
  const userData = req.body
  const newUser = { ...userData, profilePicture: image?.path }
  const result = await authServices.registerUserIntoDB(newUser)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  })
})

// *Login A User
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginUserData = req.body
  const result = await authServices.loginUser(loginUserData)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    token: result?.accessToken,
    data: result?.existsUser,
  })
})

//* Forget Password
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email
  const result = await authServices.forgetPassword(email)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Forget Password Email Sent successfully',
    data: result,
  })
})

//* reset Password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  req.body
  const token = req.headers.authorization as string
  const result = await authServices.resetPassword(req.body, token)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully',
    data: result,
  })
})

export const authControllers = {
  RegisterUser,
  loginUser,
  forgetPassword,
  resetPassword,
}
