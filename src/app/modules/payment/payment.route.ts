import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.constant'
import { PaymentValidationSchema } from './payment.validation'
import { paymentControllers } from './payment.controller'

const router = express.Router()

//create payment route
router.post(
  '/create-payment',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(PaymentValidationSchema),
  paymentControllers.createPayment,
)

export const paymentRoutes = router
