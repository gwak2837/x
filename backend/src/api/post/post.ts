import { t } from 'elysia'

import { BaseElysia } from '../..'
import { PostStatus } from '../../model/Post'

export default (app: BaseElysia) =>
  app.post(
    '/post',
    async ({ body, error, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { publishAt } = body
      if (publishAt && new Date(publishAt) < new Date()) return error(400, 'Bad request')

      const parentPostId = body.parentPostId
      const referredPostId = body.referredPostId

      return await sql<PostRow>`
        WITH 
          RelatedPosts AS (
            SELECT "Post".id
            FROM "Post"
            JOIN "User" AS "Author" ON "Author".id = "Post"."authorId"
              LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author".id AND "UserFollow"."followerId" = ${userId}::uuid
            WHERE (
              ${parentPostId && sql`"Post".id = ${parentPostId} OR`}
              ${referredPostId && sql`"Post".id = ${referredPostId} OR`}
              ${parentPostId || referredPostId ? 'FALSE' : 'TRUE'}
            ) AND (
              "Post".id = ${parentPostId} OR "Post".id = ${referredPostId}) AND (
              "Post".status = ${PostStatus.PUBLIC} OR
              ("Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL) OR
              ("Post".status = ${PostStatus.PRIVATE} AND "Author".id = ${userId})
            )
          ),
          Validation AS (
            SELECT
              ${parentPostId} IS NULL OR EXISTS (SELECT 1 FROM RelatedPosts WHERE id = ${parentPostId}) AS isValidParent,
              ${referredPostId} IS NULL OR EXISTS (SELECT 1 FROM RelatedPosts WHERE id = ${referredPostId}) AS isValidReferred
          )
        INSERT INTO "Post" ("publishAt", "status", "content", "authorId", "parentPostId", "referredPostId")
        SELECT ${body.publishAt}, ${body.status}, ${body.content}, ${userId}, ${parentPostId}, ${referredPostId}
        FROM Validation
        WHERE isValidParent AND isValidReferred
        RETURNING id, "createdAt";`
    },
    {
      headers: t.Object({ authorization: t.String() }),
      body: t.Object({
        content: t.String(),
        imageURLs: t.Optional(t.Array(t.String())),
        parentPostId: t.Optional(t.String()),
        publishAt: t.Optional(t.String({ format: 'date-time' })),
        referredPostId: t.Optional(t.String()),
        status: t.Optional(t.Number()),
      }),
      response: {
        200: t.Object({
          id: t.String(),
          createdAt: t.Date(),
        }),
        400: t.String(),
        401: t.String(),
        403: t.String(),
      },
    },
  )

type PostRow = {
  id: string
  createdAt: Date
}
