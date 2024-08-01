import { beforeAll, describe, expect, spyOn, test } from 'bun:test'

import { app } from '../../..'
import { validBBatonTokenResponse, validBBatonUserResponse } from '../../../../test/mock'
import { sql } from '../../../../test/postgres'

describe('PATCH /post/[id]', () => {
  let accessToken = ''
  let postId = ''
  const invalidPostId = '0'

  beforeAll(async () => {
    await sql`DELETE FROM "PostHashtag"`
    await sql`DELETE FROM "Post"`
    await sql`DELETE FROM "Hashtag"`
    await sql`DELETE FROM "OAuth"`
    await sql`DELETE FROM "User"`
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
    expect(result).toHaveProperty('refreshToken')
    expect(typeof result.accessToken).toBe('string')
    expect(typeof result.refreshToken).toBe('string')

    accessToken = result.accessToken
  })

  test('새로운 글을 작성합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: 'Hello, world! #hash #tag 123' }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(typeof result.createdAt).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    postId = result.id

    const hashtags = await sql<{ name: string }[]>`
      SELECT name
      FROM "Hashtag"
      JOIN "PostHashtag" ON "hashtagId" = id
      WHERE "postId" = ${result.id}`

    expect(hashtags.slice(0)).toEqual([{ name: 'hash' }, { name: 'tag' }])
  })

  test('422: 요청 헤더에 `Authorization`가 없는 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/post/${postId}`, { method: 'PATCH' }),
    )

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      summary: "Property 'authorization' is missing",
    })
  })

  test('422: body가 없는 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/post/${postId}`, {
        method: 'PATCH',
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
      new Request(`http://localhost/post/${postId}`, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer 123123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: 'Hello, world! #hash #tag 123' }),
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })

  test('404: 없는 게시글 수정을 요청하는 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/post/${invalidPostId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: 'Hello, world!' }),
      }),
    )

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('NOT_FOUND')
  })

  test('`content` 있으면 해당 값에 따라 기존 해시태그 관계 재설정하기', async () => {
    const prevHashtags = await sql<{ name: string }[]>`
      SELECT "Hashtag".name
      FROM "Hashtag"
      JOIN "PostHashtag" ON "PostHashtag"."hashtagId" = "Hashtag".id
      WHERE "Hashtag".name IN ('hash', 'tag') AND "PostHashtag"."postId" = ${postId}`

    expect(prevHashtags.length).toBe(2)

    const result = await app
      .handle(
        new Request(`http://localhost/post/${postId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: 'Hello, world! #apple #banana' }),
        }),
      )
      .then((response) => response.json())

    expect(result.id).toBe(postId)
    expect(new Date(result.updatedAt).getTime()).not.toBeNaN()

    const prevHashtags2 = await sql<{ name: string }[]>`
      SELECT "Hashtag".name
      FROM "Hashtag"
      JOIN "PostHashtag" ON "PostHashtag"."hashtagId" = "Hashtag".id
      WHERE "Hashtag".name IN ('hash', 'tag') AND "PostHashtag"."postId" = ${postId}`

    expect(prevHashtags2.length).toBe(0)

    const newHashtags = await sql<{ name: string }[]>`
      SELECT "Hashtag".name
      FROM "Hashtag"
      JOIN "PostHashtag" ON "PostHashtag"."hashtagId" = "Hashtag".id
      WHERE "Hashtag".name IN ('apple', 'banana') AND "PostHashtag"."postId" = ${postId}`

    expect(newHashtags.length).toBe(2)
  })
})
