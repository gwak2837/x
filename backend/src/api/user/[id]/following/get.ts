import { NotFoundError, type Static, t } from 'elysia'

import type { BaseElysia } from '../../../..'

import { UserFollowStatus } from '../../../../model/User'
import { deeplyRemoveNull, isValidPostgresBigInt } from '../../../../utils'

export default (app: BaseElysia) =>
  app.get(
    '/user/:id/following',
    async ({ error, params, sql, userId }) => {
      const { id: followerId } = params
      if (!isValidPostgresBigInt(followerId)) return error(400, 'Bad Request')

      const isMe = followerId === userId

      const followings = await sql<FollowRow[]>`${
        isMe
          ? sql``
          : sql`
        WITH follower AS (
          SELECT "isPrivate"
          FROM "User"
          WHERE "id" = ${followerId}
        )`
      }
        SELECT id,
          bio,
          grade,
          "isPrivate",
          name,
          nickname,
          "profileImageURLs",
          status
        FROM "User"
          JOIN "UserFollow" ON "User"."id" = "UserFollow"."leaderId"
        WHERE "UserFollow"."followerId" = ${followerId}
        ${
          isMe
            ? sql``
            : sql`
          AND "UserFollow".status = ${UserFollowStatus.ACCEPTED}
          AND (
            (SELECT "isPrivate" FROM follower) = FALSE
            OR EXISTS (
              SELECT 1
              FROM "UserFollow"
              WHERE "leaderId" = ${followerId}
                AND "followerId" = ${userId}
                AND status = ${UserFollowStatus.ACCEPTED}
            )
          )`
        }`
      if (!followings.length) throw new NotFoundError()

      return followings.map((follower) => deeplyRemoveNull(follower))
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
