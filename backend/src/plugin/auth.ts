import Elysia from 'elysia'
import { verifyJWT, TokenType } from '../utils/jwt'
import { toBigInt } from '../utils'

export default () => (app: Elysia) =>
  app.derive(async ({ error, headers }) => {
    const auth = headers?.['Authorization']
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : auth
    if (!token) return {}

    try {
      const { sub } = await verifyJWT(token, TokenType.ACCESS)
      if (!sub) return error(422, 'Unprocessable Content')

      const userId = toBigInt(sub)
      if (!userId) return error(422, 'Unprocessable Content')

      return { userId }
    } catch (_) {
      return {}
    }
  })
