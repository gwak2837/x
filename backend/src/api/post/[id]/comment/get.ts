import { t } from 'elysia'

import { BaseElysia } from '../../../..'

export default (app: BaseElysia) =>
  app.patch(
    '/post/:id',
    async ({ error, params, sql, userId }) => {
      const { id: postId } = params
      if (isNaN(+postId)) return error(400, 'Bad request')
    },
    {
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      response: {
        // 200: postSchema,
        400: t.String(),
        404: t.String(),
      },
    },
  )
