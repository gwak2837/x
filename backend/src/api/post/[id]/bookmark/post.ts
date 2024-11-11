import type { BaseElysia } from '@/index'

import { isValidPostgresBigInt } from '@/util'
import { NotFoundError, type Static, t } from 'elysia'

export default function POSTPostIdBookmark(app: BaseElysia) {
  return app.post(
    '/post/:id/bookmark',
    async ({ error, params, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { id: postId } = params
      if (!isValidPostgresBigInt(postId)) return error(400, 'Bad Request')

      const result = await sql`
        INSERT INTO "UserBookmarkPost" ${sql({ userId, postId })}
        ON CONFLICT DO NOTHING`

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

export type POSTPostIdBookmarkResponse200 = Static<typeof response200Schema>

const response200Schema = t.Boolean()
