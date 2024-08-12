import { NotFoundError, t } from 'elysia'

import type { BaseElysia } from '../../..'

import { UserGrade, UserSex, UserSuspendedType } from '../../../model/User'
import { deeplyRemoveNull, isValidPostgresBigInt } from '../../../utils'

export default (app: BaseElysia) =>
  app.get(
    '/user/:id',
    async ({ error, params, sql, userId }) => {
      const { id: userIdInParam } = params
      if (!isValidPostgresBigInt(userIdInParam)) return error(400, 'Bad Request')

      const isMe = userId === userIdInParam

      const [user] = await sql<[UserRow]>`
        SELECT id,
          "createdAt",
          "suspendedAt",
          "unsuspendAt",
          "suspendedType",
          CASE 
            WHEN "ageRangePublic" = TRUE THEN "ageRange"
            ELSE NULL
          END AS "ageRange",
          bio,
          CASE 
            WHEN "birthDatePublic" = TRUE THEN "birthDate"
            ELSE NULL
          END AS "birthDate",
          ${isMe ? sql`config,` : sql``}
          grade,
          "isPrivate",
          name,
          nickname,
          "profileImageURLs",
          CASE 
            WHEN "sexPublic" = TRUE THEN sex
            ELSE NULL
          END AS sex
        FROM "User"
        WHERE id = ${userIdInParam}`
      if (!user) throw new NotFoundError()

      return deeplyRemoveNull(user)
    },
    {
      headers: t.Object({ authorization: t.Optional(t.String()) }),
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      response: {
        200: t.Object({
          id: t.String(),
          createdAt: t.Date(),
          suspendedAt: t.Optional(t.Date()),
          unsuspendAt: t.Optional(t.Date()),
          suspendedType: t.Optional(t.Enum(UserSuspendedType)),
          ageRange: t.Optional(t.Number()),
          bio: t.Optional(t.String()),
          birthDate: t.Optional(t.Date()),
          grade: t.Enum(UserGrade),
          isPrivate: t.Boolean(),
          name: t.String(),
          nickname: t.String(),
          profileImageURL: t.Optional(t.Array(t.String())),
          sex: t.Optional(t.Enum(UserSex)),
        }),
        400: t.String(),
        404: t.String(),
      },
    },
  )

type UserRow = {
  id: string
  createdAt: Date
  suspendedAt: Date | null
  unsuspendAt: Date | null
  suspendedType: UserSuspendedType | null
  ageRange: number | null
  bio: string | null
  birthDate: Date | null
  grade: UserGrade
  isPrivate: boolean
  name: string
  nickname: string
  profileImageURLs: string[] | null
  sex: UserSex | null
}
