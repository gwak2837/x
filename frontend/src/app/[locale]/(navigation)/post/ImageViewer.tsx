'use client'

import type { TPost } from '@/mock/post'

import KeybordShortcut from '@/components/KeybordShortcut'
import useFetchWithAuth from '@/hook/useFetchWithAuth'
import IconArrow from '@/svg/IconArrow'
import IconDoubleAngleBrackets from '@/svg/IconDoubleAngleBrackets'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRef, useState } from 'react'

type Props = {
  urls: string[]
  initialPost: TPost
}

export default function ImageViewer({ urls, initialPost }: Props) {
  const [isVisible, setIsVisible] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const imageContainer = imageContainerRef.current

  const fetchWithAuth = useFetchWithAuth()

  const { data: post } = useQuery({
    queryKey: ['post', initialPost.id],
    queryFn: () => fetchWithAuth(`/post/${initialPost.id}`),
    initialData: initialPost,
    enabled: isVisible,
  })

  const className = 'absolute  rounded-full bg-white/50  dark:bg-black/50'

  function scrollToLeft() {
    imageContainer?.scrollTo({
      left: imageContainer.scrollLeft - imageContainer.clientWidth,
      behavior: 'smooth',
    })
  }

  function scrollToRight() {
    imageContainer?.scrollTo({
      left: imageContainer.scrollLeft + imageContainer.clientWidth,
      behavior: 'smooth',
    })
  }

  return (
    <div className="fixed inset-0 z-10 grid grid-cols-[1fr_auto]">
      <div className="relative">
        <div className="flex h-full snap-x snap-mandatory overflow-x-auto" ref={imageContainerRef}>
          <div />
          {urls.map((url, i) => (
            <div className="relative w-full flex-shrink-0 snap-center snap-always" key={i}>
              <Image alt="post-image" className="object-contain" fill src={url} />
            </div>
          ))}
          <div />
        </div>
        <KeybordShortcut keyCode="ArrowLeft" onKeyDown={scrollToLeft}>
          <button
            className={`${className} left-4 top-1/2 -translate-y-1/2 p-2`}
            onClick={scrollToLeft}
          >
            <IconArrow className="w-5" />
          </button>
        </KeybordShortcut>
        <KeybordShortcut keyCode="ArrowRight" onKeyDown={scrollToRight}>
          <button
            className={`${className} right-4 top-1/2 -translate-y-1/2 p-2`}
            onClick={scrollToRight}
          >
            <IconArrow className="w-5 rotate-180" />
          </button>
        </KeybordShortcut>
        <button
          className={`${className} right-3 top-3 hidden p-1 lg:block`}
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
