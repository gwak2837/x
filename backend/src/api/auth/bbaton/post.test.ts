import { afterAll, beforeAll, describe, expect, spyOn, test } from 'bun:test'

import { app } from '../../..'
import { sql } from '../../../../test/postgres'
import { BBatonTokenResponse, BBatonUserResponse } from './post'

describe('POST /auth/bbaton', () => {
  const validBBatonTokenResponse: BBatonTokenResponse = {
    // user_name: gwak2837
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJnd2FrMjgzNyIsImlhdCI6MTUxNjIzOTAyMn0.CLK60_MlhfgrQPdO_h8hs_QvZOSrycsIDnu2BtAX3rU',
    token_type: 'bearer',
    expires_in: 123123123123,
    scope: 'public',
  }

  const validBBatonUserResponse: BBatonUserResponse = {
    user_id: 'gwak2837',
    adult_flag: 'Y',
    birth_year: '20',
    gender: 'M',
    income: '',
    student: '',
  }

  let newUserId = ''

  beforeAll(async () => {
    await sql`DELETE FROM "OAuth"`
    await sql`DELETE FROM "User"`
  })

  test('422: 요청 시 `code`가 없는 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/auth/bbaton', { method: 'POST' }),
    )

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      summary: "Property 'code' is missing",
    })
  })

  test('502: BBaton API 요청 시 `access_token`이 없는 경우', async () => {
    const invalidBBatonTokenResponse: BBatonTokenResponse = {
      access_token: '',
      token_type: 'bearer',
      expires_in: 123123123123,
      scope: 'public',
    }

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(invalidBBatonTokenResponse)),
    )

    const response = await app.handle(
      new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }),
    )

    expect(response.status).toBe(502)
    expect(await response.text()).toBe('Bad Gateway')
  })

  test('502: BBaton API 요청 시 `access_token`에 `user_name`이 없는 경우', async () => {
    const invalidBBatonTokenResponse: BBatonTokenResponse = {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjJ9.tbDepxpstvGdW8TC3G8zg4B6rUYAOvfzdceoH48wgRQ',
      token_type: 'bearer',
      expires_in: 123123123123,
      scope: 'public',
    }

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(invalidBBatonTokenResponse)),
    )

    const response = await app.handle(
      new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }),
    )

    expect(response.status).toBe(502)
    expect(await response.text()).toBe('Bad Gateway')
  })

  test('502: BBaton API 요청 시 `user_id`가 없는 경우', async () => {
    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonTokenResponse)),
    )

    const invalidBBatonUserResponse: BBatonUserResponse = {
      user_id: '',
      adult_flag: 'Y',
      birth_year: '',
      gender: '',
      income: '',
      student: '',
    }

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(invalidBBatonUserResponse)),
    )

    const response = await app.handle(
      new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }),
    )

    expect(response.status).toBe(502)
    expect(await response.text()).toBe('Bad Gateway')
  })

  test('회원가입: 데이터베이스에 BBaton 사용자 정보가 없는 경우', async () => {
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
    expect(result).toHaveProperty('refreshToken')
    expect(typeof result.accessToken).toBe('string')
    expect(typeof result.refreshToken).toBe('string')

    newUserId = JSON.parse(atob(result.accessToken.split('.')[1])).sub
  })

  test('로그인: 데이터베이스에 BBaton 사용자 정보가 있는 경우', async () => {
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
    expect(result).toHaveProperty('refreshToken')
    expect(typeof result.accessToken).toBe('string')
    expect(typeof result.refreshToken).toBe('string')
  })

  test('403: 정지된 게정으로 로그인한 경우', async () => {
    await sql`
      UPDATE "User"
      SET 
        "suspendedType" = 1, 
        "suspendedReason" = '계정이 정지되었습니다.'
      WHERE id = ${newUserId};`

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonTokenResponse)),
    )

    const response = await app.handle(
      new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }),
    )

    expect(response.status).toBe(403)
    expect(await response.text()).toBe('로그인 할 수 없습니다. 이유:\n계정이 정지되었습니다.')
  })

  test('403: 회원 탈퇴 후 로그인한 경우', async () => {
    await sql`
      DELETE FROM "User"
      WHERE id = ${newUserId};`

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonTokenResponse)),
    )

    const response = await app.handle(
      new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }),
    )

    expect(response.status).toBe(403)
    expect(await response.text()).toBe(
      '해당 BBaton 계정으로 이미 회원가입한 적이 있어서 다시 가입할 수 없습니다. 자세한 사항은 고객센터에 문의해주세요.',
    )
  })

  afterAll(async () => {
    await sql`
      DELETE FROM "OAuth"
      WHERE "userId" = ${newUserId};`

    await sql`
      DELETE FROM "User"
      WHERE id = ${newUserId};`
  })
})
