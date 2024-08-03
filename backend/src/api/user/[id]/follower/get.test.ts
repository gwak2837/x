import { beforeAll, describe, expect, setSystemTime, spyOn, test } from 'bun:test'

import { app } from '../../../..'
import { validBBatonTokenResponse, validBBatonUserResponse } from '../../../../../test/mock'
import { sql } from '../../../../../test/postgres'

describe('GET /user/[id]/follower', () => {
  let accessToken = ''
  let accessToken2 = ''
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
  })

  test('회원가입2', async () => {
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

    accessToken2 = result.accessToken
  })
})
