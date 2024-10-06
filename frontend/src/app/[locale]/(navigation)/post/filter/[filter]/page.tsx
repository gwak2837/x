import type { PageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { type TPost, mockedPosts } from '@/mock/post'
import { notFound } from 'next/navigation'

import type { Filter } from './enum'

import PostItem from '../../PostItem'
import { filters } from './enum'

type Params = {
  filter: Filter
}

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

export default async function Page({ params }: PageProps) {
  const filter = params.filter as Filter

  if (!filters.includes(filter)) {
    notFound()
  }

  const locale = params.locale
  const posts = (await fetchPosts({ filter })) ?? mockedPosts

  return <>{posts?.map((post) => <PostItem key={post.id} locale={locale} post={post} />)}</>
}
