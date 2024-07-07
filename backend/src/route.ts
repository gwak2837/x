import auth from './api/auth/route'
import post from './api/post/route'
import { BaseElysia } from '.'

export default async (app: BaseElysia) => app.use(auth).use(post)
