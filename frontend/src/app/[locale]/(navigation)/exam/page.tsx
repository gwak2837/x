import type { PageProps } from '@/types/nextjs'

import Image from 'next/image'
import Link from 'next/link'

import TopNavigation from '../TopNavigation'

export default async function Page({ params, searchParams }: PageProps) {
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
