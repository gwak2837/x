import { NotFoundError, t } from 'elysia'

import { BaseElysia } from '../../..'
import { PostStatus } from '../../../model/Post'
import { toBigInt } from '../../../utils'

export default (app: BaseElysia) =>
  app.get(
    '/post/:id',
    async ({ params, prisma, userId }) => {
      const postId = toBigInt(params.id)

      const [post] = await prisma.$queryRaw<[PostQuery?]>`
        SELECT "Post".id,
          "Post"."createdAt",
          "Post"."updatedAt",
          "Post"."deletedAt",
          "Post"."publishAt",
          "Post".status,
          "Post".content,
          "Post"."imageURLs",
          "Author".id AS "author_id",
          "Author".name AS "author_name",
          "Author".nickname AS "author_nickname",
          "Author"."profileImageURLs" AS "author_profileImageURLs",
          "ReferredPost".id AS "referredPost_id",
          "ReferredPost"."createdAt" AS "referredPost_createdAt",
          "ReferredPost"."updatedAt" AS "referredPost_updatedAt",
          "ReferredPost"."deletedAt" AS "referredPost_deletedAt",
          "ReferredPost"."publishAt" AS "referredPost_publishAt",
          "ReferredPost".status AS "referredPost_status",
          "ReferredPost".content AS "referredPost_content",
          "ReferredPost"."imageURLs" AS "referredPost_imageURLs",
          "ReferredPostAuthor".id AS "referredPostAuthor_id",
          "ReferredPostAuthor".name AS "referredPostAuthor_name",
          "ReferredPostAuthor".nickname AS "referredPostAuthor_nickname",
          "ReferredPostAuthor"."profileImageURLs" AS "referredPostAuthor_profileImageURLs"
        FROM "Post"
          LEFT JOIN "User" AS "Author" ON "Author".id = "Post"."authorId"
          LEFT JOIN "Post" AS "ReferredPost" ON "ReferredPost".id = "Post"."referredPostId"
          LEFT JOIN "User" AS "ReferredPostAuthor" ON "ReferredPostAuthor".id = "ReferredPost"."authorId"
          LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author".id AND "UserFollow"."followerId" = ${userId}
        WHERE "Post".id = ${postId} AND (
          "Post"."authorId" = ${userId} OR
          "Post"."publishAt" < CURRENT_TIMESTAMP AND (
            "Post".status = ${PostStatus.PUBLIC} OR 
            "Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL
          ));`
      if (!post) throw new NotFoundError()

      const isAuthor = userId === post.author_id
      const isReferredAuthor = userId === post.referredPostAuthor_id

      return {
        id: post.id.toString(),
        createdAt: isAuthor ? post.createdAt ?? undefined : undefined,
        updatedAt: post.updatedAt ?? undefined,
        deletedAt: post.deletedAt ?? undefined,
        publishAt: post.publishAt,
        status: isAuthor ? post.status : undefined,
        content: post.content ?? undefined,
        imageURLs: post.imageURLs ?? undefined,
        ...(post.author_id && {
          author: {
            id: post.author_id.toString(),
            name: post.author_name ?? undefined,
            nickname: post.author_nickname ?? undefined,
            profileImageURLs: post.author_profileImageURLs ?? undefined,
          },
        }),
        ...(post.referredPost_id && {
          referredPost: {
            id: post.referredPost_id.toString(),
            createdAt: isReferredAuthor ? post.referredPost_createdAt ?? undefined : undefined,
            updatedAt: post.referredPost_updatedAt ?? undefined,
            deletedAt: post.referredPost_deletedAt ?? undefined,
            publishAt: post.referredPost_publishAt ?? undefined,
            status: isReferredAuthor ? post.referredPost_status ?? undefined : undefined,
            content: post.referredPost_content ?? undefined,
            imageURLs: post.referredPost_imageURLs ?? undefined,
            ...(post.referredPostAuthor_id && {
              author: {
                id: post.referredPostAuthor_id.toString(),
                name: post.referredPostAuthor_name ?? undefined,
                nickname: post.referredPostAuthor_nickname ?? undefined,
                profileImageURLs: post.referredPostAuthor_profileImageURLs ?? undefined,
              },
            }),
          },
        }),
      }
    },
    {
      params: t.Object({ id: t.String() }),
      response: {
        200: t.Object({
          ...postSchema,
          referredPost: t.Optional(t.Object(postSchema)),
        }),
        404: t.String(),
      },
    },
  )

export type PostQuery = {
  id: bigint
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
  publishAt: Date
  status: number
  content: string | null
  imageURLs: string[] | null
  author_id: bigint | null
  author_name: string | null
  author_nickname: string | null
  author_profileImageURLs: string[] | null
  referredPost_id: bigint | null
  referredPost_createdAt: Date | null
  referredPost_updatedAt: Date | null
  referredPost_deletedAt: Date | null
  referredPost_publishAt: Date | null
  referredPost_status: number | null
  referredPost_content: string | null
  referredPost_imageURLs: string[] | null
  referredPostAuthor_id: bigint | null
  referredPostAuthor_name: string | null
  referredPostAuthor_nickname: string | null
  referredPostAuthor_profileImageURLs: string[] | null
}

const postSchema = {
  id: t.String(),
  createdAt: t.Optional(t.Date()),
  updatedAt: t.Optional(t.Date()),
  deletedAt: t.Optional(t.Date()),
  publishAt: t.Optional(t.Date()),
  status: t.Optional(t.Integer()),
  content: t.Optional(t.String()),
  imageURLs: t.Optional(t.Array(t.String())),
  author: t.Optional(
    t.Object({
      id: t.Optional(t.String({ format: 'uuid' })),
      name: t.Optional(t.String()),
      nickname: t.Optional(t.String()),
      profileImageURLs: t.Optional(t.Array(t.String())),
    }),
  ),
}
