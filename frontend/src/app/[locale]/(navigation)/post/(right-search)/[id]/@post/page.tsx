import type { BasePageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { mockedPosts } from '@/mock/post'
import { notFound } from 'next/navigation'

import Post from './Post'

type Args = {
  id: string
}

async function fetchPost({ id }: Args) {
  try {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post/${id}?include=parent-post`)

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

export default async function Page({ params }: BasePageProps) {
  const { id } = params
  const initialPost = (await fetchPost({ id })) ?? mockedPosts.find((post) => post.id === id)

  if (!initialPost) {
    notFound()
  }

  return <Post initialPost={initialPost} />
}
