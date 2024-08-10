import { describe, expect, spyOn, test } from 'bun:test'

import { type GETReadyResponse200, app } from './index'

describe('backend/src/index.ts', () => {
  test('GET /', async () => {
    const response = await app.handle(new Request('http://localhost/')).then((res) => res.json())

    expect(response).toEqual({
      ENV: process.env.ENV,
      NODE_ENV: process.env.NODE_ENV,
    })
  })

  test('GET /live', async () => {
    const mockValue = 1_000_000
    spyOn(Bun, 'nanoseconds').mockReturnValueOnce(mockValue)

    const result = await app.handle(new Request('http://localhost/live')).then((res) => res.json())

    expect(result).toEqual({ uptime: mockValue })
  })

  test('GET /ready', async () => {
    const result = (await app
      .handle(new Request('http://localhost/ready'))
      .then((res) => res.json())) as GETReadyResponse200

    expect(new Date(result.current_timestamp).getTime()).not.toBeNaN()
  })
})
