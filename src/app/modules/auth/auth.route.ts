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

export const authRoutes = router
