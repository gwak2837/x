import { beforeAll, describe, expect, setSystemTime, spyOn, test } from 'bun:test'

import { app } from '../../../..'
import {
  validBBatonTokenResponse,
  validBBatonTokenResponse2,
  validBBatonUserResponse,
  validBBatonUserResponse2,
} from '../../../../../test/mock'
import { sql } from '../../../../../test/postgres'

describe('DELETE /user/:id/follower', () => {
  let accessToken = ''
  let accessToken2 = ''
  let userId = ''
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
  })

  test('422: 요청에 `Authorization` 헤더가 없는 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/${userId}/follower`, {
        method: 'DELETE',
      }),
    )

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      summary: "Property 'authorization' is missing",
    })
  })

  test('404: 두번째 사용자가 없는 사용자를 팔로우 취소 요청 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/${invalidUserId}/follower`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken2}` },
      }),
    )

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('NOT_FOUND')
  })

  test('422: `userId`가 너무 긴 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/12345678901234567890/follower`, {
        method: 'DELETE',
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
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken2}` },
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('400: `userId`가 숫자형 문자열이 아닌 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/asdfasdf/follower`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken2}` },
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('400: 자기 자신을 팔로우 취소 요청한 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/${userId2}/follower`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken2}` },
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('두번째 사용자가 첫번째 사용자를 팔로우 요청한 경우', async () => {
    const result = await app
      .handle(
        new Request(`http://localhost/user/${userId}/follower`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken2}` },
        }),
      )
      .then((response) => response.json())

    expect(new Date(result.createdAt).getTime()).not.toBeNaN()
  })

  test('두번째 사용자가 첫번째 사용자를 팔로우 취소 요청한 경우', async () => {
    const [result] = await sql`
      SELECT "leaderId"
      FROM "UserFollow"
      WHERE "leaderId" = ${userId} AND "followerId" = ${userId2}`

    expect(result.leaderId).toBe(userId)

    const result2 = await app
      .handle(
        new Request(`http://localhost/user/${userId}/follower`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken2}` },
        }),
      )
      .then((response) => response.json())

    expect(new Date(result2.createdAt).getTime()).not.toBeNaN()
  })

  test('404: 한 번 더 팔로우 취소 요청한 경우', async () => {
    const result = await sql`
      SELECT "leaderId"
      FROM "UserFollow"
      WHERE "leaderId" = ${userId} AND "followerId" = ${userId2}`

    expect(result.length).toBe(0)

    const response = await app.handle(
      new Request(`http://localhost/user/${userId}/follower`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken2}` },
      }),
    )

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('NOT_FOUND')
  })
})
