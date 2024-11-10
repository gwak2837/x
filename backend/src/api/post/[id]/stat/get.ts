import { NotFoundError, type Static, t } from 'elysia'

import type { BaseElysia } from '../../../..'

import { isValidPostgresBigInt } from '../../../../util'

export default function GETPostIdStat(app: BaseElysia) {
  return app.get(
    '/post/:id/stat',
    async ({ error, params, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { id: postId } = params
      if (!isValidPostgresBigInt(postId)) return error(400, 'Bad Request')

      const result = await sql`
        SELECT
          COUNT("UserLikePost"."postId") AS "likeCount",
          COUNT("Comment".id) AS "commentCount",
          COUNT("Repost".id) AS "repostCount"
        FROM "Post"
          LEFT JOIN "User" AS "Author" ON "Author".id = "Post"."authorId"
          LEFT JOIN "UserLikePost" ON "UserLikePost"."postId" = "Post".id AND "UserLikePost"."userId" = ${userId}
          LEFT JOIN "Post" AS "Comment" ON "Comment"."parentPostId" = "Post".id
          LEFT JOIN "Post" AS "Repost" ON "Repost"."referredPostId" = "Post".id`

      if (result.count === 0) throw new NotFoundError()

      return true
    },
    {
      headers: t.Object({ authorization: t.String() }),
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      response: {
        200: response200Schema,
        400: t.String(),
        401: t.String(),
        404: t.String(),
      },
    },
  )
}

export type DELETEPostIdBookmarkResponse200 = Static<typeof response200Schema>

const response200Schema = t.Boolean()
