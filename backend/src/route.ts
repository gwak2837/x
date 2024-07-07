import auth from './api/auth/route'
import post from './api/post/route'
import { BaseElysia } from '.'

export default async (app: BaseElysia) => {
  if (process.env.NODE_ENV !== 'production') {
    const module = await import('./plugin/example')
    app.use(module.default)
  }

  return app.use(auth).use(post)
}
