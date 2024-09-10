import { t } from 'elysia'

import type { BaseElysia } from '../../../..'

import { PostCategory, PostStatus } from '../../../../model/Post'
import { POSTGRES_MAX_BIGINT_STRING } from '../../../../plugin/postgres'
import { deeplyRemoveNull, isValidPostgresBigInt } from '../../../../util'
import { removeZero } from '../../../../util/type'

export default (app: BaseElysia) =>
  app.get(
    '/post/:id/comment',
    async ({ error, params, query, sql, userId }) => {
      const { id: postId } = params
      const { cursor = POSTGRES_MAX_BIGINT_STRING, limit = 30 } = query
      if (!isValidPostgresBigInt(postId) || !isValidPostgresBigInt(cursor))
        return error(400, 'Bad Request')

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
          "ReferredAuthor".id AS "referredAuthor_id",
          "ReferredAuthor".name AS "referredAuthor_name",
          "ReferredAuthor".nickname AS "referredAuthor_nickname",
          "ReferredAuthor"."profileImageURLs" AS "referredAuthor_profileImageURLs",
          "ReplyPost".id AS "replyPost_id",
          "ReplyPost"."createdAt" AS "replyPost_createdAt",
          "ReplyPost"."updatedAt" AS "replyPost_updatedAt",
          "ReplyPost"."deletedAt" AS "replyPost_deletedAt",
          "ReplyPost"."publishAt" AS "replyPost_publishAt",
          "ReplyPost".category AS "replyPost_category",
          "ReplyPost".status AS "replyPost_status",
          "ReplyPost".content AS "replyPost_content",
          "ReplyPost"."imageURLs" AS "replyPost_imageURLs",
          "ReplyAuthor".id AS "replyAuthor_id",
          "ReplyAuthor".name AS "replyAuthor_name",
          "ReplyAuthor".nickname AS "replyAuthor_nickname",
          "ReplyAuthor"."profileImageURLs" AS "replyAuthor_profileImageURLs",
          MAX(CASE WHEN "UserLikePost"."userId" = ${userId} THEN 1 ELSE 0 END) AS "likedByMe",
          COUNT("UserLikePost"."postId") AS "likeCount",
          COUNT("Comment".id) AS "commentCount",
          COUNT("Repost".id) AS "repostCount"
        FROM "Post"
          LEFT JOIN "User" AS "Author" ON "Author".id = "Post"."authorId"
          LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author".id AND "UserFollow"."followerId" = ${userId}
          LEFT JOIN "Post" AS "ReferredPost" ON "ReferredPost".id = (
            SELECT "ReferredPost".id
            FROM "Post" AS "ReferredPost"
              LEFT JOIN "User" AS "ReferredAuthor" ON "ReferredAuthor".id = "ReferredPost"."authorId"
              LEFT JOIN "UserFollow" AS "ReferredAuthorFollow"
                ON "ReferredAuthorFollow"."leaderId" = "ReferredAuthor".id AND "ReferredAuthorFollow"."followerId" = ${userId}
            WHERE "ReferredPost".id = "Post"."referredPostId"
              AND "ReferredPost"."publishAt" < CURRENT_TIMESTAMP AND (
                "ReferredPost".status = ${PostStatus.PUBLIC} OR 
                "ReferredPost".status = ${PostStatus.ANNONYMOUS} OR 
                "ReferredPost".status = ${PostStatus.ONLY_FOLLOWERS} AND "ReferredAuthorFollow"."leaderId" IS NOT NULL
              )
          )
          LEFT JOIN "User" AS "ReferredAuthor" ON "ReferredAuthor".id = "ReferredPost"."authorId"
          LEFT JOIN "Post" AS "ReplyPost" ON "ReplyPost".id = (
            SELECT "ReplyPost".id
            FROM "Post" AS "ReplyPost"
              LEFT JOIN "User" AS "ReplyAuthor" ON "ReplyAuthor".id = "ReplyPost"."authorId"
              LEFT JOIN "UserFollow" AS "ReplyUserFollow" 
                ON "ReplyUserFollow"."leaderId" = "ReplyAuthor".id AND "ReplyUserFollow"."followerId" = ${userId}
            WHERE "ReplyPost"."parentPostId" = "Post".id
              AND "ReplyPost"."publishAt" < CURRENT_TIMESTAMP AND (
                "ReplyPost".status = ${PostStatus.PUBLIC} OR 
                "ReplyPost".status = ${PostStatus.ANNONYMOUS} OR 
                "ReplyPost".status = ${PostStatus.ONLY_FOLLOWERS} AND "ReplyUserFollow"."leaderId" IS NOT NULL
              )
            ORDER BY "Post"."publishAt" DESC
            LIMIT 1
          )
          LEFT JOIN "User" AS "ReplyAuthor" ON "ReplyAuthor".id = "ReplyPost"."authorId"
          LEFT JOIN "UserLikePost" ON "UserLikePost"."postId" = "Post".id
          LEFT JOIN "Post" AS "Comment" ON "Comment"."parentPostId" = "Post".id
          LEFT JOIN "Post" AS "Repost" ON "Repost"."referredPostId" = "Post".id
        WHERE "Post".id < ${cursor} AND
          "Post"."parentPostId" = ${postId} AND (
          "Post"."authorId" = ${userId} OR
          "Post"."publishAt" < CURRENT_TIMESTAMP AND (
            "Post".status = ${PostStatus.PUBLIC} OR 
            "Post".status = ${PostStatus.ANNONYMOUS} OR 
            "Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL
          )
        )
        GROUP BY "Post".id, "Author".id, "ReferredPost".id, "ReferredAuthor".id, "ReplyPost".id, "ReplyAuthor".id
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
          ...(comment.author_id &&
            comment.status !== PostStatus.ANNONYMOUS && {
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
              ...(comment.referredAuthor_id &&
                comment.referredPost_status !== PostStatus.ANNONYMOUS && {
                  author: {
                    id: comment.referredAuthor_id,
                    name: comment.referredAuthor_name!,
                    nickname: comment.referredAuthor_nickname!,
                    profileImageURLs: comment.referredAuthor_profileImageURLs,
                  },
                }),
            },
          }),
          ...(comment.replyPost_id && {
            replyPost: {
              id: comment.replyPost_id,
              createdAt: comment.replyPost_createdAt!,
              updatedAt: comment.replyPost_updatedAt,
              deletedAt: comment.replyPost_deletedAt,
              publishAt: comment.replyPost_publishAt!,
              category: comment.replyPost_category,
              status: comment.replyPost_status!,
              content: comment.replyPost_content,
              imageURLs: comment.replyPost_imageURLs,
              ...(comment.replyAuthor_id &&
                comment.replyPost_status !== PostStatus.ANNONYMOUS && {
                  author: {
                    id: comment.replyAuthor_id,
                    name: comment.replyAuthor_name!,
                    nickname: comment.replyAuthor_nickname!,
                    profileImageURLs: comment.replyAuthor_profileImageURLs,
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
        200: t.Array(schemaGETPostIdComment),
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
  referredAuthor_id: string | null
  referredAuthor_name: string | null
  referredAuthor_nickname: string | null
  referredAuthor_profileImageURLs: string[] | null
  replyPost_id: string | null
  replyPost_createdAt: Date | null
  replyPost_updatedAt: Date | null
  replyPost_deletedAt: Date | null
  replyPost_publishAt: Date | null
  replyPost_category: PostCategory | null
  replyPost_status: PostStatus | null
  replyPost_content: string | null
  replyPost_imageURLs: string[] | null
  replyAuthor_id: string | null
  replyAuthor_name: string | null
  replyAuthor_nickname: string | null
  replyAuthor_profileImageURLs: string[] | null
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

const schemaGETPostIdComment = t.Object({
  ...comment,
  referredPost: t.Optional(t.Object(comment)),
  replyPost: t.Optional(t.Object(comment)),
  likedByMe: t.Optional(t.Boolean()),
  likeCount: t.Optional(t.String()),
  commentCount: t.Optional(t.String()),
  repostCount: t.Optional(t.String()),
})
