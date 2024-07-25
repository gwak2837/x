import { Static, t } from 'elysia'

import { BaseElysia } from '../..'
import { POSTGRES_MAX_BIGINT } from '../../model'
import { PostStatus } from '../../model/Post'
import { removeNull } from '../../utils'

export default (app: BaseElysia) =>
  app.get(
    '/post',
    async ({ error, query, sql, userId }) => {
      const { cursor = POSTGRES_MAX_BIGINT, limit = 30, only = PostsOnly.OTHERS } = query
      if (!userId && (only === PostsOnly.MINE || only === PostsOnly.FOLLOWING))
        return error(400, 'Bad Request')

      const posts = await sql<PostRow[]>`
        SELECT "Post".id,
          "Post"."createdAt",
          "Post"."updatedAt",
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
          "ReferredAuthor".id AS "referredAuthor_id",
          "ReferredAuthor".name AS "referredAuthor_name",
          "ReferredAuthor".nickname AS "referredAuthor_nickname",
          "ReferredAuthor"."profileImageURLs" AS "referredAuthor_profileImageURLs"
        FROM "Post"
          JOIN "User" AS "Author" ON  "Author".id = "Post"."authorId"
          LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author"."id" AND "UserFollow"."followerId" = ${userId}
          LEFT JOIN "Post" AS "ReferredPost" ON "ReferredPost".id = "Post"."referredPostId"
          LEFT JOIN "User" AS "ReferredAuthor" ON "ReferredAuthor".id = "ReferredPost"."authorId"
        WHERE "Post".id < ${cursor} AND 
          "Post"."deletedAt" IS NULL AND
          "Post"."publishAt" <= CURRENT_TIMESTAMP AND (
            ${userId && only === PostsOnly.MINE ? sql`"Post"."authorId" = ${userId}` : sql``}
            ${userId && only === PostsOnly.FOLLOWING ? sql`"UserFollow"."followerId" = ${userId}` : sql``}
            ${userId && only === PostsOnly.OTHERS ? sql`"Post"."authorId" != ${userId}` : sql``}
            ${!userId && only === PostsOnly.OTHERS ? sql`TRUE` : sql``}
          ) AND (
            ${userId && only === PostsOnly.MINE ? sql`TRUE OR` : sql``}
            "Post".status = ${PostStatus.PUBLIC} OR 
            "Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL
          )
        ORDER BY "Post".id DESC
        LIMIT ${limit};`
      if (!posts.length) return error(404, 'Not Found')

      return posts.map(removeNull)
    },
    {
      headers: t.Object({ authorization: t.Optional(t.String()) }),
      query: t.Object({
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.Number()),
        only: t.Optional(t.Enum(PostsOnly)),
      }),
      response: {
        200: t.Array(postRowSchema),
        400: t.String(),
        404: t.String(),
      },
    },
  )

export enum PostsOnly {
  OTHERS = 'others',
  FOLLOWING = 'following',
  MINE = 'mine',
}

type PostRow = Static<typeof postRowSchema>

const postRowSchema = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Optional(t.Date()),
  publishAt: t.Date(),
  status: t.Number(),
  content: t.String(),
  imageURLs: t.Optional(t.Array(t.String())),
  author_id: t.String(),
  author_name: t.String(),
  author_nickname: t.String(),
  author_profileImageURLs: t.Optional(t.Array(t.String())),
  referredPost_id: t.Optional(t.String()),
  referredPost_createdAt: t.Optional(t.Date()),
  referredPost_updatedAt: t.Optional(t.Date()),
  referredPost_deletedAt: t.Optional(t.Date()),
  referredPost_publishAt: t.Optional(t.Date()),
  referredPost_status: t.Optional(t.Number()),
  referredPost_content: t.Optional(t.String()),
  referredPost_imageURLs: t.Optional(t.Array(t.String())),
  referredAuthor_id: t.Optional(t.String()),
  referredAuthor_name: t.Optional(t.String()),
  referredAuthor_nickname: t.Optional(t.String()),
  referredAuthor_profileImageURLs: t.Optional(t.Array(t.String())),
})
