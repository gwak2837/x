import { beforeAll, describe, expect, spyOn, test } from 'bun:test'

import { app } from '../..'
import { validBBatonTokenResponse, validBBatonUserResponse } from '../../../test/mock'
import { sql } from '../../../test/postgres'

describe('POST /post', () => {
  let accessToken = ''
  let parentPostId = ''
  let commentPostId = ''

  beforeAll(async () => {
    await sql`DELETE FROM "OAuth"`
    await sql`DELETE FROM "User"`
    await sql`DELETE FROM "Post"`
  })

  test('200: 회원가입', async () => {
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

    accessToken = result.accessToken
  })

  test('422: 요청 헤더에 `Authorization`가 없는 경우', async () => {
    const response = await app.handle(new Request('http://localhost/post', { method: 'POST' }))

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      summary: "Property 'authorization' is missing",
    })
  })

  test('422: 요청에 body가 없는 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/post', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    )

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      summary: 'Expected object',
    })
  })

  test('401: JWT 토큰이 유효하지 않은 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer 123123`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })

  test('400: body를 빈 객체로 설정한 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('400: body의 `publishAt`이 유효하지 않은 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'Hello, world!',
          publishAt: '1990-01-01T00:00:00Z',
        }),
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('200: 새로운 글을 작성합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: 'Hello, world!' }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(typeof result.createdAt).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    parentPostId = result.id
  })

  test('200: 새로운 댓글을 작성합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: 'Hello, world! comment',
            parentPostId,
          }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    commentPostId = result.id
  })

  test('다른 사람의 글을 인용합니다.', async () => {
    // referredPostId
  })

  test('다른 사람의 글을 공유합니다.', async () => {
    // referredPostId, content: null
  })

  // 오류 테스트

  test('상위 글이 존재하고 볼 권한이 있고 해당 글에 댓글을 작성할 수 있는지 확인합니다.', async () => {
    // ...
  })

  test('인용한 글이 존재하고 볼 권한이 있는지 확인합니다.', async () => {
    // ...
  })

  test('인용한 글을 볼 권한이 있는지 확인합니다.', async () => {
    // ...
  })
})
