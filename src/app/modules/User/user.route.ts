import express from 'express'
import { userControllers } from './user.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.constant'
import validateRequest from '../../middlewares/validateRequest'
import { userValidation } from './user.validation'
import { multerUpload } from '../../config/multer.config'
import { parseBody } from '../../middlewares/bodyParser'

const router = express.Router()

//* Get A single user Route

router.get(
  '/me',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  userControllers.getSingleUser,
)
//* Get ALl user Route
router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  userControllers.getAllUser,
)

//* Update A single user Route
router.put(
  '/me',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  multerUpload.single('image'),
  parseBody,
  validateRequest(userValidation.UserUpdateValidatioonSchema),
  userControllers.updateSingleUser,
)
router.put(
  '/make-admin/:id',
  auth(USER_ROLE.ADMIN),
  userControllers.updateAdminUser,
)
router.delete('/:id', auth(USER_ROLE.ADMIN), userControllers.deleteUser)
router.put('/block/:id', auth(USER_ROLE.ADMIN), userControllers.blockUser)
router.put('/unblock/:id', auth(USER_ROLE.ADMIN), userControllers.unBlockUser)
router.put(
  '/follow/:id',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  userControllers.followUser,
)

router.put(
  '/unfollow/:id',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  userControllers.unFollowUser,
)

export const userRoutes = router
