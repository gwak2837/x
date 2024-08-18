import type { PageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'

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
    <main className="grid h-full grid-cols-[auto_1fr]">
      <div className="border-r-2 border-gray-300 dark:border-gray-700">
        <div className="animate-fade-out-down supports-no-scroll-driven-animations:animate-none grid grid-cols-2 items-center border-b-2 border-gray-300 [animation-range:0px_30px] [animation-timeline:scroll()] dark:border-gray-700">
          <div className="p-2 text-center">{dict.추천[locale]}</div>
          <div className="p-2 text-center">{dict.팔로우_중[locale]}</div>
        </div>
        <PostCreationForm className="" />
        <ul>
          {posts.map((post: any) => (
            <PostItem key={post.id} post={post} />
          ))}
        </ul>
      </div>
      <div className="hidden lg:block">검색</div>
    </main>
  )
}

const dict = {
  추천: {
    en: 'Recommend',
    ko: '추천',
  },
  팔로우_중: {
    en: 'Following',
    ko: '팔로우 중',
  },
} as const
