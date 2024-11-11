import { type BaseElysia } from '.'
import POSTAuthAccessToken from './api/auth/access-token/post'
import POSTAuthBBaton from './api/auth/bbaton/post'
import DELETEAuthLogout from './api/auth/logout/delete'
import POSTAuthRefreshToken from './api/auth/refresh-token/post'
import GETManga from './api/manga/get'
import GETPostIdComment from './api/post/[id]/comment/get'
import deletePost from './api/post/[id]/delete'
import getPost from './api/post/[id]/get'
import updatePost from './api/post/[id]/patch'
import GETPostIdStat from './api/post/[id]/stat/get'
import getPosts from './api/post/get'
import createPost from './api/post/post'
import deleteFollowing from './api/user/[id]/follower/delete'
import getFollowers from './api/user/[id]/follower/get'
import updateFollowers from './api/user/[id]/follower/patch'
import createFollower from './api/user/[id]/follower/post'
import getUser from './api/user/[id]/get'
import updateUser from './api/user/[id]/patch'

export default function route(app: BaseElysia) {
  return app
    .use(POSTAuthAccessToken)
    .use(POSTAuthBBaton)
    .use(DELETEAuthLogout)
    .use(POSTAuthRefreshToken)
    .use(GETManga)
    .use(GETPostIdComment)
    .use(deletePost)
    .use(getPost)
    .use(updatePost)
    .use(GETPostIdStat)
    .use(getPosts)
    .use(createPost)
    .use(deleteFollowing)
    .use(getFollowers)
    .use(updateFollowers)
    .use(createFollower)
    .use(getUser)
    .use(updateUser)
}
