import type { LayoutProps } from '@/types/nextjs'

import { dict } from '@/common/dict'
import BellIcon from '@/svg/BellIcon'
import BookmarkIcon from '@/svg/BookmarkIcon'
import Dolphin from '@/svg/Dolphin'
import HomeIcon from '@/svg/HomeIcon'
import PostIcon from '@/svg/PostIcon'
import SearchIcon from '@/svg/SearchIcon'
import Link from 'next/link'

import LoginLink from './LoginLink'
import NavigLink from './NavigLink'
import PublishButton from './PublishButton'

export default function Layout({ children, params }: LayoutProps) {
  const locale = params.locale

  return (
    <div className="mx-auto grid h-full max-w-screen-md grid-rows-[auto_1fr] sm:grid-cols-[auto_1fr] lg:max-w-screen-lg xl:max-w-screen-xl">
      <header
        className="pb-safe sticky bottom-0 z-10 order-2 grid h-fit w-full max-w-screen-md grid-cols-[4fr_1fr] overflow-y-auto border-t border-gray-300 backdrop-blur sm:fixed sm:inset-auto sm:flex sm:h-full sm:w-20 sm:flex-col sm:justify-between sm:gap-8 sm:border-r sm:border-t-0 sm:p-2 lg:max-w-screen-lg xl:w-72 xl:max-w-screen-xl dark:border-gray-700"
        role="banner"
      >
        <nav
          className="grid grid-cols-4 whitespace-nowrap sm:grid-cols-none sm:gap-2 xl:text-xl xl:leading-6"
          role="navigation"
        >
          <Link className="group hidden p-2 focus:outline-none sm:block" href={`/${locale}/exam`}>
            <Dolphin className="text-midnight-500 outline-midnight-500 dark:outline-midnight-200 h-12 w-12 rounded border border-transparent group-focus-visible:outline" />
          </Link>
          <NavigLink Icon={HomeIcon} href={`/${locale}/exam`}>
            {dict.홈[locale]}
          </NavigLink>
          <NavigLink Icon={SearchIcon} href={`/${locale}/search`}>
            {dict.검색[locale]}
          </NavigLink>
          <NavigLink Icon={PostIcon} href={`/${locale}/post`}>
            {dict.글[locale]}
          </NavigLink>
          <NavigLink Icon={BellIcon} href={`/${locale}/notification`}>
            {dict.알림[locale]}
          </NavigLink>
          <NavigLink Icon={BookmarkIcon} className="hidden sm:block" href={`/${locale}/bookmark`}>
            {dict.북마크[locale]}
          </NavigLink>
          <PublishButton />
        </nav>
        <LoginLink />
      </header>
      <div className="w-0 sm:w-20 xl:w-72" />
      <div className="order-1">{children}</div>
    </div>
  )
}
