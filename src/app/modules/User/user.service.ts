import { JwtPayload } from 'jsonwebtoken'
import { User } from './user.model'
import { TUser } from './user.interface'

// *Get User Profile From Database
const getSingleUserFromDB = async (payload: JwtPayload) => {
  const result = await User.findOne({
    email: payload?.email,
    role: payload?.role,
  })
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

export const userServices = {
  getSingleUserFromDB,
  updateSingleUserIntoDB,
  getAllUserFromDB,
  makeAdminUserIntoDB,
}
