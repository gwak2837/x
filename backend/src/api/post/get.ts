import { t } from 'elysia'

import { BaseElysia } from '../..'
import { POSTGRES_MAX_BIGINT } from '../../model'
import { PostStatus } from '../../model/Post'

export default (app: BaseElysia) =>
  app.get(
    '/post',
    async ({ error, query, sql, userId }) => {
      const { cursor = POSTGRES_MAX_BIGINT, limit = 30, only = PostsOnly.OTHERS } = query
      if (!userId && (only === PostsOnly.MINE || only === PostsOnly.FOLLOWING))
        return error(400, 'Bad Request')

      const posts = await sql<Post[]>`
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
          JOIN "User" AS "Author" ON  "Author".id = "Post"."authorId"
          LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author"."id" AND "UserFollow"."followerId" = ${userId}
        WHERE "Post".id < ${cursor} AND 
          "Post"."deletedAt" IS NULL AND
          "Post"."publishAt" <= CURRENT_TIMESTAMP AND (
            ${userId && only === PostsOnly.MINE ? sql`"Post"."authorId" = ${userId}` : ''}
            ${userId && only === PostsOnly.FOLLOWING ? sql`"UserFollow"."followerId" = ${userId}` : ''}
            ${userId && only === PostsOnly.OTHERS ? sql`"Post"."authorId" != ${userId}` : ''}
            ${!userId && only === PostsOnly.OTHERS ? 'TRUE' : ''}
          ) AND (
            ${userId && only === PostsOnly.MINE ? 'TRUE OR' : ''}
            "Post".status = ${PostStatus.PUBLIC} OR 
            "Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL
          )
        ORDER BY "Post".id DESC
        LIMIT ${limit};`

      return posts
    },
    {
      query: t.Object({
        cursor: t.String(),
        limit: t.Number(),
        only: t.Enum(PostsOnly),
        userId: t.Optional(t.String()),
      }),
    },
  )

export enum PostsOnly {
  OTHERS = 'others',
  FOLLOWING = 'following',
  MINE = 'mine',
}

type Post = {
  id: string
}
