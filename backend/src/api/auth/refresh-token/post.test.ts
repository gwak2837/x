import { beforeAll, describe, expect, spyOn, test } from 'bun:test'

import { app } from '../../..'
import { validBBatonTokenResponse, validBBatonUserResponse } from '../../../../test/mock'
import { sql } from '../../../../test/postgres'
import { UserSuspendedType } from '../../../model/User'
import { TokenType, signJWT } from '../../../utils/jwt'

describe('POST /auth/refresh-token', async () => {
  const invalidUserId = '0'
  let newUserId = ''

  beforeAll(async () => {
    await sql`DELETE FROM "OAuth"`
    await sql`DELETE FROM "User"`
  })

  test('422: 요청 헤더에 `Authorization`가 없는 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/auth/refresh-token', { method: 'POST' }),
    )

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      summary: "Property 'authorization' is missing",
    })
  })

  test('401: 요청 헤더 `Authorization`이 빈 문자열인 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/auth/refresh-token', {
        method: 'POST',
        headers: { Authorization: '' },
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })

  test('401: 토큰 서명이 유효하지 않은 경우', async () => {
    const invalidRefreshToken = await signJWT({ sub: invalidUserId }, TokenType.ACCESS)

    const response = await app.handle(
      new Request('http://localhost/auth/refresh-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${invalidRefreshToken}` },
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })

  test('422: 토큰 payload에 `sub`가 없는 경우', async () => {
    const invalidRefreshToken = await signJWT({}, TokenType.REFRESH)

    const response = await app.handle(
      new Request('http://localhost/auth/refresh-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${invalidRefreshToken}` },
      }),
    )

    expect(response.status).toBe(422)
    expect(await response.text()).toBe('Unprocessable Content')
  })

  test('422: 토큰 payload의 `sub` 형식이 유효하지 않은 경우', async () => {
    const invalidRefreshToken = await signJWT({ sub: 'invalid format' }, TokenType.REFRESH)

    const response = await app.handle(
      new Request('http://localhost/auth/refresh-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${invalidRefreshToken}` },
      }),
    )

    expect(response.status).toBe(422)
    expect(await response.text()).toBe('Unprocessable Content')
  })

  test('401: 토큰 유효기간이 1시간 전에 만료된 경우', async () => {
    const invalidRefreshToken = await signJWT({ sub: invalidUserId }, TokenType.REFRESH, -3600)

    const response = await app.handle(
      new Request('http://localhost/auth/refresh-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${invalidRefreshToken}` },
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })

  test('회원가입 후 잠시 뒤 토큰을 갱신하는 경우', async () => {
    // 회원가입
    spyOn(Date, 'now').mockReturnValueOnce(1722314119989)

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonTokenResponse)),
    )

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonUserResponse)),
    )

    const register = await app
      .handle(new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }))
      .then((response) => response.json())

    expect(register).toHaveProperty('accessToken')
    expect(register).toHaveProperty('refreshToken')
    expect(typeof register.accessToken).toBe('string')
    expect(typeof register.refreshToken).toBe('string')

    newUserId = JSON.parse(atob(register.accessToken.split('.')[1])).sub

    // 토큰 갱신
    spyOn(Date, 'now').mockReturnValueOnce(1722315119989)

    const refreshing = await app
      .handle(
        new Request('http://localhost/auth/refresh-token', {
          method: 'POST',
          headers: { Authorization: `Bearer ${register.refreshToken}` },
        }),
      )
      .then((response) => response.json())

    const userId = JSON.parse(atob(refreshing.refreshToken.split('.')[1])).sub

    expect(refreshing).toHaveProperty('refreshToken')
    expect(typeof refreshing.refreshToken).toBe('string')
    expect(refreshing.refreshToken).not.toBe(register.refreshToken)
    expect(userId).toBe(newUserId)
  })

  test('403: 정지된 사용자가 로그인한 경우', async () => {
    // 로그인
    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonTokenResponse)),
    )

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonUserResponse)),
    )

    const loginResult = await app
      .handle(new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }))
      .then((response) => response.json())

    expect(loginResult).toHaveProperty('accessToken')
    expect(loginResult).toHaveProperty('refreshToken')
    expect(typeof loginResult.accessToken).toBe('string')
    expect(typeof loginResult.refreshToken).toBe('string')

    // 사용자 정지
    const suspendingResult = await app
      .handle(
        new Request(`http://localhost/user/${newUserId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${loginResult.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            suspendedType: UserSuspendedType.BLOCK,
            suspendedReason: '계정 정지 테스트',
          }),
        }),
      )
      .then((response) => response.json())

    expect(suspendingResult.id).toBe(newUserId)
    expect(new Date(suspendingResult.updatedAt).getTime()).not.toBeNaN()

    // 토큰 갱신
    const response = await app.handle(
      new Request('http://localhost/auth/refresh-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${loginResult.refreshToken}` },
      }),
    )

    expect(response.status).toBe(403)
    expect(await response.text()).toBe('Forbidden')
  })
})
