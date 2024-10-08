import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { TUser } from '../User/user.interface'
import { User } from '../User/user.model'
import { TLoginUser } from './auth.interface'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../../config'
import { sendEmail } from '../../utils/sendEmail'
import bcrypt from 'bcrypt'
// *Register User Info In to Database
const registerUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload)
  return result
}

// *Login User

const loginUser = async (payload: TLoginUser) => {
  // * Check User is Exists in Database
  const existsUser = await User.isUserExistsByEmail(payload?.email)
  if (!existsUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }

  //*checking if the password is correct
  if (
    !(await User.isPasswordMatched(payload?.password, existsUser?.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')
  }
  //* Create JWT token and sent to the  client

  const jwtPayload = {
    _id: existsUser._id,
    name: existsUser.name,
    email: existsUser.email,
    profilePicture: existsUser.profilePicture,
    followers: existsUser.followers || [],
    following: existsUser.following || [],
    role: existsUser.role,
    status: existsUser.status,
    createdAt: existsUser.createdAt,
    updatedAt: existsUser.updatedAt,
  }
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '30d',
  })
  return {
    accessToken,
    existsUser,
  }
}

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await User.findOne({ email })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }
  // checking if the user is already deleted

  // checking if the user is blocked
  const userStatus = user?.status

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !')
  }

  const jwtPayload = {
    userId: user._id,
    role: user.role,
  }

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10min',
  })

  const resetUILink = `${config.frontend_url}/reset-password/${user.email}?id=${user.id}&token=${accessToken} `

  sendEmail(user.email, resetUILink)
}
// http://localhost:3000/reset-password/id=6703738335840a2c4a726474?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzAzNzM4MzM1ODQwYTJjNGE3MjY0NzQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcyODI4MjA3MiwiZXhwIjoxNzI4MjgyNjcyfQ.Qmd5Y1hbN-yv_kXiQPORCZjn09vajKS5sMTMO3YvDIk

// http://localhost:3000?id=6703738335840a2c4a726474&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzAzNzM4MzM1ODQwYTJjNGE3MjY0NzQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcyODI4MTI4MCwiZXhwIjoxNzI4MjgxODgwfQ.i7HPpX3qrK-QXncwwLLy9hckvQQ06kLveTItFpDPFfI

const resetPassword = async (
  payload: { userId: string; newPassword: string },
  token: string,
) => {
  const user = await User.findById(payload.userId)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }
  // checking if the user is already deleted

  // checking if the user is blocked
  const userStatus = user?.status

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !')
  }
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload

  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  if (payload.userId !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!')
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  await User.findByIdAndUpdate(
    {
      _id: decoded.userId,
    },
    {
      password: newHashedPassword,
    },
  )
}

export const authServices = {
  registerUserIntoDB,
  loginUser,
  forgetPassword,
  resetPassword,
}
