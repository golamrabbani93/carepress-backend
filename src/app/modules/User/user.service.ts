import { JwtPayload } from 'jsonwebtoken'
import { User } from './user.model'
import { TUser } from './user.interface'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import mongoose from 'mongoose'

// *Get User Profile From Database
const getSingleUserFromDB = async (payload: JwtPayload) => {
  const result = await User.findOne({
    email: payload?.email,
    role: payload?.role,
  }).populate('followers following')
  return result
}
// *Get ALl User Profile From Database
const getAllUserFromDB = async () => {
  const result = await User.find()
  return result
}

// *Update a User Profile

const updateSingleUserIntoDB = async (
  userData: JwtPayload,
  payload: Partial<TUser>,
) => {
  const result = await User.findOneAndUpdate(
    { email: userData?.email },
    {
      name: payload?.name,
      phone: payload?.phone,
      email: payload?.email,
      followers: payload?.followers,
      following: payload?.following,
      profilePicture: payload?.profilePicture,
    },
    {
      new: true,
    },
  )
  return result
}

const makeAdminUserIntoDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    {
      role: 'ADMIN',
    },
    {
      new: true,
    },
  )
  return result
}
const blockUserIntoDB = async (id: string) => {
  const user = await User.findById(id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }
  if (user.role === 'ADMIN') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You cannot block an admin')
  }

  const result = await User.findByIdAndUpdate(
    id,
    {
      status: 'blocked',
    },
    {
      new: true,
    },
  )
  return result
}

const unBlockUserIntoDB = async (id: string) => {
  const user = await User.findById(id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }

  const result = await User.findByIdAndUpdate(
    id,
    {
      status: 'basic',
    },
    {
      new: true,
    },
  )
  return result
}
// *follow USer

const followUserIntoDB = async (followerUserID: string, user: JwtPayload) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    //* Check if the user exists
    const checkUser = await User.findById(followerUserID)

    if (!checkUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
    }

    // *check if the user is already following the user
    const isFollowing =
      checkUser?.followers?.includes(user?._id.toString()) ?? false
    if (isFollowing) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You are already following this user',
      )
    }

    //* Check if the user is trying to follow themselves

    if (checkUser._id.toString() === user?._id.toString()) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself')
    }

    //* Update the user with the new follower
    const userFollower = await User.findByIdAndUpdate(
      checkUser?._id,
      { $push: { followers: user?._id } },
      { new: true },
    )
    if (!userFollower) {
      throw new AppError(httpStatus.NOT_MODIFIED, 'User Follow Unsuccessful')
    }

    //* Update the user with the new following
    const result = await User.findByIdAndUpdate(
      user?._id,
      { $push: { following: userFollower._id } },
      { new: true },
    )

    if (!result) {
      throw new AppError(httpStatus.NOT_MODIFIED, 'User Follow Unsuccessful')
    }
    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'User Follow Unsuccessful',
    )
  }
}

// *Unfollow User
const unFollowUserIntoDB = async (followerUserID: string, user: JwtPayload) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    //* Check if the user exists
    const checkUser = await User.findById(followerUserID)

    if (!checkUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
    }

    //* Update the user with the new follower
    const userFollower = await User.findByIdAndUpdate(
      checkUser?._id,
      { $pull: { followers: user?._id } },
      { new: true },
    )
    if (!userFollower) {
      throw new AppError(httpStatus.NOT_MODIFIED, 'User UnFollow Unsuccessful')
    }

    //* Update the user with the new following
    const result = await User.findByIdAndUpdate(
      user?._id,
      { $pull: { following: userFollower._id } },
      { new: true },
    )

    if (!result) {
      throw new AppError(httpStatus.NOT_MODIFIED, 'User UnFollow Unsuccessful')
    }
    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'User Unfollow Unsuccessful',
    )
  }
}

// * delete user from database
const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndDelete(id)
  return result
}

export const userServices = {
  getSingleUserFromDB,
  updateSingleUserIntoDB,
  getAllUserFromDB,
  makeAdminUserIntoDB,
  followUserIntoDB,
  unFollowUserIntoDB,
  blockUserIntoDB,
  unBlockUserIntoDB,
  deleteUserFromDB,
}
