import { t } from 'elysia'

import { BaseElysia } from '../..'
import { PostCategory, PostStatus } from '../../model/Post'
import { POSTGRES_MAX_BIGINT } from '../../plugin/postgres'
import { deeplyRemoveNull } from '../../utils'
import { removeZero } from '../../utils/type'

export default (app: BaseElysia) =>
  app.get(
    '/post',
    async ({ error, query, sql, userId }) => {
      const { category, cursor = POSTGRES_MAX_BIGINT, limit = 30, only = PostsOnly.OTHERS } = query

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
          "ReferredPost".category AS "referredPost_category",
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
          ${category !== undefined ? sql`"Post".category = ${category} AND` : sql``}
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

      return posts.map((post) =>
        deeplyRemoveNull({
          id: post.id,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          publishAt: post.publishAt,
          status: post.status,
          content: post.content,
          imageURLs: post.imageURLs,
          ...(post.author_id && {
            author: {
              id: post.author_id,
              name: post.author_name!,
              nickname: post.author_nickname!,
              profileImageURLs: post.author_profileImageURLs,
            },
          }),
          ...(post.referredPost_id && {
            referredPost: {
              id: post.referredPost_id,
              createdAt: post.referredPost_createdAt!,
              updatedAt: post.referredPost_updatedAt,
              deletedAt: post.referredPost_deletedAt,
              publishAt: post.referredPost_publishAt!,
              category: post.referredPost_category,
              status: post.referredPost_status!,
              content: post.referredPost_content,
              imageURLs: post.referredPost_imageURLs,
              ...(post.referredPostAuthor_id && {
                author: {
                  id: post.referredPostAuthor_id,
                  name: post.referredPostAuthor_name!,
                  nickname: post.referredPostAuthor_nickname!,
                  profileImageURLs: post.referredPostAuthor_profileImageURLs,
                },
              }),
            },
          }),
          likedByMe: post.likedByMe === 1 || undefined,
          likeCount: removeZero(post.likeCount),
          commentCount: removeZero(post.commentCount),
          repostCount: removeZero(post.repostCount),
        }),
      )
    },
    {
      headers: t.Object({ authorization: t.Optional(t.String()) }),
      query: t.Object({
        category: t.Optional(t.Enum(PostCategory)),
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.Number()),
        only: t.Optional(t.Enum(PostsOnly)),
      }),
      response: {
        200: t.Array(postSchema),
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

type PostRow = {
  id: string
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
  publishAt: Date
  category: PostCategory | null
  status: PostStatus
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
  referredPost_category: PostCategory | null
  referredPost_status: PostStatus | null
  referredPost_content: string | null
  referredPost_imageURLs: string[] | null
  referredPostAuthor_id: string | null
  referredPostAuthor_name: string | null
  referredPostAuthor_nickname: string | null
  referredPostAuthor_profileImageURLs: string[] | null
  likedByMe: 0 | 1
  likeCount: string
  commentCount: string
  repostCount: string
}

const post = {
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Optional(t.Date()),
  publishAt: t.Date(),
  status: t.Enum(PostStatus),
  content: t.Optional(t.String()),
  imageURLs: t.Optional(t.Array(t.String())),
  author: t.Optional(
    t.Object({
      id: t.String(),
      name: t.String(),
      nickname: t.String(),
      profileImageURLs: t.Optional(t.Array(t.String())),
    }),
  ),
}

const postSchema = t.Object({
  ...post,
  referredPost: t.Optional(
    t.Object({
      ...post,
      category: t.Optional(t.Enum(PostCategory)),
    }),
  ),
  likedByMe: t.Optional(t.Literal(true)),
  likeCount: t.Optional(t.String()),
  commentCount: t.Optional(t.String()),
  repostCount: t.Optional(t.String()),
})
