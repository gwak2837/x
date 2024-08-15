import type { PageProps } from '@/types/nextjs'

import CORSTest from '@/components/CORSTest'
import Image from 'next/image'

export default function HomePage({ params }: PageProps) {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="bg-midnight-500 dark:bg-midnight-700 h-40 w-40 p-4 text-white">asdf</div>
      <CORSTest />
    </main>
  )
}
