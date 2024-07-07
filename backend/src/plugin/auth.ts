import Elysia from 'elysia'
import { verifyJWT, TokenType } from '../utils/jwt'

export default () => (app: Elysia) =>
  app.derive(async ({ error, headers }) => {
    const auth = headers?.['Authorization']
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : auth
    if (!token) return {}

    try {
      const { sub: userId } = await verifyJWT(token, TokenType.ACCESS)
      if (!userId) return error(422)

      return { userId }
    } catch (_) {
      return {}
    }
  })
