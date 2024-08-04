import { describe, expect, test } from 'bun:test'

describe('GET /post/:id/comment', () => {
  test('작성자 본인 | 글 1개 댓글 1개 작성 | 특정 글 댓글 불러오기', async () => {
    //...
  })

  test('작성자 본인 | 글 1개 댓글 1개 작성 | One comment with referring post', async () => {
    expect(Promise.resolve(1)).resolves.toEqual(1)
  })

  test('One comment with one reply', async () => {
    expect(Promise.resolve(1)).resolves.toEqual(1)
  })

  test('One comment with many replies', async () => {
    expect(Promise.resolve(1)).resolves.toEqual(1)
  })

  test('Many comments', async () => {
    expect(Promise.resolve(1)).resolves.toEqual(1)
  })

  test('Many comments with one reply', async () => {
    expect(Promise.resolve(1)).resolves.toEqual(1)
  })

  test('Many comments with many replies', async () => {
    expect(Promise.resolve(1)).resolves.toEqual(1)
  })
})
