'use client'

import { fetchWithToken } from '@/app/[locale]/Authentication'
import { useAuthStore } from '@/zustand/auth'
import { useQuery } from '@tanstack/react-query'

type Props = {
  initialPost: Record<string, unknown>
}

export default function Post({ initialPost }: Props) {
  const authStore = useAuthStore((state) => state)

  const { data: post } = useQuery({
    queryKey: ['post', initialPost.id],
    queryFn: () => fetchWithToken(authStore, `/post/${initialPost.id}`),
    initialData: initialPost,
    enabled: Boolean(authStore.accessToken),
  })

  return <pre>{JSON.stringify(post, null, 2)}</pre>
}
