import express from 'express'
import { userControllers } from './user.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.constant'
import validateRequest from '../../middlewares/validateRequest'
import { userValidation } from './user.validation'

const router = express.Router()

//* Get A single user Route

router.get(
  '/me',
  auth(USER_ROLE.user, USER_ROLE.admin),
  userControllers.getSingleUser,
)
//* Get ALl user Route
router.get('/', auth(USER_ROLE.admin), userControllers.getAllUser)

//* Update A single user Route
router.put(
  '/me',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(userValidation.UserUpdateValidatioonSchema),
  userControllers.updateSingleUser,
)
router.put(
  '/make-admin/:id',
  auth(USER_ROLE.admin),
  userControllers.updateAdminUser,
)

export const userRoutes = router
