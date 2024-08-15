import type { LayoutProps } from '@/types/nextjs'
import type { ReactNode } from 'react'

import Dolphin from '@/svg/Dolphin'
import Link from 'next/link'

import ProfileButton from './ProfileButton'

export default function Layout({ children, params }: LayoutProps) {
  const locale = params.locale

  return (
    <div className="mx-auto h-full max-w-screen-xl grid-cols-[auto_1fr] gap-2 sm:grid">
      <header
        className="fixed bottom-0 grid w-full grid-cols-[3fr_1fr] flex-col justify-between gap-2 p-2 sm:relative sm:flex"
        role="banner"
      >
        <nav
          className="grid grid-cols-3 justify-center gap-2 text-center sm:grid-cols-none"
          role="navigation"
        >
          <Dolphin className="text-midnight-500 hidden h-16 w-16 overflow-hidden rounded sm:block" />
          <Link href={`/${locale}`}>{dict.홈[locale]}</Link>
          <Link href={`/${locale}/post`}>{dict.글[locale]}</Link>
          <Link href={`/${locale}/post/create`}>{dict.작성[locale]}</Link>
        </nav>
        <ProfileButton />
      </header>
      {children}
    </div>
  )
}

const dict = {
  홈: {
    ko: '홈',
    en: 'Home',
  },
  고사: {
    ko: '고사',
    en: 'Exam',
  },
  로그인: {
    ko: '로그인',
    en: 'Login',
  },
  글: {
    ko: '글',
    en: 'Posts',
  },
  작성: {
    ko: '작성',
    en: 'Create',
  },
} as const
