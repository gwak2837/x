import { InternalServerError, NotFoundError, t } from 'elysia'
import { BaseElysia } from '../../..'
import { toBigInt } from '../../../utils'
import { PrismaError } from '../../../plugin/prisma'

export default (app: BaseElysia) =>
  app.delete(
    '/post/:id',
    async ({ error, params, prisma, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const postId = toBigInt(params.id)
      const deletedPost = await prisma.post
        .update({
          where: { id: postId, authorId: userId },
          data: { deletedAt: new Date(), content: null, imageURLs: [], referredPostId: null },
        })
        .catch((err) => {
          if (err.code === PrismaError.RECORD_NOT_FOUND) return null
          throw new InternalServerError()
        })
      if (!deletedPost) throw new NotFoundError()

      return {
        id: deletedPost.id.toString(),
        deletedAt: deletedPost.deletedAt!,
      }
    },
    {
      params: t.Object({ id: t.String() }),
      response: {
        200: t.Object({
          id: t.String(),
          deletedAt: t.Optional(t.Date()),
        }),
        401: t.String(),
        404: t.String(),
      },
    },
  )
