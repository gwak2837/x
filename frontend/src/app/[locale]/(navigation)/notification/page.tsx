import type { PageProps } from '@/types/nextjs'

import Image from 'next/image'
import Link from 'next/link'

export default async function Page({ params, searchParams }: PageProps) {
  return (
    <div className="p-4 sm:p-8 md:p-16 lg:p-24">
      <pre className="overflow-x-scroll">{JSON.stringify({ params, searchParams }, null, 2)}</pre>
    </div>
  )
}
