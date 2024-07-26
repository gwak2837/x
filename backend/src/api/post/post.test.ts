import { describe, test } from 'bun:test'

describe('POST /post', () => {
  test('새로운 글을 작성합니다.', async () => {
    // content, parentPostId: null, referredPostId: null
  })

  test('새로운 댓글을 작성합니다.', async () => {
    // parentPostId
  })

  test('다른 사람의 글을 인용합니다.', async () => {
    // referredPostId
  })

  test('다른 사람의 글을 공유합니다.', async () => {
    // referredPostId, content: null
  })

  // 오류 테스트
  test('로그인 정보가 없으면 글을 작성할 수 없습니다.', async () => {
    // headers.authorization: null
  })

  test('`publishAt` 값의 유효성을 검사합니다.', async () => {
    // ...
  })

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
