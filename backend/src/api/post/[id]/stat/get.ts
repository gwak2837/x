import type { BaseElysia } from '@/index'

import { isValidPostgresBigInt } from '@/util'
import { removeZero } from '@/util/type'
import { NotFoundError, type Static, t } from 'elysia'

export default function GETPostIdStat(app: BaseElysia) {
  return app.get(
    '/post/:id/stat',
    async ({ error, params, sql, userId }) => {
      const { id: postId } = params
      if (!isValidPostgresBigInt(postId)) return error(400, 'Bad Request')

      const [postStat] = await sql<[Row]>`
        SELECT
          COUNT("UserLikePost"."postId") AS "likeCount",
          ${userId ? sql`(CASE WHEN "UserLikePost"."userId" IS NOT NULL THEN 1 ELSE 0 END) AS "likedByMe",` : sql``}
          COUNT("Comment".id) AS "commentCount",
          COUNT("Repost".id) AS "repostCount"
        FROM "Post"
          LEFT JOIN "UserLikePost" ON "UserLikePost"."postId" = "Post".id ${userId ? sql`AND "UserLikePost"."userId" = ${userId}` : sql``}
          LEFT JOIN "Post" AS "Comment" ON "Comment"."parentPostId" = "Post".id
          LEFT JOIN "Post" AS "Repost" ON "Repost"."referredPostId" = "Post".id
        WHERE "Post".id = ${postId}
        GROUP BY "UserLikePost"."userId"`
      if (!postStat) throw new NotFoundError()

      return {
        likedByMe: postStat.likedByMe === 1 || undefined,
        likeCount: removeZero(postStat.likeCount),
        commentCount: removeZero(postStat.commentCount),
        repostCount: removeZero(postStat.repostCount),
      }
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

type Row = {
  likedByMe: 0 | 1
  likeCount: string
  commentCount: string
  repostCount: string
}

const response200Schema = t.Object({
  likedByMe: t.Optional(t.Literal(true)),
  likeCount: t.Optional(t.String()),
  commentCount: t.Optional(t.String()),
  repostCount: t.Optional(t.String()),
})

export type GETPostIdStat = Static<typeof response200Schema>
