import { NotFoundError, t } from 'elysia'

import { BaseElysia } from '../../../..'
import { deeplyRemoveNull, isValidPostgresBigIntString } from '../../../../utils'

export default (app: BaseElysia) =>
  app.get(
    '/user/:id/follower',
    async ({ error, params, sql, userId }) => {
      const { id: leaderId } = params
      if (!isValidPostgresBigIntString(leaderId)) return error(400, 'Bad Request')

      const followers = await sql<FollowRow[]>`
        WITH leader AS (
          SELECT "isPrivate"
          FROM "User"
          WHERE "id" = ${leaderId}
        )
        SELECT id,
          bio,
          grade,
          "isPrivate",
          name,
          nickname,
          "profileImageURLs"
        FROM "User"
          JOIN "UserFollow" ON "UserFollow"."followerId" = "User"."id"
        WHERE "UserFollow"."leaderId" = ${leaderId}
          AND (
            (SELECT "isPrivate" FROM leader) = FALSE
            OR EXISTS (
              SELECT 1
              FROM "UserFollow"
              WHERE "leaderId" = ${leaderId}
              AND "followerId" = ${userId}
            )
          )`
      if (!followers.length) throw new NotFoundError()

      return followers.map((follower) => deeplyRemoveNull(follower))
    },
    {
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      response: {
        200: t.Array(
          t.Object({
            id: t.String(),
            bio: t.Optional(t.String()),
            grade: t.Number(),
            isPrivate: t.Boolean(),
            name: t.String(),
            nickname: t.String(),
            profileImageURL: t.Optional(t.Array(t.String())),
          }),
        ),
        400: t.String(),
        404: t.String(),
      },
    },
  )

type FollowRow = {
  id: string
  bio: string | null
  grade: number
  isPrivate: boolean
  name: string
  nickname: string
  profileImageURL: string[] | null
}
