import { NotFoundError, type Static, t } from 'elysia'

import type { BaseElysia } from '../../..'

import { isValidPostgresBigIntString } from '../../../utils'

export default (app: BaseElysia) =>
  app.delete(
    '/post/:id',
    async ({ error, params, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { id: postId } = params
      if (!isValidPostgresBigIntString(postId)) return error(400, 'Bad Request')

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
        200: response200Schema,
        400: t.String(),
        401: t.String(),
        404: t.String(),
      },
    },
  )

export type DELETEPostIdResponse200 = Static<typeof response200Schema>

const response200Schema = t.Object({
  id: t.String(),
  deletedAt: t.Date(),
})

type DeletedPost = {
  id: string
  deletedAt: Date
}
