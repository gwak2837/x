import { type Static, t } from 'elysia'

import type { BaseElysia } from '../../..'
import type { UserSuspendedType } from '../../../model/User'

import { isValidPostgresBigInt } from '../../../util'
import { LoginNotAllowed } from '../../../util/auth'
import { TokenType, signJWT, verifyJWT } from '../../../util/jwt'

export default function POSTAuthAccessToken(app: BaseElysia) {
  return app.post(
    '/auth/access-token',
    async ({ error, headers, sql }) => {
      const auth = headers['authorization']
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth
      if (!token) return error(401, 'Unauthorized')

      try {
        const { iat, sub: userId } = await verifyJWT(token, TokenType.REFRESH)
        if (!iat || !userId || !isValidPostgresBigInt(userId))
          return error(422, 'Unprocessable Content')

        const [user] = await sql<[UserRow]>`
          SELECT "logoutAt",
            "suspendedType",
            "unsuspendAt"
          FROM "User"
          WHERE id = ${userId}`

        if (
          !user ||
          (user.suspendedType &&
            LoginNotAllowed.includes(user.suspendedType) &&
            user.unsuspendAt &&
            user.unsuspendAt > new Date()) ||
          (user.logoutAt && user.logoutAt > new Date(iat * 1000))
        )
          return error(403, 'Forbidden')

        return { accessToken: await signJWT({ sub: userId }, TokenType.ACCESS) }
      } catch (_) {
        return error(401, 'Unauthorized')
      }
    },
    {
      headers: t.Object({ authorization: t.String() }),
      response: {
        200: response200Schema,
        401: t.String(),
        403: t.String(),
        422: t.String(),
      },
    },
  )
}
export type POSTAuthAccessTokenResponse200 = Static<typeof response200Schema>

const response200Schema = t.Object({ accessToken: t.String() })

type UserRow = {
  logoutAt: Date | null
  suspendedType: UserSuspendedType | null
  unsuspendAt: Date | null
}
