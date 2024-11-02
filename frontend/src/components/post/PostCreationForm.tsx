'use client'

import { THEME_COLOR } from '@/common/constants'
import IconX from '@/svg/IconX'
import Image from 'next/image'
import { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import Squircle from '../Squircle'
import PostGeolocationButton from './button/PostGeolocationButton'
import PostImageButton from './button/PostImageButton'

type Props = {
  className?: string
  author?: {
    name: string
    nickname: string
    profileImageURLs?: string[]
  }
  placeholder?: string
  buttonText?: string
}

export default function PostCreationForm({
  className = '',
  author,
  placeholder,
  buttonText = '게시하기',
}: Props) {
  const [content, setContent] = useState('')
  const [hasFocusedBefore, setHasFocusedBefore] = useState(false)
  const [previewURLs, setPreviewURLs] = useState<string[]>([])

  return (
    <form
      className={`grid grid-cols-[auto_1fr] gap-2 ${className}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <Squircle
        className="text-white"
        fill={THEME_COLOR}
        src={author?.profileImageURLs?.[0]}
        wrapperClassName="w-10 flex-shrink-0"
      >
        {author?.nickname.slice(0, 2)}
      </Squircle>
      <div className="grid items-center gap-3">
        {hasFocusedBefore && author && (
          <button className="text-left">
            <span className="text-midnight-500 dark:font-semibold dark:text-white">
              @{author.name}{' '}
            </span>
            에게 보내는 답글
          </button>
        )}
        <TextareaAutosize
          className="h-7 max-h-screen w-full max-w-prose resize-none text-xl focus:outline-none"
          disabled={!author}
          maxRows={25}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setHasFocusedBefore(true)}
          onKeyDown={(e) => {
            console.log(e.key)
          }}
          placeholder={placeholder}
          required
          value={content}
        />
        {previewURLs.length > 0 && (
          <div className="relative flex max-w-prose snap-x snap-mandatory gap-1 overflow-x-auto pb-4">
            {previewURLs.map((url, i) => (
              <div
                className={`relative max-h-[512px] shrink-0 snap-always overflow-hidden rounded-2xl border bg-gray-500 ${i === 0 ? 'snap-start' : ''} ${i === previewURLs.length - 1 ? 'snap-end' : ''} ${i === 0 && previewURLs.length === 1 ? 'w-full' : 'w-1/2'}`}
                key={url}
              >
                <button
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-2"
                  onClick={() => setPreviewURLs((prev) => prev.filter((_, j) => j !== i))}
                  type="button"
                >
                  <IconX className="w-5 text-white" />
                </button>
                <Image
                  alt="preview"
                  className="h-full w-full object-cover"
                  height="700"
                  key={url}
                  src={url}
                  width="400"
                />
              </div>
            ))}
          </div>
        )}
        {hasFocusedBefore && (
          <div className="flex justify-between gap-2">
            <div className="text-midnight-500 flex -translate-x-2 items-center dark:text-white">
              <PostImageButton disabled={!author} onPreviewImageChange={setPreviewURLs} />
              <PostGeolocationButton
                disabled={!author}
                onLocationChange={(geolocation) => console.log(geolocation)}
              />
            </div>
            <div className="flex items-center gap-3">
              <div>{content.length}</div>
              <button
                className="bg-midnight-500 whitespace-nowrap rounded-full px-4 py-2 text-white disabled:bg-gray-200 disabled:text-gray-500 disabled:dark:bg-gray-800"
                disabled={!author}
                type="submit"
              >
                {buttonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
