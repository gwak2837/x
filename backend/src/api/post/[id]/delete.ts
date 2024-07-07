import { NotFoundError, t } from 'elysia'
import { BaseElysia } from '../../..'
import { toBigInt } from '../../../utils'
import { PrismaError } from '../../../plugin/prisma'

export default (app: BaseElysia) =>
  app.delete(
    '/post/:id',
    async ({ error, params, prisma, user }) => {
      const postId = toBigInt(params.id)
      const userId = user?.id
      if (!userId) return error(401, 'Unauthorized')

      const deletedPost = await prisma.post
        .update({
          where: { id: postId, authorId: userId },
          data: { deletedAt: new Date() },
        })
        .catch((err) => {
          if (err.code === PrismaError.RECORD_NOT_FOUND) return null
          throw err
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
