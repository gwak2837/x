import type { BaseElysia } from '@/index'

import { NotFoundError, type Static, t } from 'elysia'

export default function DELETEAuthLogout(app: BaseElysia) {
  return app.delete(
    '/auth/logout',
    async ({ error, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const [logoutUser] = await sql<[LogoutUser]>`
        UPDATE "User"
        SET "logoutAt" = CURRENT_TIMESTAMP
        WHERE id = ${userId}
        RETURNING id, "logoutAt"`
      if (!logoutUser) throw new NotFoundError()

      return logoutUser
    },
    {
      headers: t.Object({ authorization: t.String() }),
      response: {
        200: response200Schema,
        400: t.String(),
        401: t.String(),
        404: t.String(),
      },
    },
  )
}

export type DELETEAuthLogoutResponse200 = Static<typeof response200Schema>

const response200Schema = t.Object({
  id: t.String(),
  logoutAt: t.Date(),
})

type LogoutUser = {
  id: string
  logoutAt: Date
}
