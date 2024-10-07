import type { PageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { mockedPosts } from '@/mock/post'
import { notFound } from 'next/navigation'

import Post from './Post'

type Args = {
  id: string
}

async function fetchPost({ id }: Args) {
  try {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post/${id}`)

    if (response.status >= 500) {
      console.error('👀 ~ message:', await response.text())
      return null
    } else if (response.status >= 400) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('👀 :', error)
    return null
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = params
  const initialPost = (await fetchPost({ id })) ?? mockedPosts.find((post) => post.id === id)

  if (!initialPost) {
    notFound()
  }

  return (
    <main className="min-h-[100dvh] p-4 sm:p-8 md:p-16 lg:p-24">
      <Post initialPost={initialPost} />
    </main>
  )
}
