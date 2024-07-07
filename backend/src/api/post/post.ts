import { Prisma } from '@prisma/client'
import { t } from 'elysia'
import { BaseElysia } from '../..'
import { PostStatus } from '../../model/Post'

export default (app: BaseElysia) =>
  app.post(
    '/post',
    async ({ body, error, prisma, user }) => {
      if (!user) return error(401, 'Unauthorized')

      const { publishAt } = body
      const userId = user.id

      if (publishAt && new Date(publishAt) < new Date()) return error(400, 'Bad request')

      const parentPostId = body.parentPostId
      const referredPostId = body.referredPostId

      const relatedPosts = await prisma.$queryRaw<{ id: bigint }[]>`
        SELECT "Post".id
        FROM "Post"
          LEFT JOIN "User" AS "Author" ON  "Author".id = "Post"."authorId"
          LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author"."id" AND "UserFollow"."followerId" = ${userId}::uuid
        WHERE "Post".id IN (${Prisma.join([parentPostId, referredPostId])}) AND (
          "Post".status = ${PostStatus.PUBLIC} OR 
          "Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL OR
          "Post".status = ${PostStatus.PRIVATE} AND "Author".id = ${userId}::uuid
        );`

      const postIds = relatedPosts.map((post) => post.id)
      if (
        (parentPostId && !postIds.includes(parentPostId)) ||
        (referredPostId && !postIds.includes(referredPostId))
      )
        return error(403, 'Forbidden')

      // 동시성: 아래 SQL을 처리하는 도중, 팔로우를 끊거나 비공개 처리한 글을 참조해도 이 글이 써질 수 있다
      const createdPost = await prisma.post.create({
        data: {
          publishAt: body.publishAt,
          status: body.status,
          content: body.content,
          authorId: userId,
          parentPostId,
          referredPostId,
        },
        select: {
          id: true,
          createdAt: true,
        },
      })

      return createdPost
    },
    {
      body: t.Object({
        content: t.String(),
        imageURLs: t.Optional(t.Array(t.String())),
        parentPostId: t.Optional(t.BigInt()),
        publishAt: t.Optional(t.String({ format: 'date-time' })),
        referredPostId: t.Optional(t.BigInt()),
        status: t.Optional(t.Number()),
      }),
      response: {
        200: t.Object({
          id: t.BigInt(),
          createdAt: t.Date(),
        }),
        400: t.String(),
        401: t.String(),
        403: t.String(),
      },
    },
  )
