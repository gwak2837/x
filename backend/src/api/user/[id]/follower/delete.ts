import { NotFoundError, t } from 'elysia'

import { BaseElysia } from '../../../..'
import { isValidPostgresBigIntString } from '../../../../utils'

export default (app: BaseElysia) =>
  app.delete(
    '/user/:id/follower',
    async ({ error, params, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { id: leaderId } = params
      if (!isValidPostgresBigIntString(leaderId) || leaderId === userId)
        return error(400, 'Bad Request')

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
        200: t.Object({ createdAt: t.Date() }),
        400: t.String(),
        401: t.String(),
        403: t.String(),
      },
    },
  )

type FollowRow = {
  createdAt: Date
}
