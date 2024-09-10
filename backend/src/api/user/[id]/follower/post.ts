import { NotFoundError, type Static, t } from 'elysia'

import type { BaseElysia } from '../../../..'

import { UserFollowStatus } from '../../../../model/User'
import { PostgresErrorCode } from '../../../../plugin/postgres'
import { isValidPostgresBigInt } from '../../../../util'

export default (app: BaseElysia) =>
  app.post(
    '/user/:id/follower',
    async ({ error, params, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { id: leaderId } = params
      if (!isValidPostgresBigInt(leaderId) || leaderId === userId) return error(400, 'Bad Request')

      const [follow] = await sql<[FollowRow]>`
        WITH leader AS (
          SELECT "isPrivate"
          FROM "User"
          WHERE "id" = ${leaderId}
        )
        INSERT INTO "UserFollow" ("leaderId", "followerId", "status")
        VALUES (
          ${leaderId}, 
          ${userId}, 
          (
            SELECT 
              CASE 
                WHEN "isPrivate" THEN ${UserFollowStatus.PENDING}::smallint 
                ELSE ${UserFollowStatus.ACCEPTED}::smallint 
              END
            FROM leader
          )
        )
        ON CONFLICT DO NOTHING
        RETURNING "createdAt"
      `.catch((error) => {
        if (error.code === PostgresErrorCode.FOREIGN_KEY_VIOLATION) return []
        if (error.code === PostgresErrorCode.NOT_NULL_VIOLATION) return []
        throw error
      })
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
      },
    },
  )

export type POSTUserIdFollowerResponse200 = Static<typeof response200Schema>

const response200Schema = t.Object({ createdAt: t.Date() })

export type FollowRow = {
  createdAt: Date
}
