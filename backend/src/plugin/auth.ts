import Elysia from 'elysia'
import { verifyJWT, Type } from '../utils/jwt'

export default () => (app: Elysia) =>
  app.derive(async ({ error, headers }) => {
    const auth = headers?.['authorization']
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : auth
    if (!token) return {}

    try {
      const { sub: userId } = await verifyJWT(token, Type.ACCESS)
      if (!userId) return error(422)

      return { user: { id: userId } }
    } catch (_) {
      return error(401)
    }
  })
