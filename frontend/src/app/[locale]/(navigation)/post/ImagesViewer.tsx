'use client'

import type { TPost } from '@/mock/post'
import type { MouseEvent } from 'react'

import KeybordShortcut from '@/components/KeybordShortcut'
import useFetchWithAuth from '@/hook/useFetchWithAuth'
import useIsIntersected from '@/hook/useIsIntersected'
import BookmarkIcon from '@/svg/BookmarkIcon'
import Icon3Dots from '@/svg/Icon3Dots'
import IconArrow from '@/svg/IconArrow'
import IconChart from '@/svg/IconChart'
import IconChat from '@/svg/IconChat'
import IconDoubleAngleBrackets from '@/svg/IconDoubleAngleBrackets'
import IconHeart from '@/svg/IconHeart'
import IconRepeat from '@/svg/IconRepeat'
import IconX from '@/svg/IconX'
import LogoutIcon from '@/svg/LogoutIcon'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  imageURLs: string[]
  initialPost: TPost
  initialImageIndex?: number
  onClose?: () => void
}

export default function ImagesViewer({
  imageURLs,
  initialPost,
  initialImageIndex,
  onClose,
}: Props) {
  const params = useParams()
  const locale = params.locale

  const [isPostVisible, setIsPostVisible] = useState(false)
  const [isOnFirstImage, firstRef] = useIsIntersected<HTMLDivElement>(false)
  const [isOnLastImage, lastRef] = useIsIntersected<HTMLDivElement>(false)

  const fetchWithAuth = useFetchWithAuth()

  const { data: post } = useQuery({
    queryKey: ['post', initialPost.id],
    queryFn: () => fetchWithAuth<TPost>(`/post/${initialPost.id}`),
    initialData: initialPost,
  })

  const imageContainerRef = useRef<HTMLDivElement>(null)

  function scrollToLeft() {
    const imageContainer = imageContainerRef.current

    imageContainer?.scrollTo({
      left: imageContainer.scrollLeft - imageContainer.clientWidth,
      behavior: 'smooth',
    })
  }

  function scrollToRight() {
    const imageContainer = imageContainerRef.current

    imageContainer?.scrollTo({
      left: imageContainer.scrollLeft + imageContainer.clientWidth,
      behavior: 'smooth',
    })
  }

  function handleClose(e?: MouseEvent) {
    e?.stopPropagation()
    onClose?.()
  }

  const className = 'absolute disabled:opacity-25 rounded-full bg-white/50  dark:bg-black/50'

  useEffect(() => {
    if (!initialImageIndex) return

    const imageContainer = imageContainerRef.current
    if (!imageContainer) return

    imageContainer.scrollTo({ left: imageContainer.clientWidth * initialImageIndex })
  }, [initialImageIndex])

  useEffect(() => {
    const bodyStyle = document.body.style

    bodyStyle.overflow = 'hidden'
    bodyStyle.touchAction = 'none'

    return () => {
      bodyStyle.overflow = ''
      bodyStyle.touchAction = ''
    }
  }, [onClose, open])

  return createPortal(
    <div className="fixed inset-0 z-50 grid grid-cols-[1fr_auto] bg-black/90">
      <div className="grid grid-rows-[1fr_auto]">
        <div className="relative">
          <div
            className="flex h-full snap-x snap-mandatory overflow-x-auto"
            ref={imageContainerRef}
          >
            <div ref={firstRef} />
            {imageURLs.map((url, i) => (
              <div className="relative w-full flex-shrink-0 snap-center snap-always" key={i}>
                <Image alt="post-image" className="object-contain" fill src={url} />
              </div>
            ))}
            <div ref={lastRef} />
          </div>
          <KeybordShortcut keyCode="Escape" onKeyDown={handleClose}>
            <button className={`${className} left-3 top-3 p-2`} onClick={handleClose}>
              <IconX className="w-5" />
            </button>
          </KeybordShortcut>
          <label
            className={`${className} right-3 top-3 rounded-full bg-white/50 p-1 lg:hidden dark:bg-black/50`}
          >
            <input className="peer hidden" type="checkbox" />
            <Icon3Dots className="w-7" />
            <div className="pointer-events-none fixed inset-0 peer-checked:pointer-events-auto" />
            <div className="absolute right-0 top-0 hidden overflow-hidden whitespace-nowrap rounded-xl border-2 bg-white text-sm font-bold peer-checked:block dark:bg-black">
              <ul>
                <li>
                  <Link
                    className="block px-4 py-3 transition hover:bg-gray-300 dark:hover:bg-gray-800"
                    href={`/${locale}/post/${post.id}`}
                  >
                    게시물 보기
                  </Link>
                </li>
              </ul>
            </div>
          </label>
          <button
            className={`${className} right-3 top-3 hidden p-1 lg:block`}
            onClick={() => setIsPostVisible((prev) => !prev)}
          >
            <IconDoubleAngleBrackets
              aria-selected={isPostVisible}
              className="w-7 aria-selected:rotate-180"
            />
          </button>
          <KeybordShortcut keyCode="ArrowLeft" onKeyDown={scrollToLeft}>
            <button
              className={`${className} left-4 top-1/2 -translate-y-1/2 p-2`}
              disabled={isOnFirstImage}
              onClick={scrollToLeft}
            >
              <IconArrow className="w-5" />
            </button>
          </KeybordShortcut>
          <KeybordShortcut keyCode="ArrowRight" onKeyDown={scrollToRight}>
            <button
              className={`${className} right-4 top-1/2 -translate-y-1/2 p-2`}
              disabled={isOnLastImage}
              onClick={scrollToRight}
            >
              <IconArrow className="w-5 rotate-180" />
            </button>
          </KeybordShortcut>
        </div>
        <div className="pb-safe px-safe m-1 flex flex-wrap justify-center gap-2 text-white">
          <div className="grid grow grid-cols-4 gap-1 text-sm">
            <div className="flex items-center justify-center">
              <IconChat className="w-9 shrink-0 p-2" />
              {post.commentCount}
            </div>
            <div className="flex items-center justify-center">
              <IconRepeat className="w-9 shrink-0 p-2" />
              {post.repostCount}
            </div>
            <div className="flex items-center justify-center">
              <IconHeart className="w-9 shrink-0 p-2" />
              {post.likeCount}
            </div>
            <div className="flex items-center justify-center">
              <IconChart className="w-9 shrink-0 p-2" />
              {post.viewCount}
            </div>
          </div>
          <div className="flex">
            <BookmarkIcon className="w-9 p-2" selected={false} />
            <LogoutIcon className="w-9 -rotate-90 p-2" />
          </div>
        </div>
      </div>
      {isPostVisible && (
        <div className="hidden h-full w-96 overflow-auto bg-white lg:block dark:bg-black">
          <pre className="">{JSON.stringify(post, null, 2)}</pre>
        </div>
      )}
    </div>,
    document.getElementById('fixed-root') ?? document.body,
  )
}
