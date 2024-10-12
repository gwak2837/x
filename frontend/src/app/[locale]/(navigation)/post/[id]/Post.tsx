'use client'

import type { Locale } from '@/middleware'
import type { TPost } from '@/mock/post'

import PostItem from '@/components/post/PostItem'
import useFetchWithAuth from '@/hook/useFetchWithAuth'
import IconArrow from '@/svg/IconArrow'
import { useAuthStore } from '@/zustand/auth'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useRef } from 'react'

type Props = {
  initialPost: TPost
}

export default function Post({ initialPost }: Props) {
  const params = useParams()
  const locale = params.locale as Locale

  const accessToken = useAuthStore((state) => state.accessToken)
  const fetchWithAuth = useFetchWithAuth()

  const { data: post } = useQuery({
    queryKey: ['post', initialPost.id],
    queryFn: () => fetchWithAuth<TPost>(`/post/${initialPost.id}?include=parent-post`),
    initialData: initialPost,
    enabled: Boolean(accessToken),
  })

  const router = useRouter()

  return (
    <div>
      <div className="sticky left-0 top-0 z-10 flex items-center gap-9 bg-black/85 p-2 backdrop-blur-md">
        <button
          className="hover:bg-midnight-500/20 hover:dark:bg-midnight-500/50 focus-visible:outline-midnight-500 focus:dark:outline-midnight-200 rounded-full p-2 transition"
          onClick={() => router.back()}
        >
          <IconArrow className="h-6 w-6" />
        </button>
        <h3 className="text-xl font-bold">게시하기</h3>
      </div>
      {post.parentPosts?.map((post) => (
        <PostItem isThread key={post.id} locale={locale} post={post} />
      ))}

      <pre className="max-w-prose">{JSON.stringify(post, null, 2)}</pre>
    </div>
  )
}
