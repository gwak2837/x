import { POSTGRES_MAX_BIGINT } from '../../plugin/prisma'
import { BaseElysia } from '../..'
import { PostStatus } from '../../model/Post'
import { t } from 'elysia'

export default (app: BaseElysia) =>
  app.get(
    '/post',
    async ({ prisma, query, userId }) => {
      const { cursor = POSTGRES_MAX_BIGINT, limit = 30 /* only = PostsOnly.ALL */ } = query

      const posts = await prisma.$queryRaw<Post[]>`
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
          "ReferredAuthor".id AS "referredAuthor_id",
          "ReferredAuthor".name AS "referredAuthor_name",
          "ReferredAuthor".nickname AS "referredAuthor_nickname",
          "ReferredAuthor"."profileImageURLs" AS "referredAuthor_profileImageURLs",
        FROM "Post"
          LEFT JOIN "User" AS "Author" ON  "Author".id = "Post"."authorId"
          LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author"."id" AND "UserFollow"."followerId" = ${userId}::uuid
        WHERE "Post".id < ${cursor} AND 
          "Post"."publishAt" <= CURRENT_TIMESTAMP AND 
          "Post"."authorId" != ${userId}::uuid AND (
            "Post".status = ${PostStatus.PUBLIC} OR 
            "Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL
          )
        ORDER BY "Post".id DESC
        LIMIT ${limit};`

      return posts
    },
    {
      query: t.Object({
        cursor: t.BigInt(),
        limit: t.Number(),
        userId: t.Optional(t.String()),
        only: t.Enum(PostsOnly),
      }),
    },
  )

export enum PostsOnly {
  MINE = 'mine',
  FOLLOWING = 'following',
  ALL = 'all',
}

type Post = {
  id: bigint
}
