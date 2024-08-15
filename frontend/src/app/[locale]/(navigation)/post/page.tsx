import type { PageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'

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

  return (
    <main className="h-full p-4 sm:p-8 md:p-16 lg:p-24">
      {posts.map((post: any) => (
        <PostItem key={post.id} post={post} />
      ))}
    </main>
  )
}
