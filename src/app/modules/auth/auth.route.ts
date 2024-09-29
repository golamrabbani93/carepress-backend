import express from 'express'
import { authControllers } from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'
import { authValidationSchemas } from './auth.validation'

const router = express.Router()

// *Register User Route

router.post(
  '/signup',
  validateRequest(authValidationSchemas.RegisterValidatioonSchema),
  authControllers.RegisterUser,
)

// * Login User Route

router.post(
  '/login',
  validateRequest(authValidationSchemas.LoginValidationSchema),
  authControllers.loginUser,
)

export const authRoutes = router
