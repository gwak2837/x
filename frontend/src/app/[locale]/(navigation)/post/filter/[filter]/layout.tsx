import type { LayoutProps } from '@/types/nextjs'

import { dict } from '@/common/dict'
import Link from 'next/link'

import TopNavigation from '../../../TopNavigation'
import PostCreationForm from './PostCreationForm'
import { Filter } from './enum'

export default function Layout({ children, params }: LayoutProps) {
  const locale = params.locale
  const filter = params.filter

  const className =
    'p-4 text-center transition relative aria-selected:font-bold bg-white dark:bg-black sm:bg-white/50 sm:dark:bg-black/50 sm:hover:dark:bg-white/10 sm:hover:bg-black/10 aria-selected:text-black aria-selected:dark:text-white text-gray-600 dark:text-gray-400'
  const barClassName =
    'absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded w-14 aria-selected:bg-midnight-500 aria-selected:dark:bg-gray-300'

  return (
    <main className="grid h-full lg:grid-cols-[auto_1fr]">
      <div className="md:border-r">
        <TopNavigation
          className="border-b bg-black sm:sticky sm:bg-white/75 sm:backdrop-blur sm:dark:bg-black/75"
          locale={locale}
        >
          <div className="grid grid-cols-2 items-center">
            <Link
              aria-selected={filter !== Filter.following}
              className={className}
              href={`/${locale}/post/filter/${Filter.recommand}`}
            >
              {dict.추천[locale]}
              <div aria-selected={filter !== Filter.following} className={barClassName} />
            </Link>
            <Link
              aria-selected={filter === Filter.following}
              className={className}
              href={`/${locale}/post/filter/${Filter.following}`}
            >
              {dict.팔로우_중[locale]}
              <div aria-selected={filter === Filter.following} className={barClassName} />
            </Link>
          </div>
        </TopNavigation>
        <PostCreationForm className="" />
        <ul className="overscroll-none">
          {children}
          <div className="h-20" />
        </ul>
      </div>
      <div className="hidden lg:block">검색</div>
    </main>
  )
}
