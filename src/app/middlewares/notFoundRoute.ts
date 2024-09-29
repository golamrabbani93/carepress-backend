/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'

const notFoundRoute = (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    StatusCode: httpStatus.NOT_FOUND,
    message: 'Route Not Found !',
  })
}

export default notFoundRoute
