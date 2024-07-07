import auth from './api/auth/route'
import getPost from './api/post/[id]/get'
import deletePost from './api/post/[id]/delete'
import updatePost from './api/post/[id]/patch'
import createPost from './api/post/post'
import { BaseElysia } from '.'

export default (app: BaseElysia) =>
  app.use(auth).use(getPost).use(createPost).use(deletePost).use(updatePost)
