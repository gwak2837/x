import { BaseElysia } from '.'
import getAccessToken from './api/auth/access-token/post'
import loginByBBaton from './api/auth/bbaton/post'
import getRefreshToken from './api/auth/refresh-token/post'
import getComments from './api/post/[id]/comment/get'
import deletePost from './api/post/[id]/delete'
import getPost from './api/post/[id]/get'
import updatePost from './api/post/[id]/patch'
import getPosts from './api/post/get'
import createPost from './api/post/post'

export default (app: BaseElysia) =>
  app
    .use(getAccessToken)
    .use(loginByBBaton)
    .use(getRefreshToken)
    .use(getComments)
    .use(deletePost)
    .use(getPost)
    .use(updatePost)
    .use(getPosts)
    .use(createPost)
