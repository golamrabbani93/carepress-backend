import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.constant'
import { commentControllers } from './comment.controller'
import { CommentValidations } from './comment.validation'

const router = express.Router()

// *create comment
router.post(
  '/create-comment',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(CommentValidations.CommentValidationSchema),
  commentControllers.createComment,
)

// *get all comments
router.get('/', commentControllers.getAllComments)

// *update comment
router.put(
  '/:id',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(CommentValidations.UpdateCommentValidationSchema),
  commentControllers.updateComment,
)

// *delete comment
router.delete(
  '/:id',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  commentControllers.deleteComment,
)

export const commentRoutes = router
