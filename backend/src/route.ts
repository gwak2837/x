import { type BaseElysia } from '.'
import getAccessToken from './api/auth/access-token/post'
import loginByBBaton from './api/auth/bbaton/post'
import logout from './api/auth/logout/delete'
import getRefreshToken from './api/auth/refresh-token/post'
import getComments from './api/post/[id]/comment/get'
import deletePost from './api/post/[id]/delete'
import getPost from './api/post/[id]/get'
import updatePost from './api/post/[id]/patch'
import getPosts from './api/post/get'
import createPost from './api/post/post'
import deleteFollowing from './api/user/[id]/follower/delete'
import getFollowers from './api/user/[id]/follower/get'
import updateFollowers from './api/user/[id]/follower/patch'
import createFollowing from './api/user/[id]/follower/post'
import getUser from './api/user/[id]/get'
import updateUser from './api/user/[id]/patch'

export default (app: BaseElysia) =>
  app
    .use(getAccessToken)
    .use(loginByBBaton)
    .use(logout)
    .use(getRefreshToken)
    .use(getComments)
    .use(deletePost)
    .use(getPost)
    .use(updatePost)
    .use(getPosts)
    .use(createPost)
    .use(deleteFollowing)
    .use(getFollowers)
    .use(updateFollowers)
    .use(createFollowing)
    .use(getUser)
    .use(updateUser)
