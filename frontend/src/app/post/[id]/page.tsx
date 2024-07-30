import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { PageProps } from '@/types/nextjs'

import Post from './Post'

type Args = {
  id: string
}

async function fetchPost({ id }: Args) {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post/${id}`)
  if (response.status >= 500) throw new Error(await response.text())
  if (response.status >= 400) return await response.text()

  const post = await response.json()
  return post
}

export default async function Page({ params }: PageProps) {
  const { id } = params
  const initialPost = await fetchPost({ id })

  return (
    <main className="min-h-[100dvh] p-4 sm:p-8 md:p-16 lg:p-24">
      <Post initialPost={initialPost} />
    </main>
  )
}
