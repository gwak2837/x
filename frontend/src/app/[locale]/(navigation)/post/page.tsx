import type { PageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { dict } from '@/common/dict'
import { mockedPosts } from '@/mock/post'
import Link from 'next/link'

import TopNavigation from '../TopNavigation'
import Post from './Post'
import PostCreationForm from './PostCreationForm'

async function fetchPosts() {
  try {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post`)

    if (response.status >= 500) {
      console.error('👀 ~ message:', await response.text())
      return null
    }
    if (response.status >= 400) return null

    return await response.json()
  } catch (error) {
    console.error('👀 :', error)
    return null
  }
}

const key = 'filter'

enum Filter {
  recommand = 'recommand',
  following = 'following',
}

export default async function Page({ params, searchParams }: PageProps) {
  const posts = (await fetchPosts()) ?? mockedPosts
  const locale = params.locale
  const value = searchParams[key]
  const className =
    'p-4 text-center transition relative hover:bg-gray-200 aria-selected:font-bold hover:dark:bg-gray-800 aria-selected:text-black aria-selected:dark:text-white text-gray-500 dark:text-gray-400'
  const barClassName =
    'absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded w-14 aria-selected:bg-midnight-500 aria-selected:dark:bg-gray-300'

  return (
    <main className="grid h-full lg:grid-cols-[auto_1fr]">
      <div className="md:border-r">
        <TopNavigation className="border-b sm:sticky" locale={locale}>
          <div className="grid grid-cols-2 items-center">
            <Link
              aria-selected={value !== Filter.following}
              className={className}
              href={`?${key}=${Filter.recommand}`}
            >
              {dict.추천[locale]}
              <div aria-selected={value !== Filter.following} className={barClassName} />
            </Link>
            <Link
              aria-selected={value === Filter.following}
              className={className}
              href={`?${key}=${Filter.following}`}
            >
              {dict.팔로우_중[locale]}
              <div aria-selected={value === Filter.following} className={barClassName} />
            </Link>
          </div>
        </TopNavigation>
        <PostCreationForm className="" />
        <ul className="overscroll-none">
          {posts?.map((post: any) => <Post key={post.id} locale={locale} post={post} />)}
          <div className="h-20" />
        </ul>
      </div>
      <div className="hidden lg:block">검색</div>
    </main>
  )
}

// animate-fade-out-up supports-no-scroll-driven-animations:animate-none [animation-range:0px_93px] [animation-timeline:scroll()] sm:animate-none
