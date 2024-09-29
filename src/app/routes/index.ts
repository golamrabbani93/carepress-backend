import { Router } from 'express'
import { authRoutes } from '../modules/auth/auth.route'
import { userRoutes } from '../modules/User/user.route'
import { postRoutes } from '../modules/post/post.route'
import { commentRoutes } from '../modules/comment/comment.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/posts',
    route: postRoutes,
  },
  {
    path: '/comments',
    route: commentRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
