import type { BasePageProps } from '@/types/nextjs'

import Image from 'next/image'
import Link from 'next/link'

export default async function Page(props: BasePageProps) {
  const params = await props.params;
  return (
    <div className="p-4">
      <pre className="overflow-x-scroll">{JSON.stringify({ params }, null, 2)}</pre>
    </div>
  )
}
