import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { User } from '../User/user.model'
import { IPayment } from './payment.interface'
import { Payment } from './payment.model'
import mongoose from 'mongoose'
//* save payment into database and update user status to premium
const savePaymentIntoDatabase = async (paymentData: IPayment) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const { userId } = paymentData
    const user = await User.findById(userId)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
    }
    const result = await User.findByIdAndUpdate(
      userId,
      {
        status: 'premium',
      },
      {
        new: true,
        session: session,
      },
    )
    if (!result) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'User status not updated',
      )
    }
    const payment = await Payment.create([paymentData], { session: session })
    if (!payment[0]._id) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Payment not saved')
    }
    await session.commitTransaction()
    await session.endSession()

    return payment
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Payment not saved')
  }
}

export const paymentServices = {
  savePaymentIntoDatabase,
}
