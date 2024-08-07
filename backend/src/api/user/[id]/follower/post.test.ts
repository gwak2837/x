import { beforeAll, describe, expect, setSystemTime, spyOn, test } from 'bun:test'

import { app } from '../../../..'
import {
  validBBatonTokenResponse,
  validBBatonTokenResponse2,
  validBBatonUserResponse,
  validBBatonUserResponse2,
} from '../../../../../test/mock'
import { sql } from '../../../../../test/postgres'
import { UserFollowStatus } from '../../../../model/User'

describe('POST /user/:id/follower', () => {
  // 공개 계정
  let accessToken = ''
  let userId = ''

  // 비밀 계정
  let accessToken2 = ''
  let userId2 = ''
  const invalidUserId = '0'

  beforeAll(async () => {
    await sql`DELETE FROM "UserFollow"`
    await sql`DELETE FROM "OAuth"`
    await sql`DELETE FROM "User"`

    setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
  })

  test('회원가입', async () => {
    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonTokenResponse)),
    )

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonUserResponse)),
    )

    const result = await app
      .handle(new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }))
      .then((response) => response.json())

    expect(result).toHaveProperty('accessToken')
    expect(typeof result.accessToken).toBe('string')

    accessToken = result.accessToken
    userId = JSON.parse(atob(accessToken.split('.')[1])).sub
  })

  test('회원가입2', async () => {
    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonTokenResponse2)),
    )

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonUserResponse2)),
    )

    const result = await app
      .handle(new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }))
      .then((response) => response.json())

    expect(result).toHaveProperty('accessToken')
    expect(typeof result.accessToken).toBe('string')

    accessToken2 = result.accessToken
    userId2 = JSON.parse(atob(accessToken2.split('.')[1])).sub

    const result2 = await app
      .handle(
        new Request(`http://localhost/user/${userId2}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken2}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isPrivate: true }),
        }),
      )
      .then((response) => response.json())

    expect(result2.id).toBe(userId2)
  })

  test('422: 요청에 `Authorization` 헤더가 없는 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/${userId}/follower`, {
        method: 'POST',
      }),
    )

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      summary: "Property 'authorization' is missing",
    })
  })

  test('404: 두번째 사용자가 없는 사용자를 팔로우 요청 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/${invalidUserId}/follower`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken2}` },
      }),
    )

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('NOT_FOUND')
  })

  test('422: `userId`가 너무 긴 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/12345678901234567890/follower`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken2}` },
      }),
    )

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      summary: 'Expected string length less or equal to 19',
    })
  })

  test('400: `userId`가 8 bytes 정수 최댓값보다 큰 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/9223372036854775808/follower`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken2}` },
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('400: `userId`가 숫자형 문자열이 아닌 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/asdfasdf/follower`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken2}` },
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('400: 자기 자신을 팔로우 요청한 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/${userId2}/follower`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken2}` },
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('두번째 사용자가 공개 계정인 첫번째 사용자에게 팔로우 요청한 경우', async () => {
    const result = await app
      .handle(
        new Request(`http://localhost/user/${userId}/follower`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken2}` },
        }),
      )
      .then((response) => response.json())

    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    const result2 = await app
      .handle(new Request(`http://localhost/user/${userId}/follower`))
      .then((response) => response.json())

    expect(result2.length).toBe(1)
  })

  test('404: 기존 팔로워가 또 팔로우 요청한 경우', async () => {
    const result = await app
      .handle(new Request(`http://localhost/user/${userId}/follower`))
      .then((response) => response.json())

    expect(result.length).toBe(1)
    expect(result[0].id).toBe(userId2)

    const response = await app.handle(
      new Request(`http://localhost/user/${userId}/follower`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken2}` },
      }),
    )

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('NOT_FOUND')
  })

  test('첫번째 사용자가 비밀 계정인 두번째 사용자에게 팔로우 요청한 경우', async () => {
    // 팔로우 요청
    const result = await app
      .handle(
        new Request(`http://localhost/user/${userId2}/follower`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      )
      .then((response) => response.json())

    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    const result2 = await app.handle(new Request(`http://localhost/user/${userId2}/follower`))

    expect(result2.status).toBe(404)
    expect(await result2.text()).toBe('NOT_FOUND')

    // 팔로우 요청 승인
    const result3 = await app
      .handle(
        new Request(`http://localhost/user/${userId2}/follower`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken2}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userIds: [userId],
            status: UserFollowStatus.ACCEPTED,
          }),
        }),
      )
      .then((response) => response.json())

    expect(result3).toEqual([{ id: userId, createdAt: result.createdAt }])

    const result4 = await app.handle(new Request(`http://localhost/user/${userId2}/follower`))

    expect(result4.status).toBe(404)
    expect(await result4.text()).toBe('NOT_FOUND')

    const result5 = await app
      .handle(
        new Request(`http://localhost/user/${userId2}/follower`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      )
      .then((response) => response.json())

    expect(result5.length).toBe(1)
    expect(result5[0].id).toBe(userId)
  })
})
