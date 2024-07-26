import { NotFoundError, t } from 'elysia'

import { BaseElysia } from '../../..'
import { PostStatus } from '../../../model/Post'
import { recursivelyRemoveNull } from '../../../utils'

export default (app: BaseElysia) =>
  app.get(
    '/post/:id',
    async ({ params, sql, userId }) => {
      const { id: postId } = params

      const [post] = await sql<[PostRow]>`
        SELECT "Post".id,
          "Post"."createdAt",
          "Post"."updatedAt",
          "Post"."deletedAt",
          "Post"."publishAt",
          "Post".category,
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

      return recursivelyRemoveNull({
        id: post.id,
        createdAt: isAuthor ? post.createdAt : undefined,
        updatedAt: post.updatedAt,
        deletedAt: post.deletedAt,
        publishAt: post.publishAt,
        status: isAuthor ? post.status : undefined,
        content: post.content,
        imageURLs: post.imageURLs,
        ...(post.author_id && {
          author: {
            id: post.author_id,
            name: post.author_name,
            nickname: post.author_nickname,
            profileImageURLs: post.author_profileImageURLs,
          },
        }),
        ...(post.referredPost_id && {
          referredPost: {
            id: post.referredPost_id,
            createdAt: isReferredAuthor ? post.referredPost_createdAt : undefined,
            updatedAt: post.referredPost_updatedAt,
            deletedAt: post.referredPost_deletedAt,
            publishAt: post.referredPost_publishAt,
            status: isReferredAuthor ? post.referredPost_status : undefined,
            content: post.referredPost_content,
            imageURLs: post.referredPost_imageURLs,
            ...(post.referredPostAuthor_id && {
              author: {
                id: post.referredPostAuthor_id,
                name: post.referredPostAuthor_name,
                nickname: post.referredPostAuthor_nickname,
                profileImageURLs: post.referredPostAuthor_profileImageURLs,
              },
            }),
          },
        }),
      })
    },
    {
      params: t.Object({ id: t.String() }),
      response: {
        200: postSchema,
        404: t.String(),
      },
    },
  )

export type PostRow = {
  id: string
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
  publishAt: Date
  category: number
  status: number
  content: string | null
  imageURLs: string[] | null
  author_id: string | null
  author_name: string | null
  author_nickname: string | null
  author_profileImageURLs: string[] | null
  referredPost_id: string | null
  referredPost_createdAt: Date | null
  referredPost_updatedAt: Date | null
  referredPost_deletedAt: Date | null
  referredPost_publishAt: Date | null
  referredPost_status: number | null
  referredPost_content: string | null
  referredPost_imageURLs: string[] | null
  referredPostAuthor_id: string | null
  referredPostAuthor_name: string | null
  referredPostAuthor_nickname: string | null
  referredPostAuthor_profileImageURLs: string[] | null
}

const post = {
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

const postSchema = t.Object({
  ...post,
  referredPost: t.Optional(t.Object(post)),
})
