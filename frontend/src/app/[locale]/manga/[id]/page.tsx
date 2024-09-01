import type { PageProps } from '@/types/nextjs'

import Image from 'next/image'
import Link from 'next/link'

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = params
  const i = (searchParams.i ?? '1') as string

  return (
    <div className="relative mx-auto max-w-screen-2xl">
      {[-2, -1, 0, 1, 2].map((j) => (
        <Image
          alt="manga-image"
          className={`h-lvh object-contain ${j === 0 ? '' : 'hidden'}`}
          height={1536}
          priority
          src={`/api/${id}/${+i + j}`}
          width={1536}
        />
      ))}
      <Link className="absolute left-0 top-0 h-full w-1/3" href={`?i=${+i - 1}`} />
      <Link className="absolute right-0 top-0 h-full w-1/3" href={`?i=${+i + 1}`} />
    </div>
  )
}
