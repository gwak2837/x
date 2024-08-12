import { t } from 'elysia'

import type { BaseElysia } from '../..'

import { PostCategory, PostStatus } from '../../model/Post'
import { POSTGRES_MAX_BIGINT_STRING } from '../../plugin/postgres'
import { deeplyRemoveNull } from '../../utils'
import { removeZero } from '../../utils/type'

export default (app: BaseElysia) =>
  app.get(
    '/post',
    async ({ error, query, sql, userId }) => {
      const {
        category,
        cursor = POSTGRES_MAX_BIGINT_STRING,
        hashtags,
        limit = 30,
        only = PostsOnly.OTHERS,
      } = query

      if (
        !userId &&
        (only === PostsOnly.MINE ||
          only === PostsOnly.FOLLOWING ||
          only === PostsOnly.LIKED ||
          only === PostsOnly.BOOKMARKED)
      )
        return error(400, 'Bad Request')

      const posts = await sql<PostRow[]>`
        SELECT "Post".id,
          "Post"."createdAt",
          "Post"."updatedAt",
          "Post"."publishAt",
          "Post".status,
          "Post".content,
          "Post"."imageURLs",
          "Post"."referredPostId",
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
          MAX(CASE WHEN "UserLikePost"."userId" = ${userId} THEN 1 ELSE 0 END) AS "likedByMe",
          COUNT("UserLikePost"."postId") AS "likeCount",
          COUNT("Comment".id) AS "commentCount",
          COUNT("Repost".id) AS "repostCount"
        FROM "Post"
          JOIN "User" AS "Author" ON  "Author".id = "Post"."authorId"
          ${only === PostsOnly.LIKED ? sql`JOIN "UserLikePost" ON "Post".id = "UserLikePost"."postId"` : sql``}
          ${only === PostsOnly.BOOKMARKED ? sql`JOIN "UserBookmarkPost" ON "Post".id = "UserBookmarkPost"."postId"` : sql``}
          LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author"."id" AND "UserFollow"."followerId" = ${userId}
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
          LEFT JOIN "UserFollow" AS "ReferredAuthorFollow" 
            ON "ReferredAuthorFollow"."leaderId" = "ReferredAuthor"."id" AND "ReferredAuthorFollow"."followerId" = ${userId}
          LEFT JOIN "UserLikePost" ON "UserLikePost"."postId" = "Post".id
          LEFT JOIN "Post" AS "Comment" ON "Comment"."parentPostId" = "Post".id
          LEFT JOIN "Post" AS "Repost" ON "Repost"."referredPostId" = "Post".id
          ${
            hashtags
              ? sql`
          LEFT JOIN "PostHashtag" ON "PostHashtag"."postId" = "Post".id
          LEFT JOIN "Hashtag" ON "Hashtag".id = "PostHashtag"."hashtagId"`
              : sql``
          }
        WHERE "Post".id < ${cursor}
          AND "Post"."deletedAt" IS NULL
          AND "Post"."publishAt" <= CURRENT_TIMESTAMP 
          ${only === PostsOnly.LIKED ? sql`AND "UserLikePost"."userId" = ${userId}` : sql``}
          ${only === PostsOnly.BOOKMARKED ? sql`AND "UserBookmarkPost"."userId" = ${userId}` : sql``}
          ${hashtags ? sql`AND "Hashtag".name IN ${sql(hashtags)}` : sql``}
          ${category !== undefined ? sql`AND "Post".category = ${category}` : sql``}
          AND (
            ${only === PostsOnly.MINE ? sql`"Post"."authorId" = ${userId!}` : sql``}
            ${only === PostsOnly.FOLLOWING ? sql`"UserFollow"."followerId" = ${userId!}` : sql``}
            ${userId && only === PostsOnly.OTHERS ? sql`"Post"."authorId" != ${userId}` : sql``}
            ${!userId && only === PostsOnly.OTHERS ? sql`TRUE` : sql``}
          ) AND (
            ${userId && only === PostsOnly.MINE ? sql`TRUE OR` : sql``}
            "Post".status = ${PostStatus.PUBLIC} OR 
            "Post".status = ${PostStatus.ANNONYMOUS} OR 
            "Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL
          )
        GROUP BY "Post".id, "Author".id, "ReferredPost".id, "ReferredAuthor".id
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
          referredPostId: post.referredPostId,
          ...(post.author_id &&
            post.status !== PostStatus.ANNONYMOUS && {
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
              ...(post.referredAuthor_id &&
                post.referredPost_status !== PostStatus.ANNONYMOUS && {
                  author: {
                    id: post.referredAuthor_id,
                    name: post.referredAuthor_name!,
                    nickname: post.referredAuthor_nickname!,
                    profileImageURLs: post.referredAuthor_profileImageURLs,
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
        hashtags: t.Optional(t.Array(t.String())),
        limit: t.Optional(t.Number()),
        only: t.Optional(t.Enum(PostsOnly)),
      }),
      response: {
        200: t.Array(schemaGETPost),
        400: t.String(),
        404: t.String(),
      },
    },
  )

export enum PostsOnly {
  OTHERS = 'others',
  FOLLOWING = 'following',
  MINE = 'mine',
  LIKED = 'liked',
  BOOKMARKED = 'bookmarked',
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
  referredPostId: string | null
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
  likedByMe: 0 | 1
  likeCount: string
  commentCount: string
  repostCount: string
}

const basePost = {
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

const schemaGETPost = t.Object({
  ...basePost,
  referredPostId: t.Optional(t.String()),
  referredPost: t.Optional(
    t.Object({
      ...basePost,
      category: t.Optional(t.Enum(PostCategory)),
    }),
  ),
  likedByMe: t.Optional(t.Literal(true)),
  likeCount: t.Optional(t.String()),
  commentCount: t.Optional(t.String()),
  repostCount: t.Optional(t.String()),
})
