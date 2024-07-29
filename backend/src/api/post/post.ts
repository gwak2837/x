import { t } from 'elysia'

import { BaseElysia } from '../..'
import { PostCategory, PostStatus } from '../../model/Post'

export default (app: BaseElysia) =>
  app.post(
    '/post',
    async ({ body, error, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')
      if (!body.content && !body.referredPostId) return error(400, 'Bad request')

      const { publishAt, parentPostId, referredPostId, hashtags } = body
      if (publishAt && new Date(publishAt) < new Date()) return error(400, 'Bad request')

      const [newPost] = await sql<[NewPost]>`
        WITH 
          related_posts AS (
            SELECT "Post".id
            FROM "Post"
            JOIN "User" AS "Author" ON "Author".id = "Post"."authorId"
              LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author".id AND "UserFollow"."followerId" = ${userId}
            WHERE (
              ${parentPostId ? sql`"Post".id = ${parentPostId} OR` : sql``}
              ${referredPostId ? sql`"Post".id = ${referredPostId} OR` : sql``}
              ${parentPostId || referredPostId ? sql`FALSE` : sql`TRUE`}
            ) AND (
              "Post".status = ${PostStatus.PUBLIC} OR
              ("Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL) OR
              ("Post".status = ${PostStatus.PRIVATE} AND "Author".id = ${userId})
            )
          ),
          validation AS (
            SELECT
            ${parentPostId ? sql`EXISTS (SELECT 1 FROM related_posts WHERE id = ${parentPostId})` : sql`TRUE`} AS is_valid_parent,
            ${referredPostId ? sql`EXISTS (SELECT 1 FROM related_posts WHERE id = ${referredPostId})` : sql`TRUE`} AS is_valid_referred
          ),
          new_post AS (
            INSERT INTO "Post" ("publishAt", "category", "status", "content", "authorId", "parentPostId", "referredPostId")
            SELECT ${body.publishAt ?? sql`CURRENT_TIMESTAMP`}, ${body.category ?? null}, ${body.status ?? PostStatus.PUBLIC}, ${body.content ?? null}, ${userId}, ${parentPostId ?? null}, ${referredPostId ?? null}
            FROM validation
            WHERE is_valid_parent AND is_valid_referred
            RETURNING id, "createdAt"
          )
          ${
            hashtags
              ? sql`, 
          hashtags AS (
            INSERT INTO "Hashtag" ${sql(hashtags)}
            ON CONFLICT (name) DO NOTHING
            RETURNING id
          )`
              : sql``
          }
          ${
            hashtags
              ? sql`, 
          post_x_hashtag AS (
            INSERT INTO "PostHashtag" ("postId", "hashtagId")
            SELECT new_post.id, hashtags.id
            FROM new_post, hashtags
          )`
              : sql``
          }
        SELECT id, "createdAt"
        FROM new_post;`

      return newPost
    },
    {
      headers: t.Object({ authorization: t.String() }),
      body: t.Object({
        category: t.Optional(t.Enum(PostCategory)),
        content: t.Optional(t.String()),
        hashtags: t.Optional(t.Array(t.String())),
        imageURLs: t.Optional(t.Array(t.String())),
        parentPostId: t.Optional(t.String()),
        publishAt: t.Optional(t.String({ format: 'date-time' })),
        referredPostId: t.Optional(t.String()),
        status: t.Optional(t.Enum(PostStatus)),
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

type NewPost = {
  id: string
  createdAt: Date
}
