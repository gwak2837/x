import { beforeAll, describe, expect, setSystemTime, spyOn, test } from 'bun:test'

import type { POSTAuthBBatonResponse200 } from '../../../auth/bbaton/post'
import type { PATCHUserIdResponse200 } from '../patch'
import type { GETUserIdFollowerResponse200 } from './get'
import type { POSTUserIdFollowerResponse200 } from './post'

import { app } from '../../../..'
import {
  validBBatonTokenResponse,
  validBBatonTokenResponse2,
  validBBatonTokenResponse3,
  validBBatonTokenResponse4,
  validBBatonUserResponse,
  validBBatonUserResponse2,
  validBBatonUserResponse3,
  validBBatonUserResponse4,
} from '../../../../../test/mock'
import { sql } from '../../../../../test/postgres'
import { UserFollowStatus } from '../../../../model/User'

describe('GET /user/:id/follower', () => {
  // 공개 계정
  let accessToken = ''
  let publicUserId = ''
  let accessToken3 = ''
  let publicUserId3 = ''
  let accessToken4 = ''
  let publicUserId4 = ''

  // 비공개 계정
  let accessToken2 = ''
  let privateUserId2 = ''

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

    const result = (await app
      .handle(new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }))
      .then((response) => response.json())) as POSTAuthBBatonResponse200

    expect(result).toHaveProperty('accessToken')
    expect(typeof result.accessToken).toBe('string')

    accessToken = result.accessToken
    publicUserId = JSON.parse(atob(accessToken.split('.')[1])).sub
  })

  test('회원가입2', async () => {
    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonTokenResponse2)),
    )

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonUserResponse2)),
    )

    const result = (await app
      .handle(new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }))
      .then((response) => response.json())) as POSTAuthBBatonResponse200

    expect(result).toHaveProperty('accessToken')
    expect(typeof result.accessToken).toBe('string')

    accessToken2 = result.accessToken
    privateUserId2 = JSON.parse(atob(accessToken2.split('.')[1])).sub

    const result2 = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken2}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isPrivate: true }),
        }),
      )
      .then((response) => response.json())) as PATCHUserIdResponse200

    expect(result2.id).toBe(privateUserId2)
  })

  test('회원가입3', async () => {
    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonTokenResponse3)),
    )

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonUserResponse3)),
    )

    const result = (await app
      .handle(new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }))
      .then((response) => response.json())) as POSTAuthBBatonResponse200

    expect(result).toHaveProperty('accessToken')
    expect(typeof result.accessToken).toBe('string')

    accessToken3 = result.accessToken
    publicUserId3 = JSON.parse(atob(accessToken3.split('.')[1])).sub
  })

  test('회원가입4', async () => {
    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonTokenResponse4)),
    )

    spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(validBBatonUserResponse4)),
    )

    const result = (await app
      .handle(new Request('http://localhost/auth/bbaton?code=123', { method: 'POST' }))
      .then((response) => response.json())) as POSTAuthBBatonResponse200

    expect(result).toHaveProperty('accessToken')
    expect(typeof result.accessToken).toBe('string')

    accessToken4 = result.accessToken
    publicUserId4 = JSON.parse(atob(accessToken4.split('.')[1])).sub
  })

  test('사용자2가 사용자1을 팔로우합니다.', async () => {
    const result = (await app
      .handle(
        new Request(`http://localhost/user/${publicUserId}/follower`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken2}` },
        }),
      )
      .then((response) => response.json())) as POSTUserIdFollowerResponse200

    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    const result2 = (await app
      .handle(new Request(`http://localhost/user/${publicUserId}/follower`))
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    expect(result2.length).toBe(1)
    expect(result2[0].id).toBe(privateUserId2)
  })

  test('사용자3이 사용자2에게 팔로우를 요청하고 사용자2가 수락합니다.', async () => {
    // 사용자3 -> 사용자2 팔로우 요청
    const result = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken3}` },
        }),
      )
      .then((response) => response.json())) as POSTUserIdFollowerResponse200

    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    // 사용자2 팔로워 목록
    const result2 = await app.handle(
      new Request(`http://localhost/user/${privateUserId2}/follower`),
    )

    expect(result2.status).toBe(404)
    expect(await result2.text()).toBe('NOT_FOUND')

    const result3 = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          headers: { Authorization: `Bearer ${accessToken2}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    expect(result3.length).toBe(1)
    expect(result3[0].id).toBe(publicUserId3)
    expect(result3[0].status).toBe(UserFollowStatus.PENDING)

    // 사용자2 -> 사용자3 팔로우 요청 승인
    const result4 = await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken2}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userIds: [publicUserId3],
            status: UserFollowStatus.ACCEPTED,
          }),
        }),
      )
      .then((response) => response.json())

    expect(result4).toEqual([{ id: publicUserId3, createdAt: result.createdAt }])

    // 사용자2 팔로워 목록
    const result5 = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          headers: { Authorization: `Bearer ${accessToken2}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    expect(result5.length).toBe(1)
    expect(result5[0].id).toBe(publicUserId3)
  })

  test('사용자4가 사용자2에게 팔로우를 요청하고 사용자2가 수락합니다.', async () => {
    // 사용자4 -> 사용자2 팔로우 요청
    const result = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken4}` },
        }),
      )
      .then((response) => response.json())) as POSTUserIdFollowerResponse200

    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    // 사용자2 팔로워 목록
    const result2 = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          headers: { Authorization: `Bearer ${accessToken2}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    expect(result2.length).toBe(2)
    expect(result2[0].id).toBe(publicUserId3)
    expect(result2[0].status).toBe(UserFollowStatus.ACCEPTED)
    expect(result2[1].id).toBe(publicUserId4)
    expect(result2[1].status).toBe(UserFollowStatus.PENDING)

    // 사용자2 -> 사용자4 팔로우 요청 승인
    const result3 = await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken2}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userIds: [publicUserId4],
            status: UserFollowStatus.ACCEPTED,
          }),
        }),
      )
      .then((response) => response.json())

    expect(result3).toEqual([{ id: publicUserId4, createdAt: result.createdAt }])

    // 사용자2 팔로워 목록
    const result4 = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          headers: { Authorization: `Bearer ${accessToken2}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    expect(result4.length).toBe(2)
    expect(result4[0].id).toBe(publicUserId3)
    expect(result4[1].id).toBe(publicUserId4)
  })

  test('공개 계정의 팔로워 목록은 비로그인 사용자에게 보여집니다.', async () => {
    const result = (await app
      .handle(new Request(`http://localhost/user/${publicUserId}/follower`))
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    expect(result.length).toBe(1)
    expect(result[0].id).toBe(privateUserId2)
  })

  test('공개 계정의 팔로워 목록은 로그인 사용자에게 보여집니다.', async () => {
    const result = (await app
      .handle(
        new Request(`http://localhost/user/${publicUserId}/follower`, {
          headers: { Authorization: `Bearer ${accessToken3}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    expect(result.length).toBe(1)
    expect(result[0].id).toBe(privateUserId2)
  })

  test('404: 비밀 계정의 팔로워 목록은 비로그인 시 볼 수 없습니다.', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/${privateUserId2}/follower`),
    )

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('NOT_FOUND')
  })

  test('404: 비밀 계정의 팔로워 목록은 팔로우하지 않은 사용자는 볼 수 없습니다.', async () => {
    const response = await app.handle(
      new Request(`http://localhost/user/${privateUserId2}/follower`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    )

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('NOT_FOUND')
  })

  test('비밀 계정의 팔로워 목록은 팔로워에게만 보여집니다.', async () => {
    const result = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          headers: { Authorization: `Bearer ${accessToken3}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    expect(result.length).toBe(2)
    expect(result[0].id).toBe(publicUserId3)
    expect(result[1].id).toBe(publicUserId4)
  })

  test('공개 계정: 자신의 팔로워 목록은 항상 보여집니다.', async () => {
    const result = (await app
      .handle(
        new Request(`http://localhost/user/${publicUserId}/follower`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    expect(result.length).toBe(1)
    expect(result[0].id).toBe(privateUserId2)
  })

  test('비밀 계정: 자신의 팔로워 목록은 항상 보여집니다.', async () => {
    const result2 = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          headers: { Authorization: `Bearer ${accessToken2}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    expect(result2.length).toBe(2)
    expect(result2[0].id).toBe(publicUserId3)
    expect(result2[1].id).toBe(publicUserId4)
  })

  test('미승인된 팔로우 요청은 팔로워 목록에 포함되지 않습니다.', async () => {
    // 사용자1 -> 사용자2 팔로우 요청
    const result = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      )
      .then((response) => response.json())) as POSTUserIdFollowerResponse200

    expect(new Date(result.createdAt).getTime()).not.toBeNaN()

    // 사용자2 팔로워 목록
    const result2 = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          headers: { Authorization: `Bearer ${accessToken3}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    const followerIds2 = result2.map((follower) => follower.id).sort()

    expect(followerIds2.length).toBe(2)
    expect(followerIds2).toEqual([publicUserId3, publicUserId4].sort())

    const result3 = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          headers: { Authorization: `Bearer ${accessToken2}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    const followerIds3 = result3.map((follower) => follower.id).sort()

    expect(followerIds3.length).toBe(3)
    expect(followerIds3).toEqual([publicUserId, publicUserId3, publicUserId4].sort())

    // 사용자1 -> 사용자2 팔로우 요청 승인
    const result4 = await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken2}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userIds: [publicUserId],
            status: UserFollowStatus.ACCEPTED,
          }),
        }),
      )
      .then((response) => response.json())

    expect(result4).toEqual([{ id: publicUserId, createdAt: result.createdAt }])

    // 사용자2 팔로워 목록
    const result5 = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          headers: { Authorization: `Bearer ${accessToken3}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    const followerIds5 = result5.map((follower) => follower.id).sort()

    expect(followerIds5.length).toBe(3)
    expect(followerIds5).toEqual([publicUserId, publicUserId3, publicUserId4].sort())

    const result6 = (await app
      .handle(
        new Request(`http://localhost/user/${privateUserId2}/follower`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      )
      .then((response) => response.json())) as GETUserIdFollowerResponse200

    const followerIds6 = result6.map((follower) => follower.id).sort()

    expect(followerIds6.length).toBe(3)
    expect(followerIds6).toEqual([publicUserId, publicUserId3, publicUserId4].sort())
  })

  test('거절된 팔로우 요청은 팔로워 목록에 포함되지 않습니다.', async () => {
    //
  })
})
