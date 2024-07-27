import { t } from 'elysia'

import { BaseElysia } from '../../../..'
import { PostCategory, PostStatus } from '../../../../model/Post'
import { POSTGRES_MAX_BIGINT } from '../../../../plugin/postgres'
import { deeplyRemoveNull } from '../../../../utils'
import { removeZero } from '../../../../utils/type'

export default (app: BaseElysia) =>
  app.get(
    '/post/:id/comment',
    async ({ error, params, query, sql, userId }) => {
      const { id: postId } = params
      if (isNaN(+postId)) return error(400, 'Bad request')

      const { cursor = POSTGRES_MAX_BIGINT, limit = 30 } = query

      const comments = await sql<CommentRow[]>`
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
          "ReferredPost".category AS "referredPost_category",
          "ReferredPost".status AS "referredPost_status",
          "ReferredPost".content AS "referredPost_content",
          "ReferredPost"."imageURLs" AS "referredPost_imageURLs",
          "ReferredPostAuthor".id AS "referredPostAuthor_id",
          "ReferredPostAuthor".name AS "referredPostAuthor_name",
          "ReferredPostAuthor".nickname AS "referredPostAuthor_nickname",
          "ReferredPostAuthor"."profileImageURLs" AS "referredPostAuthor_profileImageURLs",
          MAX(CASE WHEN "UserLikePost"."userId" = ${userId} THEN 1 ELSE 0 END) AS "likedByMe",
          COUNT("UserLikePost"."postId") AS "likeCount",
          COUNT("Comment".id) AS "commentCount",
          COUNT("Repost".id) AS "repostCount"
        FROM "Post"
          LEFT JOIN "User" AS "Author" ON "Author".id = "Post"."authorId"
          LEFT JOIN "Post" AS "ReferredPost" ON "ReferredPost".id = "Post"."referredPostId"
          LEFT JOIN "User" AS "ReferredPostAuthor" ON "ReferredPostAuthor".id = "ReferredPost"."authorId"
          LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author".id AND "UserFollow"."followerId" = ${userId}
          LEFT JOIN "UserLikePost" ON "UserLikePost"."postId" = "Post".id
          LEFT JOIN "Post" AS "Comment" ON "Comment"."parentPostId" = "Post".id
          LEFT JOIN "Post" AS "Repost" ON "Repost"."referredPostId" = "Post".id
        WHERE "Post".id < ${cursor} AND
          "Post"."parentPostId" = ${postId} AND (
          "Post"."authorId" = ${userId} OR
          "Post"."publishAt" < CURRENT_TIMESTAMP AND (
            "Post".status = ${PostStatus.PUBLIC} OR 
            "Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL
          )
        )
        GROUP BY "Post".id, "Author".id, "ReferredPost".id, "ReferredPostAuthor".id
        ORDER BY "Post".id DESC
        LIMIT ${limit};`
      if (!comments.length) return error(404, 'Not Found')

      return comments.map((comment) =>
        deeplyRemoveNull({
          id: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          deletedAt: comment.deletedAt,
          publishAt: comment.publishAt,
          category: comment.category,
          status: comment.status,
          content: comment.content,
          imageURLs: comment.imageURLs,
          ...(comment.author_id && {
            author: {
              id: comment.author_id,
              name: comment.author_name!,
              nickname: comment.author_nickname!,
              profileImageURLs: comment.author_profileImageURLs,
            },
          }),
          ...(comment.referredPost_id && {
            referredPost: {
              id: comment.referredPost_id,
              createdAt: comment.referredPost_createdAt!,
              updatedAt: comment.referredPost_updatedAt,
              deletedAt: comment.referredPost_deletedAt,
              publishAt: comment.referredPost_publishAt!,
              category: comment.referredPost_category,
              status: comment.referredPost_status!,
              content: comment.referredPost_content,
              imageURLs: comment.referredPost_imageURLs,
              ...(comment.referredPostAuthor_id && {
                author: {
                  id: comment.referredPostAuthor_id,
                  name: comment.referredPostAuthor_name!,
                  nickname: comment.referredPostAuthor_nickname!,
                  profileImageURLs: comment.referredPostAuthor_profileImageURLs,
                },
              }),
            },
          }),
          likedByMe: comment.likedByMe === 1 || undefined,
          likeCount: removeZero(comment.likeCount),
          commentCount: removeZero(comment.commentCount),
          repostCount: removeZero(comment.repostCount),
        }),
      )
    },
    {
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      query: t.Object({
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.Number()),
      }),
      response: {
        200: t.Array(commentSchema),
        400: t.String(),
        404: t.String(),
      },
    },
  )

type CommentRow = {
  id: string
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
  publishAt: Date
  category: PostCategory
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

const comment = {
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Optional(t.Date()),
  deletedAt: t.Optional(t.Date()),
  publishAt: t.Date(),
  category: t.Optional(t.Enum(PostCategory)),
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

const commentSchema = t.Object({
  ...comment,
  referredPost: t.Optional(t.Object(comment)),
  likedByMe: t.Optional(t.Boolean()),
  likeCount: t.Optional(t.String()),
  commentCount: t.Optional(t.String()),
  repostCount: t.Optional(t.String()),
})
