import { beforeAll, describe, expect, spyOn, test } from 'bun:test'

import { app } from '../../..'
import { validBBatonTokenResponse, validBBatonUserResponse } from '../../../../test/mock'
import { sql } from '../../../../test/postgres'

describe('DELETE /post/[id]', () => {
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
    expect(typeof result.accessToken).toBe('string')

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
      new Request(`http://localhost/post/${postId}`, { method: 'DELETE' }),
    )

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      summary: "Property 'authorization' is missing",
    })
  })

  test('401: JWT 토큰이 유효하지 않은 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/post/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer 123123' },
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })

  test('404: 없는 게시글 삭제를 요청하는 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/post/${invalidPostId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    )

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('NOT_FOUND')
  })

  test('게시글을 삭제합니다.', async () => {
    const result = await app
      .handle(
        new Request(`http://localhost/post/${postId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(typeof result.deletedAt).toBe('string')
    expect(new Date(result.deletedAt).getTime()).not.toBeNaN()
  })

  test('기존 해시태그와 삭제된 게시글과의 관계도 삭제됐는지 확인합니다.', async () => {
    const postHashtags = await sql<{ name: string }[]>`
      SELECT "postId"
      FROM "PostHashtag"
      WHERE "postId" = ${postId}`

    expect(postHashtags.length).toBe(0)

    const hashtags = await sql<{ name: string }[]>`
      SELECT name
      FROM "Hashtag"
      WHERE name IN ('hash', 'tag')`

    expect(hashtags.length).toBe(2)
  })
})
