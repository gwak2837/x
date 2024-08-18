import type { PageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BBATON_CLIENT_ID, NEXT_PUBLIC_BBATON_REDIRECT_URI } from '@/common/constants'

import Login from './Login'

export default async function Page({ params }: PageProps) {
  const locale = params.locale

  return (
    <main className="flex h-full items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
      <main className="flex w-full max-w-lg flex-col items-center justify-center rounded-lg bg-white px-6 py-12 shadow-lg dark:bg-gray-800">
        <h1 className="mb-8 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          {dict.자유담_로그인[locale]}
        </h1>
        <div className="grid w-full gap-4 text-center sm:text-lg">
          <a
            className="flex w-full items-center justify-center gap-2 rounded border border-transparent bg-[#0070BC] px-4 py-2 font-medium text-white hover:saturate-150"
            href={`https://bauth.bbaton.com/oauth/authorize?client_id=${NEXT_PUBLIC_BBATON_CLIENT_ID}&redirect_uri=${NEXT_PUBLIC_BBATON_REDIRECT_URI}&response_type=code&scope=read_profile`}
          >
            <span className="text-2xl font-bold leading-5">B</span>
            {dict.비바톤_익명인증[locale]}
          </a>
          <button className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:border-transparent dark:bg-white dark:text-gray-700 dark:hover:bg-gray-200">
            <svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M47.5 24.5c0-1.5-.1-2.9-.3-4.3H24v8.1h13.2c-.5 2.9-2.1 5.4-4.4 7.1v5.9h7.2c4.2-3.9 6.5-9.7 6.5-16.8z"
                fill="#4285F4"
              />
              <path
                d="M24 48c6 0 11-2 14.6-5.3l-7.2-5.9c-2 1.3-4.7 2.1-7.4 2.1-5.7 0-10.5-3.9-12.2-9.1H4v5.7C7.7 42.1 15.1 48 24 48z"
                fill="#34A853"
              />
              <path
                d="M11.8 29.8c-1-2.9-1-6.1 0-9.1V15h-7.5C1.1 18.8 0 21.8 0 24.5s1.1 5.7 3.3 9.1l7.5-3.8z"
                fill="#FBBC05"
              />
              <path
                d="M24 9.5c3 0 5.7 1 7.8 3l5.9-5.9C33.8 2.5 29.8 0 24 0 15.1 0 7.7 5.9 4 14.3l7.5 5.7C13.5 13.4 18.3 9.5 24 9.5z"
                fill="#EA4335"
              />
            </svg>
            {dict.구글_로그인[locale]}
          </button>
          <Login />
        </div>
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          {dict.본_서비스에_로그인하는_것으로[locale]}{' '}
          <a className="underline" href={`/${locale}/doc/terms-of-service`}>
            {dict.서비스이용약관[locale]}
          </a>{' '}
          {dict.및[locale]}{' '}
          <a className="underline" href={`/${locale}/doc/privacy-policy`}>
            {dict.개인정보_처리방침[locale]}
          </a>
          {dict.에_동의한_것으로_간주합니다[locale]}
        </p>
      </main>
    </main>
  )
}

const dict = {
  자유담_로그인: {
    ko: '자유담 로그인',
    en: 'Sign in Jayudam',
  },
  비바톤_익명인증: {
    ko: '비바톤 익명인증',
    en: 'Anonymous with BBaton',
  },
  구글_로그인: {
    ko: '구글 로그인',
    en: 'Sign in with Google',
  },
  본_서비스에_로그인하는_것으로: {
    ko: '본 서비스에 로그인함으로써',
    en: 'By signing in our service, you agree to our',
  },
  서비스이용약관: {
    ko: '이용약관',
    en: 'Terms of Service',
  },
  및: {
    ko: '및',
    en: 'and',
  },
  개인정보_처리방침: {
    ko: '개인정보 처리방침',
    en: 'Privacy Policy',
  },
  에_동의한_것으로_간주합니다: {
    ko: '에 동의하는 것으로 간주합니다.',
    en: '.',
  },
} as const
