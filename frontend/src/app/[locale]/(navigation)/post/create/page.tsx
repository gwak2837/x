import type { BasePageProps } from '@/types/nextjs'

import PostForm from './PostForm'

export default async function Page(props: BasePageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return (
    <main className="min-h-[100dvh] p-4 sm:p-8 md:p-16 lg:p-24">
      <pre className="overflow-x-scroll">{JSON.stringify({ params, searchParams }, null, 2)}</pre>
      <PostForm />
    </main>
  )
}
