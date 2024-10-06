import type { PageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BBATON_CLIENT_ID, NEXT_PUBLIC_BBATON_REDIRECT_URI } from '@/common/constants'
import { dict } from '@/common/dict'
import { Suspense } from 'react'

import Login from './Login'

export default async function Page({ params }: PageProps) {
  const locale = params.locale

  return (
    <main className="flex h-full items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="flex w-full max-w-lg flex-col items-center justify-center rounded-lg bg-white px-6 py-12 shadow-lg dark:bg-gray-800">
        <h1 className="mb-8 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          {dict.자유담_로그인[locale]}
        </h1>
        <div className="grid w-full gap-4 text-center sm:text-lg">
          <a
            className="flex w-full items-center justify-center gap-2 rounded border border-transparent bg-[#0070BC] px-4 py-2 font-medium text-white transition-transform active:scale-95"
            href={`https://bauth.bbaton.com/oauth/authorize?client_id=${NEXT_PUBLIC_BBATON_CLIENT_ID}&redirect_uri=${NEXT_PUBLIC_BBATON_REDIRECT_URI}&response_type=code&scope=read_profile`}
          >
            <span className="text-2xl font-bold leading-5">B</span>
            {dict.비바톤_익명인증[locale]}
          </a>
          <button className="flex w-full items-center justify-center gap-2 rounded border bg-white px-4 py-2 font-medium text-gray-700 transition-transform hover:bg-gray-100 active:scale-95 dark:border-transparent dark:bg-white dark:text-gray-700 dark:hover:bg-gray-200">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            {dict.구글_로그인[locale]}
          </button>
          <Suspense>
            <Login />
          </Suspense>
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
      </div>
    </main>
  )
}
