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

router.get('/', auth(USER_ROLE.ADMIN), paymentControllers.getAllPayments)

export const paymentRoutes = router
