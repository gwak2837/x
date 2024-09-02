import type { PageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { dict } from '@/common/dict'

import TopNavigation from '../TopNavigation'
import PostCreationForm from './PostCreationForm'
import PostItem from './PostItem'

async function fetchPosts() {
  try {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post`)
    if (response.status >= 500) {
      console.error('👀 ~ error message:', await response.text())
      return []
    }
    if (response.status >= 400) return []

    const posts = await response.json()
    return posts
  } catch (error) {
    console.error('👀 ~ error:', error)
    return []
  }
}

export default async function Page({ params }: PageProps) {
  const posts = await fetchPosts()
  const locale = params.locale

  return (
    <main className="grid h-full lg:grid-cols-[auto_1fr]">
      <div className="border-gray-300 md:border-r dark:border-gray-700">
        <TopNavigation
          className="animate-fade-out-up supports-no-scroll-driven-animations:animate-none border-b border-gray-300 [animation-range:0px_93px] [animation-timeline:scroll()] sm:sticky sm:animate-none dark:border-gray-700"
          locale={locale}
        >
          <div className="grid grid-cols-2 items-center">
            <div className="p-2 text-center">{dict.추천[locale]}</div>
            <div className="p-2 text-center">{dict.팔로우_중[locale]}</div>
          </div>
        </TopNavigation>
        <div className="h-24 sm:hidden" />
        <PostCreationForm className="" />
        <ul>
          {posts.map((post: any) => (
            <PostItem key={post.id} locale={locale} post={post} />
          ))}
          <div className="h-40" />
        </ul>
      </div>
      <div className="hidden lg:block">검색</div>
    </main>
  )
}
