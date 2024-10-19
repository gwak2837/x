import type { BasePageProps } from '@/types/nextjs'

import PostForm from './PostForm'

export default async function Page({ params, searchParams }: BasePageProps) {
  return (
    <main className="min-h-[100dvh] p-4 sm:p-8 md:p-16 lg:p-24">
      <pre className="overflow-x-scroll">{JSON.stringify({ params, searchParams }, null, 2)}</pre>
      <PostForm />
    </main>
  )
}
