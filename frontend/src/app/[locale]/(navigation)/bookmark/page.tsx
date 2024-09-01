import type { PageProps } from '@/types/nextjs'

import Image from 'next/image'
import Link from 'next/link'

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = params

  return (
    <div className="p-4 sm:p-8 md:p-16 lg:p-24">
      <Link href={`/${locale}/manga/3029130`}>3029130</Link>
      <pre className="overflow-x-scroll">{JSON.stringify({ params, searchParams }, null, 2)}</pre>
    </div>
  )
}
