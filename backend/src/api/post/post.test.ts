import { beforeAll, describe, expect, spyOn, test } from 'bun:test'

import { app } from '../..'
import {
  validBBatonTokenResponse,
  validBBatonTokenResponse2,
  validBBatonUserResponse,
  validBBatonUserResponse2,
} from '../../../test/mock'
import { sql } from '../../../test/postgres'
import { MAX_HASHTAG_LENGTH } from '../../constants'
import { PostCategory, PostStatus } from '../../model/Post'

describe('POST /post', () => {
  let accessToken = ''
  let parentPostId = ''
  let commentPostId = ''
  const invalidUserId = '0'

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

  test('새로운 글을 작성합니다.', async () => {
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

  test('400: 없는 글에 댓글을 작성하는 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'Hello, world! comment',
          parentPostId: invalidUserId,
        }),
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('새로운 댓글을 작성합니다.', async () => {
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

  test('400: 없는 글을 인용하는 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'Hello, world! comment',
          referredPostId: invalidUserId,
        }),
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('다른 사람의 글을 인용합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: 'Hello, world! 인용',
            referredPostId: parentPostId,
          }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()
  })

  test('다른 사람의 댓글을 인용합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: 'Hello, world! 인용',
            referredPostId: commentPostId,
          }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()
  })

  test('400: 없는 글을 공유하는 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referredPostId: invalidUserId }),
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('다른 사람의 글을 공유합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ referredPostId: parentPostId }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()
  })

  test('다른 사람의 댓글을 공유합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ referredPostId: commentPostId }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()
  })

  test('400: 다른 사람의 댓글을 공유하는 댓글을 공유한 글에 작성합니다.', async () => {
    const response = await app.handle(
      new Request('http://localhost/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentPostId: commentPostId,
          referredPostId: commentPostId,
        }),
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('다른 사람의 댓글을 공유하는 댓글을 다른 글에 작성합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parentPostId: commentPostId,
            referredPostId: parentPostId,
          }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()
  })

  test('어떤 글에 다른 사람의 댓글을 공유하는 댓글을 작성합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parentPostId: commentPostId,
            referredPostId: parentPostId,
          }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()
  })

  test('400: 긴 해시태크을 작성한 경우', async () => {
    const response = await app.handle(
      new Request('http://localhost/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `#${'a'.repeat(MAX_HASHTAG_LENGTH + 1)} #${'b'.repeat(MAX_HASHTAG_LENGTH + 2)} #${'c'.repeat(MAX_HASHTAG_LENGTH + 3)} #${'d'.repeat(MAX_HASHTAG_LENGTH)}`,
        }),
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Bad Request')
  })

  test('해시태그를 넣은 글을 작성합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: '#Hello, #world!',
          }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    const hashtags = await sql<{ name: string }[]>`
      SELECT "Hashtag".name
      FROM "Hashtag"
      JOIN "PostHashtag" ON "PostHashtag"."hashtagId" = "Hashtag".id
      WHERE "postId" = ${result.id}
      ORDER BY name`

    expect(hashtags.slice(0)).toEqual([{ name: 'Hello' }, { name: 'world' }])
  })

  test('해시태그를 넣고 다른 사람의 글을 공유하는 댓글을 작성합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parentPostId,
            referredPostId: commentPostId,
            content: '#Hello, #world2!',
          }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    const hashtags = await sql<{ name: string }[]>`
      SELECT name
      FROM "Hashtag"
      JOIN "PostHashtag" ON "hashtagId" = id
      WHERE "postId" = ${result.id}
      ORDER BY name`

    expect(hashtags.slice(0)).toEqual([{ name: 'Hello' }, { name: 'world2' }])
  })

  test('유효하지 않은 해시태그는 데이터베이스에 저장하지 않습니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: '#H_ello, #sdf-asdf #adf.asdf # # #!' }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    const hashtags = await sql<{ name: string }[]>`
      SELECT name
      FROM "Hashtag"
      JOIN "PostHashtag" ON "hashtagId" = id
      WHERE "postId" = ${result.id}
      ORDER BY name`

    expect(hashtags.slice(0)).toEqual([{ name: 'H_ello' }, { name: 'adf' }, { name: 'sdf' }])
  })

  test('body의 모든 값을 채워서 요청합니다.', async () => {
    const result = await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: PostCategory.GENERAL,
            content: '#H_ello, #sdf-asdf #adf.asdf # # #!',
            imageURLs: ['https://example.com/image.jpg'],
            parentPostId,
            publishAt: new Date(Date.now() + 1000 * 3600).toISOString(), // 1시간 후 공개
            referredPostId: commentPostId,
            status: PostStatus.ANNONYMOUS, // 익명으로 글 쓰기
          }),
        }),
      )
      .then((response) => response.json())

    expect(typeof result.id).toBe('string')
    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    const hashtags = await sql<{ name: string }[]>`
      SELECT name
      FROM "Hashtag"
      JOIN "PostHashtag" ON "PostHashtag"."hashtagId" = "Hashtag".id
      WHERE "postId" = ${result.id}
      ORDER BY name`

    expect(hashtags.slice(0)).toEqual([{ name: 'H_ello' }, { name: 'adf' }, { name: 'sdf' }])
  })

  let accessToken2 = ''

  test('회원가입2', async () => {
    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonTokenResponse2)),
    )

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonUserResponse2)),
    )

    const result = await app
      .handle(new Request('http://localhost/auth/bbaton?code=1', { method: 'POST' }))
      .then((response) => response.json())

    expect(result).toHaveProperty('accessToken')
    expect(result).toHaveProperty('refreshToken')
    expect(typeof result.accessToken).toBe('string')
    expect(typeof result.refreshToken).toBe('string')

    accessToken2 = result.accessToken
  })

  test('400: 상위 글을 볼 권한이 있고 해당 글에 댓글을 작성할 수 있는지 확인합니다.', async () => {
    // ...
  })

  test('400: 인용한 글을 볼 권한이 있는지 확인합니다.', async () => {
    // ...
  })
})
