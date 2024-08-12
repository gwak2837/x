import { NotFoundError, type Static, t } from 'elysia'

import type { BaseElysia } from '../../..'

import { extractHashtags } from '../../../common/post'
import { MAX_HASHTAG_LENGTH } from '../../../constants'
import { PostCategory, PostStatus } from '../../../model/Post'
import { isValidPostgresBigInt, removeUndefinedKeys } from '../../../utils'

export default (app: BaseElysia) =>
  app.patch(
    '/post/:id',
    async ({ body, error, params, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { category, content, imageURLs, parentPostId, publishAt, referredPostId, status } = body
      if (
        !category &&
        !content &&
        !imageURLs &&
        !parentPostId &&
        !publishAt &&
        !referredPostId &&
        !status
      )
        return error(400, 'Bad Request')

      const { id: postId } = params
      const hashtags = extractHashtags(content)
      const isValidHashtags =
        !hashtags || hashtags.every(({ name }) => name.length <= MAX_HASHTAG_LENGTH)
      const isValidPublishAt = !publishAt || new Date(publishAt) > new Date()
      if (
        !isValidHashtags ||
        !isValidPostgresBigInt(postId) ||
        (parentPostId && !isValidPostgresBigInt(parentPostId)) ||
        (referredPostId && !isValidPostgresBigInt(referredPostId)) ||
        !isValidPublishAt
      )
        return error(400, 'Bad Request')

      const [updatedPost] = await sql<[UpdatedPost]>`
        ${
          hashtags
            ? sql`
        WITH deleted_hashtags AS (
          DELETE FROM "PostHashtag"
          WHERE "postId" = ${postId}
        ),
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
          SELECT ${postId}::bigint, new_hashtags.id
          FROM new_hashtags
          UNION ALL
          SELECT ${postId}::bigint, existing_hashtags.id
          FROM existing_hashtags
        )`
            : sql``
        }
        UPDATE "Post"
        SET 
          "updatedAt" = CURRENT_TIMESTAMP,
          ${sql(
            removeUndefinedKeys({
              category,
              content,
              imageURLs,
              parentPostId,
              publishAt,
              referredPostId,
              status,
            }),
          )}
        WHERE id = ${postId}
          AND "authorId" = ${userId}
        RETURNING id, "updatedAt"`
      if (!updatedPost) throw new NotFoundError()

      return updatedPost
    },
    {
      headers: t.Object({ authorization: t.String() }),
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      body: t.Object({
        category: t.Optional(t.Enum(PostCategory)),
        content: t.Optional(t.String({ maxLength: 10000 })),
        imageURLs: t.Optional(t.Array(t.String())),
        parentPostId: t.Optional(t.String()),
        publishAt: t.Optional(t.String({ format: 'date-time' })),
        referredPostId: t.Optional(t.String()),
        status: t.Optional(t.Enum(PostStatus)),
      }),
      response: {
        200: response200Schema,
        400: t.String(),
        401: t.String(),
        404: t.String(),
      },
    },
  )

export type PATCHPostIdResponse200 = Static<typeof response200Schema>

const response200Schema = t.Object({
  id: t.String(),
  updatedAt: t.Date(),
})

type UpdatedPost = {
  id: string
  updatedAt: Date
}
