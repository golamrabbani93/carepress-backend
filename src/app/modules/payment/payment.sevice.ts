import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { User } from '../User/user.model'
import { IPayment } from './payment.interface'
import { Payment } from './payment.model'
import mongoose from 'mongoose'
import QueryBuilder from '../../builder/queryBuilder'

import Stripe from 'stripe'
import config from '../../config'

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

//* get all payments from database
const getAllPaymentsFromDatabase = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(Payment.find(), query)
    .filter()
    .sort()
    .fields()
    .populate('userId')

  const result = await paymentQuery.modelQuery
  return result
}

// *Payment intent
const stripe = new Stripe(config.payment_intent as string)

// * get api payment intent
const getPaymentIntentfromStripe = async (price: number) => {
  const fixed = Number(price * 100).toFixed(2)
  const amount = Number(fixed)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    payment_method_types: ['card'],
  })
  return paymentIntent.client_secret
}

export const paymentServices = {
  savePaymentIntoDatabase,
  getAllPaymentsFromDatabase,
  getPaymentIntentfromStripe,
}
