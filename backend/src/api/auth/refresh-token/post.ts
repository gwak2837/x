import { t } from 'elysia'

import { BaseElysia } from '../../..'
import { UserSuspendedType } from '../../../model/User'
import { isNumberString } from '../../../utils'
import { LoginNotAllowed } from '../../../utils/auth'
import { TokenType, signJWT, verifyJWT } from '../../../utils/jwt'

export default (app: BaseElysia) =>
  app.post(
    '/auth/refresh-token',
    async ({ error, headers, sql }) => {
      const auth = headers['authorization']
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth
      if (!token) return error(401, 'Unauthorized')

      try {
        const { sub: userId } = await verifyJWT(token, TokenType.REFRESH)
        if (!userId || !isNumberString(userId)) return error(422, 'Unprocessable Content')

        const [user] = await sql<[Result]>`
          SELECT "suspendedType"
          FROM "User"
          WHERE id = ${userId};`

        if (!user || (user.suspendedType && LoginNotAllowed.includes(user.suspendedType)))
          return error(403, 'Forbidden')

        return { accessToken: await signJWT({ sub: userId }, TokenType.REFRESH) }
      } catch (_) {
        return error(401, 'Unauthorized')
      }
    },
    {
      headers: t.Object({ authorization: t.String() }),
      response: {
        200: t.Object({ accessToken: t.String() }),
        401: t.String(),
        403: t.String(),
        422: t.String(),
      },
    },
  )

type Result = {
  suspendedType: UserSuspendedType
}
