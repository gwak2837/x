import type { PageProps } from '@/types/nextjs'

import Image from 'next/image'
import Link from 'next/link'

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = params
  const i = +(searchParams.i ?? 1)
  const maxString = searchParams.max ?? '1'
  const max = +maxString
  const maxLength = maxString.length

  return (
    <div className="relative mx-auto max-w-screen-2xl">
      {[-2, -1, 0, 1, 2].map((j) => (
        <Image
          alt="manga-image"
          className={`h-lvh object-contain ${j === 0 ? '' : 'hidden'}`}
          height={1536}
          priority
          src={`/api/${id}/${String(i + j).padStart(maxLength, '0')}`}
          width={1536}
        />
      ))}
      <Link
        className="absolute left-0 top-0 h-full w-1/3"
        href={`?max=${maxString}&i=${Math.max(1, i - 1)}`}
        replace
      />
      <Link
        className="absolute right-0 top-0 h-full w-1/3"
        href={`?max=${maxString}&i=${Math.min(i + 1, max)}`}
        replace
      />
    </div>
  )
}
