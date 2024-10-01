import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { parseBody } from '../../middlewares/bodyParser'

import { multerUpload } from '../../config/multer.config'
import { postValidation } from './post.validation'
import { postControllers } from './post.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.constant'
import validateImageFileRequest from '../../middlewares/validateImageFileRequest'
import { ImageFilesArrayZodSchema } from '../../Zod/image.validation'

const router = express.Router()

// *Register User Route

router.post(
  '/create-post',
  auth(USER_ROLE.USER),
  multerUpload.fields([{ name: 'images' }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(postValidation.PostValidationSchema),
  postControllers.createPost,
)
//* get all posts
router.get('/', postControllers.getAllPosts)
//* update post
router.put(
  '/:id',
  auth(USER_ROLE.USER),
  multerUpload.fields([{ name: 'images' }]),
  // validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(postValidation.UpdatePostValidationSchema),
  postControllers.updatePost,
)
//* delete post
router.delete(
  '/:id',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  postControllers.deletePost,
)

// *upvote
router.put('/upvote/:id', auth(USER_ROLE.USER), postControllers.upadteUpVote)

export const postRoutes = router
