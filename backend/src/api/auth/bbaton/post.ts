import { t } from 'elysia'
import { PostgresError } from 'postgres'

import { BaseElysia } from '../../..'
import { BBATON_CLIENT_ID, BBATON_CLIENT_SECRET, BBATON_REDIRECT_URI } from '../../../constants'
import { OAuthProvider } from '../../../model/User'
import { PostgresErrorCode } from '../../../plugin/postgres'
import { TokenType, signJWT } from '../../../utils/jwt'
import { generateRandomNickname } from '../../../utils/nickname'

export default (app: BaseElysia) =>
  app.post(
    '/auth/bbaton',
    async ({ error, query, sql }) => {
      const code = query.code
      const tokenResponse = await fetch('https://bauth.bbaton.com/oauth/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${base64Token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          redirect_uri: BBATON_REDIRECT_URI,
          code,
        }),
      })

      const token: BBatonTokenResponse = await tokenResponse.json()
      if (!token.access_token) return error(502, 'Bad Gateway')

      const bbatonUsername: string = JSON.parse(atob(token.access_token.split('.')[1])).user_name
      if (!bbatonUsername) return error(502, 'Bad Gateway')

      // NOTE: 동시성 처리가 없어 탈퇴와 동시에 로그인 시 순간적으로 로그인이 가능할 수 있음.
      const [oauth] = await sql<[OAuthUserRow?]>`
        SELECT "OAuth".id,
          "User".id AS "user_id",
          "User"."suspendedAt" AS "user_suspendedAt",
          "User"."unsuspendAt" AS "user_unsuspendAt",
          "User"."suspendedType" AS "user_suspendedType",
          "User"."suspendedReason" AS "user_suspendedReason"
        FROM "OAuth"
          LEFT JOIN "User" ON "User".id = "OAuth"."userId"
        WHERE "OAuth".id = ${bbatonUsername}
          AND "OAuth".provider = ${OAuthProvider.BBATON};`

      if (!oauth) {
        const init = { headers: { Authorization: `Bearer ${token.access_token}` } }
        const bbatonUserResponse = await fetch('https://bauth.bbaton.com/v2/user/me', init)

        const bbatonUser: BBatonUserResponse = await bbatonUserResponse.json()
        if (!bbatonUser.user_id) return error(502, 'Bad Gateway')

        const [user] = await sql<[RegisteredUserRow]>`
          WITH
            new_user AS (
              INSERT INTO "User" ${sql({
                ageRange: encodeBBatonAge(bbatonUser.birth_year, bbatonUser.adult_flag),
                name: crypto.randomUUID(),
                nickname: generateRandomNickname(),
                nameLastModified: new Date(),
                sex: encodeBBatonGender(bbatonUser.gender),
              })}
              RETURNING id
            ),
            new_oauth AS (
              INSERT INTO "OAuth" (id, provider, "userId")
              SELECT ${bbatonUser.user_id}, ${OAuthProvider.BBATON}, new_user.id
              FROM new_user
            )
          SELECT new_user.id
          FROM new_user;
        `.catch((error: PostgresError) => {
          if (error.code === PostgresErrorCode.UNIQUE_VIOLATION) return []

          console.error(error)
          return []
        })
        if (!user) return error(400, 'Bad Request')

        return {
          accessToken: await signJWT({ sub: user.id.toString() }, TokenType.ACCESS),
          refreshToken: await signJWT({ sub: user.id.toString() }, TokenType.REFRESH),
        }
      } else if (!oauth.user_id) {
        return error(
          403,
          '해당 BBaton 계정으로 이미 회원가입한 적이 있어서 다시 가입할 수 없습니다.\n자세한 사항은 고객센터에 문의해주세요.',
        )
      } else if (oauth.user_suspendedType) {
        const msg = `로그인 할 수 없습니다. 이유:\n${oauth.user_suspendedReason}`
        return error(403, msg)
      }

      fetch('https://bauth.bbaton.com/v2/user/me', {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })
        .then(async (bbatonUserResponse) => await bbatonUserResponse.json())
        .then((bbatonUser: BBatonUserResponse) => {
          if (!bbatonUser.user_id) throw new Error(JSON.stringify(bbatonUser))

          return sql`
            UPDATE "User"
            SET ${sql({
              ageRange: encodeBBatonAge(bbatonUser.birth_year, bbatonUser.adult_flag),
              sex: encodeBBatonGender(bbatonUser.gender),
            })}
            WHERE id = ${oauth.user_id};`
        })
        .catch((error) =>
          console.warn('BBaton 사용자 정보를 가져와서 업데이트 하는데 실패했습니다.\n' + error),
        )

      return {
        accessToken: await signJWT({ sub: oauth.user_id.toString() }, TokenType.ACCESS),
        refreshToken: await signJWT({ sub: oauth.user_id.toString() }, TokenType.REFRESH),
      }
    },
    {
      query: t.Object({ code: t.String() }),
      response: {
        200: t.Object({
          accessToken: t.String(),
          refreshToken: t.String(),
        }),
        400: t.String(),
        403: t.String(),
        502: t.String(),
      },
    },
  )

const base64Token = btoa(`${BBATON_CLIENT_ID}:${BBATON_CLIENT_SECRET}`)

type BBatonTokenResponse = {
  access_token: string
  token_type: 'bearer'
  expires_in: number
  scope: string
}

type BBatonUserResponse = {
  user_id: string
  adult_flag: string
  birth_year: string
  gender: string
  income: string
  student: string
}

type OAuthUserRow = {
  id: string
  user_id: string
  user_suspendedAt: string
  user_unsuspendAt: string
  user_suspendedType: string
  user_suspendedReason: string
}

type RegisteredUserRow = {
  id: string
}

function encodeBBatonGender(gender: string) {
  switch (gender) {
    case 'M':
    case 'male':
      return 1
    case 'F':
    case 'female':
      return 2
    default:
      return 0
  }
}

function encodeBBatonAge(age: string, adultFlag: string) {
  if (age === '20' && adultFlag === 'N') {
    return 19
  }
  return Math.max(+age, 20)
}
