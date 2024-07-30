import { describe, expect, test } from 'bun:test'

import { app } from '../../..'
import { TokenType, signJWT } from '../../../utils/jwt'

describe('POST /auth/access-token', async () => {
  const invalidUserId = '0'
  // const validRefreshToken = await signJWT({ sub: '' }, TokenType.REFRESH)

  test('요청 헤더에 `Authorization`가 없는 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/auth/access-token', { method: 'POST' }),
    )

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      summary: "Property 'authorization' is missing",
    })
  })

  test('요청 헤더 `Authorization`이 빈 문자열인 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/auth/access-token', {
        method: 'POST',
        headers: { Authorization: '' },
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })

  test('토큰 서명이 유효하지 않은 경우', async () => {
    const invalidRefreshToken = await signJWT({ sub: invalidUserId }, TokenType.ACCESS)

    const response = await app.handle(
      new Request('http://localhost/auth/access-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${invalidRefreshToken}` },
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })

  test('토큰 payload에 `sub`가 없는 경우', async () => {
    const invalidRefreshToken = await signJWT({}, TokenType.REFRESH)

    const response = await app.handle(
      new Request('http://localhost/auth/access-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${invalidRefreshToken}` },
      }),
    )

    expect(response.status).toBe(422)
    expect(await response.text()).toBe('Unprocessable Content')
  })

  test('토큰 payload의 `sub` 형식이 유효하지 않은 경우', async () => {
    const invalidRefreshToken = await signJWT({ sub: 'invalid format' }, TokenType.REFRESH)

    const response = await app.handle(
      new Request('http://localhost/auth/access-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${invalidRefreshToken}` },
      }),
    )

    expect(response.status).toBe(422)
    expect(await response.text()).toBe('Unprocessable Content')
  })

  test('토큰 유효기간이 1시간 전에 만료된 경우', async () => {
    const invalidRefreshToken = await signJWT({ sub: invalidUserId }, TokenType.REFRESH, -3600)

    const response = await app.handle(
      new Request('http://localhost/auth/access-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${invalidRefreshToken}` },
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })
})
