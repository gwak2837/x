import { Static, t } from 'elysia'

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

      const [newPost] = await sql<[NewPost]>`
        WITH 
          related_posts AS (
            SELECT "Post".id
            FROM "Post"
            JOIN "User" AS "Author" ON "Author".id = "Post"."authorId"
              LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author".id AND "UserFollow"."followerId" = ${userId}::uuid
            WHERE (
              ${parentPostId ? sql`"Post".id = ${parentPostId} OR` : ''}
              ${referredPostId ? sql`"Post".id = ${referredPostId} OR` : ''}
              ${parentPostId || referredPostId ? 'FALSE' : 'TRUE'}
            ) AND (
              "Post".status = ${PostStatus.PUBLIC} OR
              ("Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL) OR
              ("Post".status = ${PostStatus.PRIVATE} AND "Author".id = ${userId})
            )
          ),
          validation AS (
            SELECT
              ${parentPostId ? sql`EXISTS (SELECT 1 FROM related_posts WHERE id = ${parentPostId})` : 'TRUE'} AS is_valid_parent,
              ${referredPostId ? sql`EXISTS (SELECT 1 FROM related_posts WHERE id = ${referredPostId})` : 'TRUE'} AS is_valid_referred,
          )
        INSERT INTO "Post" ("publishAt", "status", "content", "authorId", "parentPostId", "referredPostId")
        SELECT ${body.publishAt ?? 'DEFAULT'}, ${body.status ?? 'DEFAULT'}, ${body.content}, ${userId}, ${parentPostId ?? 'DEFAULT'}, ${referredPostId ?? 'DEFAULT'}
        FROM validation
        WHERE is_valid_parent AND is_valid_referred
        RETURNING id, "createdAt";`

      return newPost
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
        200: newPostSchema,
        400: t.String(),
        401: t.String(),
        403: t.String(),
      },
    },
  )

type NewPost = Static<typeof newPostSchema>

const newPostSchema = t.Object({
  id: t.String(),
  createdAt: t.Date(),
})
