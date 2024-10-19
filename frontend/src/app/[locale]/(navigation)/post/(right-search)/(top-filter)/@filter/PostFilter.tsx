import type { Locale } from '@/middleware'

import { dict } from '@/common/dict'
import Link from 'next/link'

import { Filter } from '../enum'

type Props = {
  locale: Locale
  filter: Filter
}

export default function PostFilter({ locale, filter }: Props) {
  const className =
    'p-4 text-center transition relative aria-selected:font-bold bg-white dark:bg-black sm:bg-white/50 sm:dark:bg-black/50 sm:hover:dark:bg-white/10 sm:hover:bg-black/10 aria-selected:text-black aria-selected:dark:text-white text-gray-600 dark:text-gray-400'
  const barClassName =
    'absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded w-14 aria-selected:bg-midnight-500 aria-selected:dark:bg-gray-300'

  const isRecommand = filter === Filter.recommand
  const isFollowing = filter === Filter.following

  return (
    <div className="grid grid-cols-2 items-center">
      <Link
        aria-selected={isRecommand}
        className={className}
        href={`/${locale}/post/${Filter.recommand}`}
      >
        {dict.추천[locale]}
        <div aria-selected={isRecommand} className={barClassName} />
      </Link>
      <Link
        aria-selected={isFollowing}
        className={className}
        href={`/${locale}/post/${Filter.following}`}
      >
        {dict.팔로우_중[locale]}
        <div aria-selected={isFollowing} className={barClassName} />
      </Link>
    </div>
  )
}
