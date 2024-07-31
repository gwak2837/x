import { NotFoundError, t } from 'elysia'

import { BaseElysia } from '../../..'
import { PostCategory, PostStatus } from '../../../model/Post'

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
        return error(400, 'Bad request')

      const { id: postId } = params
      if (isNaN(+postId) || !isFinite(+postId)) return error(400, 'Bad request')

      const [updatedPost] = await sql<[UpdatedPost]>`
        UPDATE "Post"
        SET 
          "updatedAt" = CURRENT_TIMESTAMP,
          ${sql({
            category,
            content,
            imageURLs,
            parentPostId,
            publishAt,
            referredPostId,
            status,
          })}
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
          updatedAt: t.Date(),
        }),
        400: t.String(),
        401: t.String(),
        404: t.String(),
      },
    },
  )

type UpdatedPost = {
  id: string
  updatedAt: Date
}
