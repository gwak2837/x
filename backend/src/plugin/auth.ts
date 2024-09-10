import type Elysia from 'elysia'

import { TokenType, verifyJWT } from '../util/jwt'

export default () => (app: Elysia) =>
  app.derive(async ({ error, headers }) => {
    const auth = headers?.['authorization']
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : auth
    if (!token) return { userId: null }

    try {
      const { sub: userId } = await verifyJWT(token, TokenType.ACCESS)
      if (!userId) return error(422, 'Unprocessable Content')

      return { userId }
    } catch (error) {
      return { userId: null }
    }
  })
