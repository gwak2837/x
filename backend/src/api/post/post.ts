import { t } from 'elysia'

import { BaseElysia } from '../..'
import { MAX_HASHTAG_LENGTH } from '../../constants'
import { PostCategory, PostStatus } from '../../model/Post'

export default (app: BaseElysia) =>
  app.post(
    '/post',
    async ({ body, error, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { category, content, parentPostId, publishAt, referredPostId, status } = body
      const isValidReferringPost = content || referredPostId
      const isValidPublishAt = !publishAt || new Date(publishAt) > new Date()
      const isValidReferringComment =
        !parentPostId || !referredPostId || parentPostId !== referredPostId
      const hashtags = content
        ?.match(/#[\p{L}\p{N}\p{M}_]+/gu)
        ?.map((tag) => ({ name: tag.slice(1) }))
      const isValidHashtags =
        !hashtags || hashtags.every(({ name }) => name.length <= MAX_HASHTAG_LENGTH)

      if (
        !isValidReferringPost ||
        !isValidPublishAt ||
        !isValidReferringComment ||
        !isValidHashtags
      )
        return error(400, 'Bad Request')

      const [newPost] = await sql<[NewPost]>`
        WITH 
          related_posts AS (
            SELECT "Post".id
            FROM "Post"
            JOIN "User" AS "Author" ON "Author".id = "Post"."authorId"
              LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author".id AND "UserFollow"."followerId" = ${userId}
            WHERE "Post"."publishAt" < CURRENT_TIMESTAMP AND 
              "Post"."deletedAt" IS NULL AND (
              ${parentPostId ? sql`"Post".id = ${parentPostId} OR` : sql``}
              ${referredPostId ? sql`"Post".id = ${referredPostId} OR` : sql``}
              ${parentPostId || referredPostId ? sql`FALSE` : sql`TRUE`}
            ) AND (
              "Post".status = ${PostStatus.PUBLIC} OR
              "Post".status = ${PostStatus.ANNONYMOUS} OR
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
            SELECT ${publishAt ?? sql`CURRENT_TIMESTAMP`}, ${category ?? null}, ${status ?? PostStatus.PUBLIC}, ${content ?? null}, ${userId}, ${parentPostId ?? null}, ${referredPostId ?? null}
            FROM validation
            WHERE is_valid_parent AND is_valid_referred
            RETURNING id, "createdAt"
          )
          ${
            hashtags
              ? sql`, 
          new_hashtags AS (
            INSERT INTO "Hashtag" ${sql(hashtags)}
            ON CONFLICT (name) DO NOTHING
            RETURNING id
          ),
          existing_hashtags AS (
            SELECT id
            FROM "Hashtag"
            WHERE name IN ${sql(hashtags.map(({ name }) => name))}
          ),
          post_x_hashtag AS (
            INSERT INTO "PostHashtag" ("postId", "hashtagId")
            SELECT new_post.id, new_hashtags.id
            FROM new_post, new_hashtags
            UNION ALL
            SELECT new_post.id, existing_hashtags.id
            FROM new_post, existing_hashtags
          )`
              : sql``
          }
        SELECT id, "createdAt"
        FROM new_post;`
      if (!newPost) return error(400, 'Bad Request')

      return newPost
    },
    {
      headers: t.Object({ authorization: t.String() }),
      body: t.Object({
        category: t.Optional(t.Enum(PostCategory)),
        content: t.Optional(t.String()),
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
