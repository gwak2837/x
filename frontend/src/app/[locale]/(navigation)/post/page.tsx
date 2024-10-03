import type { PageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { dict } from '@/common/dict'
import { mockedPosts } from '@/mock/post'
import Link from 'next/link'

import TopNavigation from '../TopNavigation'
import PostCreationForm from './PostCreationForm'
import PostItem from './PostItem'

async function fetchPosts() {
  try {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post`)

    if (response.status >= 500) {
      console.error('👀 ~ error message:', await response.text())
      return null
    }
    if (response.status >= 400) return null

    return await response.json()
  } catch (error) {
    console.error('👀 ~ error:', error)
    return null
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const posts = (await fetchPosts()) ?? mockedPosts
  const locale = params.locale
  const { r } = searchParams

  return (
    <main className="grid h-full lg:grid-cols-[auto_1fr]">
      <div className="md:border-r">
        <TopNavigation className="border-b sm:sticky" locale={locale}>
          <div className="grid grid-cols-2 items-center">
            <Link
              aria-selected={r === '1'}
              className="aria-selected: p-4 text-center transition hover:bg-gray-200 aria-selected:font-bold hover:dark:bg-gray-800"
              href="?r=1"
            >
              {dict.추천[locale]}
            </Link>
            <Link
              aria-selected={r === '2'}
              className="p-4 text-center transition hover:bg-gray-200 aria-selected:font-bold hover:dark:bg-gray-800"
              href="?r=2"
            >
              {dict.팔로우_중[locale]}
            </Link>
          </div>
        </TopNavigation>
        <PostCreationForm className="" />
        <ul>
          {posts?.map((post: any) => <PostItem key={post.id} locale={locale} post={post} />)}
          <div className="h-20" />
        </ul>
      </div>
      <div className="hidden lg:block">검색</div>
    </main>
  )
}

// animate-fade-out-up supports-no-scroll-driven-animations:animate-none [animation-range:0px_93px] [animation-timeline:scroll()] sm:animate-none
