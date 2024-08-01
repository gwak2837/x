import { NotFoundError, t } from 'elysia'

import { BaseElysia } from '../../..'

export default (app: BaseElysia) =>
  app.delete(
    '/post/:id',
    async ({ error, params, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { id: postId } = params

      const [deletedPost] = await sql<[DeletedPost]>`
        WITH deleted_hashtag AS (
          DELETE FROM "PostHashtag"
          WHERE "postId" = ${postId}
        )
        UPDATE "Post"
        SET "deletedAt" = CURRENT_TIMESTAMP,
            content = NULL,
            "imageURLs" = NULL,
            "referredPostId" = NULL
        WHERE id = ${postId}
          AND "authorId" = ${userId}
        RETURNING id, "deletedAt"`
      if (!deletedPost) throw new NotFoundError()

      return deletedPost
    },
    {
      headers: t.Object({ authorization: t.String() }),
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      response: {
        200: t.Object({
          id: t.String(),
          deletedAt: t.Date(),
        }),
        400: t.String(),
        401: t.String(),
        404: t.String(),
      },
    },
  )

type DeletedPost = {
  id: string
  deletedAt: Date
}
