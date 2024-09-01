import type { PageProps } from '@/types/nextjs'

import Image from 'next/image'
import Link from 'next/link'

import TopNavigation from '../TopNavigation'

export default async function Page({ params, searchParams }: PageProps) {
  const locale = params.locale

  return (
    <>
      <main className="h-full">
        <TopNavigation className="border-b border-gray-300 dark:border-gray-700" locale={locale} />
        <div className="h-12" />
        <Link href={`/${locale}/manga/3029130?max=48`} target="__blank">
          3029130
        </Link>
        <pre className="overflow-x-scroll">{JSON.stringify({ params, searchParams }, null, 2)}</pre>
      </main>
    </>
  )
}
