import getRefreshToken from './api/auth/refresh/post'
import deletePost from './api/post/[id]/delete'
import getPost from './api/post/[id]/get'
import updatePost from './api/post/[id]/patch'
import getPosts from './api/post/get'
import createPost from './api/post/post'
import { BaseElysia } from '.'

export default (app: BaseElysia) =>
  app
    .use(getRefreshToken)
    .use(deletePost)
    .use(getPost)
    .use(updatePost)
    .use(getPosts)
    .use(createPost)
