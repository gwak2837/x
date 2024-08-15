export const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
export const NEXT_PUBLIC_BBATON_CLIENT_ID = process.env.NEXT_PUBLIC_BBATON_CLIENT_ID ?? ''
export const NEXT_PUBLIC_BBATON_REDIRECT_URI = process.env.NEXT_PUBLIC_BBATON_REDIRECT_URI ?? ''

export const NEXT_PUBLIC_VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL ?? ''
const NEXT_PUBLIC_VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV ?? ''

export const APPLICATION_NAME = '자유담 - 자유로운 이야기'
export const APPLICATION_SHORT_NAME = '자유담'
export const DESCRIPTION =
  'BDSM 고사를 통해 깊이 있는 BDSM 지식을 검증해보세요. BDSM에 대한 폭넓고 심층적인 지식을 확인하고 향상할 수 있는 기회를 제공합니다.'
export const CATEGORY = 'BDSM'
export const KEYWORDS = [
  APPLICATION_SHORT_NAME,
  CATEGORY,
  '고사',
  '지식',
  '테스트',
  '퀴즈',
  '시험',
  'exam',
  'test',
] // 최대 10개
export const AUTHOR = ''
export const THEME_COLOR = '#39375B'
export const CANONICAL_URL =
  NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://bdsm.vercel.app'
    : NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? `https://${NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000'
