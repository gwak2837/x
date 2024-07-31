import { NotFoundError, t } from 'elysia'

import { BaseElysia } from '../../..'
import { UserSuspendedType } from '../../../model/User'
import { removeUndefinedKeys } from '../../../utils'

export default (app: BaseElysia) =>
  app.patch(
    '/user/:id',
    async ({ body, error, params, sql, userId }) => {
      if (!userId) return error(401, 'Unauthorized')

      const { suspendedType, suspendedReason, profileImageURLs, bio, name, nickname, birthDate } =
        body
      if (
        !suspendedType &&
        !suspendedReason &&
        !profileImageURLs &&
        !bio &&
        !name &&
        !nickname &&
        !birthDate
      )
        return error(400, 'Bad request')
      if ((suspendedType && !suspendedReason) || (suspendedReason && !suspendedType))
        return error(400, 'Bad request')

      const { id: userIdInParam } = params
      if (isNaN(+userIdInParam) || !isFinite(+userIdInParam)) return error(400, 'Bad request')
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
        suspendedType: t.Optional(t.Enum(UserSuspendedType)),
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
        200: t.Object({
          id: t.String(),
          updatedAt: t.Date(),
        }),
        400: t.String(),
        401: t.String(),
        404: t.String(),
      },
    },
  )

type UpdatedPost = {
  id: string
  updatedAt: Date
}
