import type { TPost } from '@/mock/post'
import type { BasePageProps } from '@/types/nextjs'
import type { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import PostItem from '@/components/post/PostItem'
import { notFound } from 'next/navigation'

import { Filter } from '../../enum'

async function fetchPosts({ filter }: Params) {
  try {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post?only=${filter}`)

    if (response.status >= 500) {
      console.error('👀 ~ message:', await response.text())
      return null
    }
    if (response.status >= 400) return null

    return (await response.json()) as TPost[]
  } catch (error) {
    console.error('👀 :', error)
    return null
  }
}

export default async function Page({ params }: BasePageProps) {
  const locale = params.locale
  const posts = await fetchPosts({ filter: Filter.recommand })

  if (!posts) {
    notFound()
  }

  return <>{posts?.map((post) => <PostItem key={post.id} locale={locale} post={post} />)}</>
}
