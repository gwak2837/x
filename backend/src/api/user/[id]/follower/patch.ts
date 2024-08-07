import { NotFoundError, t } from 'elysia'

import { BaseElysia } from '../../../..'
import { UserFollowStatusInput } from '../../../../model/User'
import { isValidPostgresBigIntString } from '../../../../utils'

export default (app: BaseElysia) =>
  app.patch(
    '/user/:id/follower',
    async ({ body, error, params, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { id: leaderId } = params
      const { userIds, status } = body

      if (
        !isValidPostgresBigIntString(leaderId) ||
        !userIds.every((id) => isValidPostgresBigIntString(id))
      )
        return error(400, 'Bad Request')

      if (leaderId !== userId) return error(403, 'Forbidden')

      const followers = await sql<FollowRow[]>`
        UPDATE "UserFollow" 
        SET "status" = ${status}
        WHERE "leaderId" = ${leaderId} AND "followerId" IN ${sql(userIds)}
        RETURNING "followerId", "createdAt"`
      if (!followers.length) throw new NotFoundError()

      return followers.map((follower) => ({
        id: follower.followerId,
        createdAt: follower.createdAt,
      }))
    },
    {
      headers: t.Object({ authorization: t.String() }),
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      body: t.Object({
        userIds: t.Array(t.String({ maxLength: 19 })),
        status: t.Enum(UserFollowStatusInput),
      }),
      response: {
        200: t.Array(
          t.Object({
            id: t.String(),
            createdAt: t.Date(),
          }),
        ),
        400: t.String(),
        401: t.String(),
        403: t.String(),
      },
    },
  )

type FollowRow = {
  followerId: string
  createdAt: Date
}
