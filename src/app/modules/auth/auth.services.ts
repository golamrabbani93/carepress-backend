import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { TUser } from '../User/user.interface'
import { User } from '../User/user.model'
import { TLoginUser } from './auth.interface'
import jwt from 'jsonwebtoken'
import config from '../../config'
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
export const authServices = {
  registerUserIntoDB,
  loginUser,
}
