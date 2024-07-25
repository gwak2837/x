import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { PageProps } from '@/types/nextjs'

async function fetchPosts() {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post`)
  const posts = await response.json()
  return posts
}

export default async function Page({}: PageProps) {
  const posts = await fetchPosts()

  return (
    <main className="min-h-[100dvh] p-4 sm:p-8 md:p-16 lg:p-24">
      <pre className="overflow-x-scroll">{JSON.stringify(posts, null, 2)}</pre>
    </main>
  )
}
