import type { LayoutProps } from '@/types/nextjs'

import BellIcon from '@/svg/BellIcon'
import Dolphin from '@/svg/Dolphin'
import HomeIcon from '@/svg/HomeIcon'
import PostIcon from '@/svg/PostIcon'
import SearchIcon from '@/svg/SearchIcon'
import Link from 'next/link'

import NavigationLink from './NavigationLink'
import ProfileLink from './ProfileButton'
import PublishButton from './PublishButton'

export default function Layout({ children, params }: LayoutProps) {
  const locale = params.locale

  return (
    <div className="mx-auto h-full max-w-screen-xl grid-cols-[auto_1fr] gap-2 sm:grid">
      <header
        className="pb-safe fixed bottom-0 grid w-full grid-cols-[4fr_1fr] overflow-y-auto border-t border-gray-300 backdrop-blur sm:left-0 sm:flex sm:h-full sm:w-20 sm:flex-col sm:justify-between sm:gap-8 sm:border-r-2 sm:border-t-0 sm:p-2 xl:inset-auto xl:w-72 xl:max-w-screen-xl dark:border-gray-700"
        role="banner"
      >
        <nav
          className="grid grid-cols-4 whitespace-nowrap sm:grid-cols-none sm:gap-2 xl:text-xl xl:leading-6"
          role="navigation"
        >
          <Link className="hidden p-2 sm:block" href={`/${locale}/exam`}>
            <Dolphin className="text-midnight-500 h-12 w-12 rounded" />
          </Link>
          <NavigationLink Icon={HomeIcon} href={`/${locale}/exam`}>
            {dict.홈[locale]}
          </NavigationLink>
          <NavigationLink Icon={SearchIcon} href={`/${locale}/search`}>
            {dict.검색[locale]}
          </NavigationLink>
          <NavigationLink Icon={PostIcon} href={`/${locale}/post`}>
            {dict.글[locale]}
          </NavigationLink>
          <NavigationLink Icon={BellIcon} href={`/${locale}/notification`}>
            {dict.알림[locale]}
          </NavigationLink>
          <NavigationLink
            Icon={SearchIcon}
            className="hidden sm:block"
            href={`/${locale}/bookmark`}
          >
            {dict.북마크[locale]}
          </NavigationLink>
          <PublishButton />
        </nav>
        <ProfileLink />
      </header>
      <div className="w-0 sm:w-20 xl:w-72" />
      {children}
    </div>
  )
}

const dict = {
  홈: {
    ko: '홈',
    en: 'Home',
  },
  검색: {
    ko: '검색',
    en: 'Search',
  },
  글: {
    ko: '글',
    en: 'Posts',
  },
  알림: {
    ko: '알림',
    en: 'Notification',
  },
  북마크: {
    ko: '북마크',
    en: 'Bookmark',
  },
  로그인: {
    ko: '로그인',
    en: 'Login',
  },
} as const