import { NextFunction, Request, Response } from 'express'

import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import { TUserRole } from '../modules/User/user.interface'
import sendResponse from '../utils/sendResponse'
import { User } from '../modules/User/user.model'

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // *get Token From client Side  And Split
    const token = req.headers.authorization?.split(' ')?.[1]

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload

    const { role, userEmail } = decoded

    // * Check User is Exists in Database
    const existsUser = await User.isUserExistsByEmail(userEmail)
    if (!existsUser) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: 'This user is not Exists In Database !',
      })
    }

    // !Check User Role
    if (requiredRoles && !requiredRoles.includes(role)) {
      return sendResponse(res, {
        success: false,
        statusCode: 401,
        message: 'You have no access to this route',
      })
    }

    req.user = decoded as JwtPayload
    next()
  })
}

export default auth
