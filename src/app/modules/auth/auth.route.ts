import express from 'express'
import { authControllers } from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'
import { authValidationSchemas } from './auth.validation'
import { parseBody } from '../../middlewares/bodyParser'

import { multerUpload } from '../../config/multer.config'

const router = express.Router()

// *Register User Route

router.post(
  '/signup',
  multerUpload.single('image'),
  parseBody,
  validateRequest(authValidationSchemas.RegisterValidatioonSchema),
  authControllers.RegisterUser,
)

// * Login User Route

router.post(
  '/login',
  validateRequest(authValidationSchemas.LoginValidationSchema),
  authControllers.loginUser,
)

// * Forgot Password Route

router.post(
  '/forget-password',
  validateRequest(authValidationSchemas.ForgetPasswordValidationSchema),
  authControllers.forgetPassword,
)

//*RESET PASSWORD
router.post(
  '/reset-password',
  validateRequest(authValidationSchemas.ResetPasswordValidationSchema),
  authControllers.resetPassword,
)

export const authRoutes = router
