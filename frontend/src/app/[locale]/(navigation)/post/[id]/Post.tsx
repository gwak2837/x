'use client'

import useFetchWithAuth from '@/hook/useFetchWithAuth'
import { useAuthStore } from '@/zustand/auth'
import { useQuery } from '@tanstack/react-query'

type Props = {
  initialPost: Record<string, unknown>
}

export default function Post({ initialPost }: Props) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const fetchWithAuth = useFetchWithAuth()

  const { data: post } = useQuery({
    queryKey: ['post', initialPost.id],
    queryFn: () => fetchWithAuth(`/post/${initialPost.id}`),
    initialData: initialPost,
    enabled: Boolean(accessToken),
  })

  return <pre className="w-80 overflow-auto">{JSON.stringify(post, null, 2)}</pre>
}
