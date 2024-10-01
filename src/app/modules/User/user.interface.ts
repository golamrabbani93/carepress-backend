/* eslint-disable no-unused-vars */
import mongoose, { Model } from 'mongoose'
import { USER_ROLE } from './user.constant'

export type TRole = 'ADMIN' | 'USER'

export interface TUser {
  _id?: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  profilePicture?: string
  phone?: string
  followers?: mongoose.Types.ObjectId[]
  following?: mongoose.Types.ObjectId[]
  role?: TRole
  createdAt?: string
  updatedAt?: string
  upvotes?: number
  downvotes?: number
}

export interface UserModel extends Model<TUser> {
  //* instance methods for checking if the user exist

  isUserExistsByEmail(email: string): Promise<TUser>
  //* instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>
}

//* Export User Role
export type TUserRole = keyof typeof USER_ROLE
