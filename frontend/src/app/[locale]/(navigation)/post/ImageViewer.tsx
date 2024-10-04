'use client'

import type { TPost } from '@/mock/post'

import useFetchWithAuth from '@/hook/useFetchWithAuth'
import IconAngleBracket from '@/svg/IconAngleBracket'
import IconArrow from '@/svg/IconArrow'
import IconDoubleAngleBrackets from '@/svg/IconDoubleAngleBrackets'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  urls: string[]
  initialPost: TPost
}

export default function ImageViewer({ urls, initialPost }: Props) {
  const fetchWithAuth = useFetchWithAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  console.log('👀 - imageIndex:', imageIndex)

  const { data: post } = useQuery({
    queryKey: ['post', initialPost.id],
    queryFn: () => fetchWithAuth(`/post/${initialPost.id}`),
    initialData: initialPost,
    enabled: isVisible,
  })

  const className = 'absolute hidden rounded-full bg-white/50 lg:block dark:bg-black/50'

  return (
    <div className="fixed inset-0 z-10 grid grid-cols-[1fr_auto]">
      <div className="relative">
        <div className="flex h-full snap-x snap-mandatory overflow-x-auto">
          {urls.map((url, i) => (
            <div className="relative w-full flex-shrink-0 snap-center snap-always" key={i}>
              <Image alt="post-image" className="object-contain" fill src={url} />
            </div>
          ))}
        </div>
        <button
          className={`${className} left-4 top-1/2 -translate-y-1/2 p-2`}
          onClick={() => setImageIndex((prev) => (prev + urls.length - 1) % urls.length)}
        >
          <IconArrow className="w-5" />
        </button>
        <button
          className={`${className} right-4 top-1/2 -translate-y-1/2 p-2`}
          onClick={() => setImageIndex((prev) => (prev + 1) % urls.length)}
        >
          <IconArrow className="w-5 rotate-180" />
        </button>
        <button
          className={`${className} right-3 top-3 p-1`}
          onClick={() => setIsVisible((prev) => !prev)}
        >
          <IconDoubleAngleBrackets
            aria-selected={isVisible}
            className="w-7 aria-selected:rotate-180"
          />
        </button>
      </div>
      {isVisible && (
        <div className="hidden h-full w-96 lg:block">
          <pre>{JSON.stringify(post, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
