import type { BaseElysia } from '@/index'

import { PostCategory, PostStatus } from '@/model/Post'
import { deeplyRemoveNull } from '@/util'
import { NotFoundError, type Static, t } from 'elysia'

export default function GETPostId(app: BaseElysia) {
  return app.get(
    '/post/:id',
    async ({ error, query, params, sql, userId }) => {
      const { id: postId } = params
      if (isNaN(+postId)) return error(400, 'Bad Request')

      const { include } = query
      const shouldIncludeParentPost = include === 'parent-post'

      const postRows = await sql<PostRow[]>`
        ${
          shouldIncludeParentPost
            ? sql`
        WITH RECURSIVE "BasePost" AS (`
            : sql``
        }
          SELECT "Post".id,
            "Post"."createdAt",
            "Post"."updatedAt",
            "Post"."deletedAt",
            "Post"."publishAt",
            "Post".category,
            "Post".status,
            "Post".content,
            "Post"."imageURLs",
            "Post"."parentPostId",
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
            "ReferredAuthor".id AS "referredPostAuthor_id",
            "ReferredAuthor".name AS "referredPostAuthor_name",
            "ReferredAuthor".nickname AS "referredPostAuthor_nickname",
            "ReferredAuthor"."profileImageURLs" AS "referredPostAuthor_profileImageURLs"
          FROM "Post"
            LEFT JOIN "User" AS "Author" ON "Author".id = "Post"."authorId"
            LEFT JOIN "Post" AS "ReferredPost" ON "ReferredPost".id = "Post"."referredPostId"
            LEFT JOIN "User" AS "ReferredAuthor" ON "ReferredAuthor".id = "ReferredPost"."authorId"
            LEFT JOIN "UserFollow" ON "UserFollow"."leaderId" = "Author".id AND "UserFollow"."followerId" = ${userId}
          WHERE 
          ${
            shouldIncludeParentPost
              ? sql``
              : sql`
            "Post".id = ${postId} AND`
          } (
            "Post"."authorId" = ${userId} OR
            "Post"."publishAt" < CURRENT_TIMESTAMP AND (
              "Post".status = ${PostStatus.PUBLIC} OR 
              "Post".status = ${PostStatus.ONLY_FOLLOWERS} AND "UserFollow"."leaderId" IS NOT NULL
            )
          )
          GROUP BY "Post".id, "Author".id, "UserFollow"."followerId", "ReferredPost".id, "ReferredAuthor".id
        ${
          shouldIncludeParentPost
            ? sql`
        ), "ParentPosts" AS (
          SELECT * FROM "BasePost"
          WHERE "BasePost".id = ${postId}
          UNION ALL
          SELECT "BasePost".* FROM "BasePost"
            JOIN "ParentPosts" ON "BasePost".id = "ParentPosts"."parentPostId"
        )
        SELECT * FROM "ParentPosts"`
            : sql``
        }`
      if (postRows.length === 0) throw new NotFoundError()

      const posts = postRows.map((postRow) =>
        deeplyRemoveNull({
          id: postRow.id,
          createdAt: postRow.createdAt,
          updatedAt: postRow.updatedAt,
          deletedAt: postRow.deletedAt,
          publishAt: postRow.publishAt,
          category: postRow.category,
          status: postRow.status,
          content: postRow.content,
          imageURLs: postRow.imageURLs,
          ...(postRow.author_id &&
            postRow.status !== PostStatus.ANNONYMOUS && {
              author: {
                id: postRow.author_id,
                name: postRow.author_name,
                nickname: postRow.author_nickname,
                profileImageURLs: postRow.author_profileImageURLs,
              },
            }),
          ...(postRow.referredPost_id && {
            referredPost: {
              id: postRow.referredPost_id,
              createdAt: postRow.referredPost_createdAt,
              updatedAt: postRow.referredPost_updatedAt,
              deletedAt: postRow.referredPost_deletedAt,
              publishAt: postRow.referredPost_publishAt,
              category: postRow.referredPost_category,
              status: postRow.referredPost_status,
              content: postRow.referredPost_content,
              imageURLs: postRow.referredPost_imageURLs,
              ...(postRow.referredPostAuthor_id &&
                postRow.referredPost_status !== PostStatus.ANNONYMOUS && {
                  author: {
                    id: postRow.referredPostAuthor_id,
                    name: postRow.referredPostAuthor_name,
                    nickname: postRow.referredPostAuthor_nickname,
                    profileImageURLs: postRow.referredPostAuthor_profileImageURLs,
                  },
                }),
            },
          }),
        }),
      )

      const parentPosts = posts.slice(1).reverse()

      return {
        ...posts[0],
        parentPosts: parentPosts.length > 0 ? parentPosts : undefined,
      }
    },
    {
      headers: t.Object({ authorization: t.Optional(t.String()) }),
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      query: t.Object({ include: t.Optional(t.Literal('parent-post')) }),
      response: {
        200: schemaGETPostId,
        400: t.String(),
        404: t.String(),
      },
    },
  )
}

export type PostRow = {
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
}

const post = {
  id: t.String(),
  createdAt: t.Optional(t.Date()),
  updatedAt: t.Optional(t.Date()),
  deletedAt: t.Optional(t.Date()),
  publishAt: t.Optional(t.Date()),
  category: t.Optional(t.Enum(PostCategory)),
  status: t.Optional(t.Enum(PostStatus)),
  content: t.Optional(t.String()),
  imageURLs: t.Optional(t.Array(t.String())),
  author: t.Optional(
    t.Object({
      id: t.Optional(t.String()),
      name: t.Optional(t.String()),
      nickname: t.Optional(t.String()),
      profileImageURLs: t.Optional(t.Array(t.String())),
      isFollowing: t.Optional(t.Boolean()),
    }),
  ),
}

const schemaGETPostId = t.Object({
  ...post,
  referredPost: t.Optional(t.Object(post)),
  parentPosts: t.Optional(t.Array(t.Object({ ...post, referredPost: t.Optional(t.Object(post)) }))),
})

export type GETPostId = Static<typeof schemaGETPostId>
