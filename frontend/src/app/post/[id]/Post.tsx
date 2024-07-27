'use client'

import { useQuery } from '@tanstack/react-query'

interface Props {
  initialPost: Record<string, unknown>
}

export default function Post({ initialPost }: Props) {
  const { data: post } = useQuery({
    queryKey: ['post'],
    queryFn: () => ({ id: 12 }),
    initialData: initialPost,
  })

  return <pre>{JSON.stringify(post, null, 2)}</pre>
}
