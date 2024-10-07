'use client'

import type { TPost } from '@/mock/post'

import Image from 'next/image'
import { useState } from 'react'

import ImagesViewer from './ImagesViewer'

type Props = {
  className?: string
  urls: string[]
  initialPost: TPost
  imageClassName?: string
}

const CLOSED = -1

export default function PostImages({
  className = '',
  imageClassName = '',
  initialPost,
  urls,
}: Props) {
  const postImageCount = urls.length
  const [isOpened, setIsOpened] = useState(CLOSED)

  return (
    <div
      className={`grid ${postImageCount > 1 ? 'aspect-video grid-cols-2' : 'w-fit'} ${postImageCount >= 3 ? 'grid-rows-2' : ''} max-w-prose gap-0.5 rounded-2xl ${className}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {urls.map((url, i) => (
        <Image
          alt="post-image"
          className={`h-full object-cover ${postImageCount === 1 ? 'w-full' : ''} ${postImageCount === 3 ? 'first-of-type:row-span-full' : ''} ${imageClassName}`}
          height={512}
          key={i}
          onClick={() => setIsOpened(i)}
          src={url}
          width={650}
        />
      ))}
      {isOpened !== CLOSED && (
        <ImagesViewer
          imageURLs={urls}
          initialImageIndex={isOpened}
          initialPost={initialPost}
          onClose={() => setIsOpened(CLOSED)}
        />
      )}
    </div>
  )
}
