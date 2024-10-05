import type { PageProps } from '@/types/nextjs'

import Image from 'next/image'
import Link from 'next/link'

import ImageViewer from '../post/ImageViewer'

export default async function Page({ params, searchParams }: PageProps) {
  return (
    <div className="p-4 sm:p-8 md:p-16 lg:p-24">
      <ImageViewer
        initialPost={{ id: '1', content: 'content' } as any}
        imageURLs={[
          'https://pbs.twimg.com/media/GYjZFn5asAMNrAp?format=jpg&name=large',
          'https://pbs.twimg.com/media/GXVFn0WbMAEcp-8?format=jpg&name=large',
          'https://pbs.twimg.com/media/GWSBCr7WUAADAtS?format=jpg&name=large',
          'https://pbs.twimg.com/media/GY4-7OLbMAA2n9k?format=jpg&name=large',
          'https://pbs.twimg.com/media/GYJV458aUAA6QpE?format=jpg&name=large',
        ]}
      />
      <pre className="overflow-x-scroll">{JSON.stringify({ params, searchParams }, null, 2)}</pre>
    </div>
  )
}
