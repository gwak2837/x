import { NotFoundError, type Static, t } from 'elysia'

import type { BaseElysia } from '../../../..'

import { UserFollowStatus } from '../../../../model/User'
import { deeplyRemoveNull, isValidPostgresBigIntString } from '../../../../utils'

export default (app: BaseElysia) =>
  app.get(
    '/user/:id/follower',
    async ({ error, params, sql, userId }) => {
      const { id: leaderId } = params
      if (!isValidPostgresBigIntString(leaderId)) return error(400, 'Bad Request')

      const isMe = leaderId === userId

      const followers = await sql<FollowRow[]>`${
        isMe
          ? sql``
          : sql`
        WITH leader AS (
          SELECT "isPrivate"
          FROM "User"
          WHERE "id" = ${leaderId}
        )`
      }
        SELECT id,
          bio,
          grade,
          "isPrivate",
          name,
          nickname,
          "profileImageURLs"
        FROM "User"
          JOIN "UserFollow" ON "User"."id" = "UserFollow"."followerId"
        WHERE "UserFollow"."leaderId" = ${leaderId}
          AND "UserFollow".status = ${UserFollowStatus.ACCEPTED}
          ${
            isMe
              ? sql``
              : sql`
          AND (
            (SELECT "isPrivate" FROM leader) = FALSE
            OR EXISTS (
              SELECT 1
              FROM "UserFollow"
              WHERE "leaderId" = ${leaderId}
              AND "followerId" = ${userId}
              AND status = ${UserFollowStatus.ACCEPTED}
            )
          )`
          }`
      if (!followers.length) throw new NotFoundError()

      return followers.map((follower) => deeplyRemoveNull(follower))
    },
    {
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      response: {
        200: response200Schema,
        400: t.String(),
        404: t.String(),
      },
    },
  )

export type GETUserIdFollowerResponse200 = Static<typeof response200Schema>

const response200Schema = t.Array(
  t.Object({
    id: t.String(),
    bio: t.Optional(t.String()),
    grade: t.Number(),
    isPrivate: t.Boolean(),
    name: t.String(),
    nickname: t.String(),
    profileImageURL: t.Optional(t.Array(t.String())),
  }),
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
