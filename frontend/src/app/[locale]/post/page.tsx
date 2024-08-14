import type { PageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'

import PostItem from './PostItem'

async function fetchPosts() {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post`)
  if (response.status >= 500) throw new Error(await response.text())
  if (response.status >= 400) return []

  const posts = await response.json()
  return posts
}

export default async function Page({ params }: PageProps) {
  const posts = await fetchPosts()

  return (
    <main className="min-h-[100dvh] p-4 sm:p-8 md:p-16 lg:p-24">
      {posts.map((post: any) => (
        <PostItem key={post.id} post={post} />
      ))}
    </main>
  )
}
