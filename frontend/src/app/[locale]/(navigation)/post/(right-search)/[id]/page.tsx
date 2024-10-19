import type { BasePageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { mockedPosts } from '@/mock/post'
import { notFound } from 'next/navigation'

import BackButton from './BackButton'
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

  return (
    <>
      <div className="sticky left-0 top-0 z-10 flex items-center justify-between gap-9 bg-white/85 p-2 backdrop-blur-md dark:bg-black/85">
        <div className="flex items-center gap-9">
          <BackButton />
          <h3 className="text-xl font-bold">게시하기</h3>
        </div>
        <div>
          <button className="text-white">게시</button>
        </div>
      </div>
      <Post initialPost={initialPost} />
    </>
  )
}
