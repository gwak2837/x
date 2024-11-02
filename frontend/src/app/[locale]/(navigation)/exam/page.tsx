import type { BasePageProps } from '@/types/nextjs'

import Image from 'next/image'
import Link from 'next/link'

import TopNavigation from '../TopNavigation'

export default async function Page(props: BasePageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const locale = params.locale

  return (
    <>
      <main className="h-full">
        <TopNavigation className="border-b" locale={locale} />
        <div className="h-12" />

        <pre className="overflow-x-scroll">{JSON.stringify({ params, searchParams }, null, 2)}</pre>
      </main>
    </>
  )
}
