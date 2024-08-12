import { NotFoundError, type Static, t } from 'elysia'

import type { BaseElysia } from '../../../..'

import { isValidPostgresBigInt } from '../../../../utils'

export default (app: BaseElysia) =>
  app.delete(
    '/user/:id/follower',
    async ({ error, params, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { id: leaderId } = params
      if (!isValidPostgresBigInt(leaderId)) return error(400, 'Bad Request')

      if (leaderId === userId) return error(403, 'Forbidden')

      const [follow] = await sql<[FollowRow]>`
        DELETE FROM "UserFollow"
        WHERE "leaderId" = ${leaderId} AND "followerId" = ${userId}
        RETURNING "createdAt"`
      if (!follow) throw new NotFoundError()

      return follow
    },
    {
      headers: t.Object({ authorization: t.String() }),
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      response: {
        200: response200Schema,
        400: t.String(),
        401: t.String(),
        403: t.String(),
        404: t.String(),
      },
    },
  )

export type DELETEUserIdFollowerResponse200 = Static<typeof response200Schema>

const response200Schema = t.Object({ createdAt: t.Date() })

type FollowRow = {
  createdAt: Date
}
