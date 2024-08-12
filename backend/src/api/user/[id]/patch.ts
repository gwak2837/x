import { NotFoundError, type Static, t } from 'elysia'

import type { BaseElysia } from '../../..'

import { UserSuspendedTypeInput } from '../../../model/User'
import { isValidPostgresBigInt, removeUndefinedKeys } from '../../../utils'

export default (app: BaseElysia) =>
  app.patch(
    '/user/:id',
    async ({ body, error, params, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const {
        isPrivate,
        suspendedType,
        suspendedReason,
        profileImageURLs,
        bio,
        name,
        nickname,
        birthDate,
      } = body
      if (
        !isPrivate &&
        !suspendedType &&
        !suspendedReason &&
        !profileImageURLs &&
        !bio &&
        !name &&
        !nickname &&
        !birthDate
      )
        return error(400, 'Bad Request')
      if ((suspendedType && !suspendedReason) || (suspendedReason && !suspendedType))
        return error(400, 'Bad Request')

      const { id: userIdInParam } = params
      if (!isValidPostgresBigInt(userIdInParam)) return error(400, 'Bad Request')
      if (userId !== userIdInParam) return error(401, 'Unauthorized')

      const [updatedUser] = await sql<[UpdatedPost]>`
        UPDATE "User"
        SET 
          "updatedAt" = CURRENT_TIMESTAMP,
          ${
            birthDate
              ? sql`
          "birthDate" = make_date(
            EXTRACT(YEAR FROM "birthDate"), 
            ${birthDate.slice(5, 7)},
            ${birthDate.slice(8, 10)}
          ),`
              : sql``
          }
          ${suspendedType ? sql`"suspendedAt" = CURRENT_TIMESTAMP,` : sql``}
          ${sql(
            removeUndefinedKeys({
              isPrivate,
              suspendedType,
              suspendedReason,
              bio,
              name,
              nickname,
              profileImageURLs,
            }),
          )}
        WHERE id = ${userId}
          -- AND "nameLastUpdated" < CURRENT_TIMESTAMP - INTERVAL '1 day'
        RETURNING id, "updatedAt"`
      if (!updatedUser) throw new NotFoundError()

      return updatedUser
    },
    {
      headers: t.Object({ authorization: t.String() }),
      params: t.Object({ id: t.String({ maxLength: 19 }) }),
      body: t.Object({
        isPrivate: t.Optional(t.Boolean()),
        suspendedType: t.Optional(t.Enum(UserSuspendedTypeInput)),
        suspendedReason: t.Optional(t.String()),
        bio: t.Optional(t.String()),
        birthDate: t.Optional(t.String({ format: 'date' })),
        name: t.Optional(t.String()),
        nickname: t.Optional(t.String()),
        profileImageURLs: t.Optional(t.Array(t.String())),
        config: t.Optional(
          t.Object({
            termsOfServiceAgreedAt: t.Optional(t.String({ format: 'date-time' })),
            privacyPolicyAgreedAt: t.Optional(t.String({ format: 'date-time' })),
            marketingAgreedAt: t.Optional(t.String({ format: 'date-time' })),
          }),
        ),
      }),
      response: {
        200: response200Schema,
        400: t.String(),
        401: t.String(),
        404: t.String(),
      },
    },
  )

export type PATCHUserIdResponse200 = Static<typeof response200Schema>

const response200Schema = t.Object({
  id: t.String(),
  updatedAt: t.Date(),
})

type UpdatedPost = {
  id: string
  updatedAt: Date
}
