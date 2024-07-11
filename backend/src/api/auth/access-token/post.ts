import { t } from 'elysia'
import { BaseElysia } from '../../..'
import { signJWT, TokenType, verifyJWT } from '../../../utils/jwt'
import { LoginNotAllowed } from '../../../utils/auth'

export default (app: BaseElysia) =>
  app.post(
    '/auth/access-token',
    async ({ error, headers, prisma }) => {
      const auth = headers?.['Authorization']
      const token = auth?.startsWith('Bearer ') ? auth.slice(7) : auth
      if (!token) return error(401, 'Unauthorized')

      try {
        const { sub: userId } = await verifyJWT(token, TokenType.REFRESH)
        if (!userId) return error(422, 'Unprocessable Content')

        const user = await prisma.user.findUnique({
          select: { suspendedType: true },
          where: { id: userId },
        })
        if (!user || (user.suspendedType && LoginNotAllowed.includes(user.suspendedType)))
          return error(403, 'Forbidden')

        return { accessToken: await signJWT({ sub: userId }, TokenType.ACCESS) }
      } catch (_) {
        return error(401, 'Unauthorized')
      }
    },
    {
      headers: t.Object({ Authorization: t.String() }),
      response: {
        200: t.Object({ accessToken: t.String() }),
        401: t.String(),
        403: t.String(),
        422: t.String(),
      },
    },
  )
