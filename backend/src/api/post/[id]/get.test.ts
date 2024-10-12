import { beforeAll, describe, expect, spyOn, test } from 'bun:test'

import type { POSTAuthBBatonResponse200 } from '../../auth/bbaton/post'
import type { POSTPostResponse200 } from '../post'
import type { GETPostId } from './get'

import { app } from '../../..'
import { validBBatonTokenResponse, validBBatonUserResponse } from '../../../../test/mock'
import { sql } from '../../../../test/postgres'
import { POSTGRES_MAX_BIGINT_STRING } from '../../../plugin/postgres'

describe('GET /post/:id', () => {
  let accessToken = ''
  let postId = ''
  let postId2 = ''
  let postId3 = ''
  let postId4 = ''

  beforeAll(async () => {
    await sql`DELETE FROM "Post"`
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

    const result = (await app
      .handle(new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }))
      .then((response) => response.json())) as POSTAuthBBatonResponse200

    expect(result).toHaveProperty('accessToken')
    expect(typeof result.accessToken).toBe('string')

    accessToken = result.accessToken
  })

  test('새로운 글을 작성합니다.', async () => {
    const result = (await app
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
      .then((response) => response.json())) as POSTPostResponse200

    expect(typeof result.id).toBe('string')
    postId = result.id

    const result2 = (await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: 'Hello, world!',
            parentPostId: result.id,
          }),
        }),
      )
      .then((response) => response.json())) as POSTPostResponse200

    expect(typeof result2.id).toBe('string')
    postId2 = result2.id

    const result3 = (await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: 'Hello, world!',
            parentPostId: result2.id,
          }),
        }),
      )
      .then((response) => response.json())) as POSTPostResponse200

    expect(typeof result3.id).toBe('string')
    postId3 = result3.id

    const result4 = (await app
      .handle(
        new Request('http://localhost/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: 'Hello, world!',
            parentPostId: result3.id,
          }),
        }),
      )
      .then((response) => response.json())) as POSTPostResponse200

    expect(typeof result4.id).toBe('string')
    postId4 = result4.id
  })

  test('404: `postId`가 8 bytes 정수 최댓값인 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/post/${POSTGRES_MAX_BIGINT_STRING}`),
    )

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('NOT_FOUND')
  })

  test('422: `postId`가 숫자가 아닌 경우', async () => {
    const response = await app.handle(new Request(`http://localhost/post/ㅁㄴㅇㄹ`))

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      summary: 'Expected string length less or equal to 19',
    })
  })

  test('404: `postId`가 숫자가 아닌 경우', async () => {
    const response = await app.handle(
      new Request(`http://localhost/post/${postId4}?include=parent-`),
    )

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({ summary: "Expected 'parent-post'" })
  })

  test('글을 조회합니다.', async () => {
    const result = (await app
      .handle(new Request(`http://localhost/post/${postId4}`))
      .then((response) => response.json())) as GETPostId

    expect(result).toEqual(
      expect.objectContaining({
        id: postId4,
        createdAt: expect.any(String),
        publishAt: expect.any(String),
        status: 0,
        content: 'Hello, world!',
        author: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          nickname: expect.any(String),
        }),
      }),
    )
  })

  test('상위 글을 조회합니다.', async () => {
    const result = (await app
      .handle(new Request(`http://localhost/post/${postId4}?include=parent-post`))
      .then((response) => response.json())) as GETPostId

    expect(result.parentPosts).toBeArrayOfSize(3)

    result.parentPosts!.forEach((item) => {
      expect(item).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          createdAt: expect.any(String),
          publishAt: expect.any(String),
          status: 0,
          content: 'Hello, world!',
          author: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            nickname: expect.any(String),
          }),
        }),
      )
    })

    expect(result.id).toEqual(postId4)
    expect(result.parentPosts![0].id).toEqual(postId)
    expect(result.parentPosts![1].id).toEqual(postId2)
    expect(result.parentPosts![2].id).toEqual(postId3)
  })
})
