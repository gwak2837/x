import type { BasePageProps } from '@/types/nextjs'

import { HASHA_CDN_DOMAIN } from '@/common/constants'
import Link from 'next/link'

import ArrowKeyNavigation from './ArrowKeyNavigation'

export default async function Page(props: BasePageProps) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { id } = params
  const i = +(searchParams.i ?? 1)
  const maxString = searchParams.max ?? '1'
  const max = +maxString
  const maxLength = maxString.length

  return (
    <div className="relative mx-auto max-w-screen-2xl">
      {[-2, -1, 0, 1, 2].map(
        (j) =>
          i + j > 0 && (
            <img
              alt="manga-image"
              className={`h-svh object-contain ${j === 0 ? '' : 'hidden'}`}
              fetchPriority={j === 0 ? 'high' : 'auto'}
              height={1536}
              key={j}
              referrerPolicy="no-referrer"
              src={`${HASHA_CDN_DOMAIN}/${id}/${String(i + j).padStart(maxLength, '0')}.webp`}
              width={1536}
            />
          ),
      )}
      <Link
        className="absolute left-0 top-0 h-full w-1/3 focus:outline-none"
        href={`?max=${maxString}&i=${Math.max(1, i - 1)}`}
        replace
      />
      <Link
        className="absolute right-0 top-0 h-full w-1/3 focus:outline-none"
        href={`?max=${maxString}&i=${Math.min(i + 1, max)}`}
        replace
      />
      <ArrowKeyNavigation i={i} max={max} />
    </div>
  )
}
