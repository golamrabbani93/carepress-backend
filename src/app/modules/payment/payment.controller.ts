//* create  payment

import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { paymentServices } from './payment.sevice'

const createPayment = catchAsync(async (req, res) => {
  const paymentData = req.body
  const result = await paymentServices.savePaymentIntoDatabase(paymentData)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment Created successfully',
    data: result,
  })
})

export const paymentControllers = {
  createPayment,
}
