'use client'

import type { TAuthor } from '@/mock/post'

import { THEME_COLOR } from '@/common/constants'
import IconImage from '@/svg/IconImage'
import IconMapPin from '@/svg/IconMapPin'
import IconX from '@/svg/IconX'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'

import Squircle from '../Squircle'

type Props = {
  className?: string
  author?: TAuthor
  placeholder?: string
  buttonText?: string
}

export default function PostCreationForm({
  className = '',
  author,
  placeholder,
  buttonText = '게시하기',
}: Props) {
  const [previewURLs, setPreviewURLs] = useState<string[]>([])

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement
    const files = input.files

    if (!files) {
      toast.error('파일을 선택해주세요.')
      return
    }

    if (files.length > MAX_FILES) {
      toast.error(`파일 개수는 최대 ${MAX_FILES}개까지 선택할 수 있습니다.`)
      input.value = ''
      return
    }

    setPreviewURLs(Array.from(files).map((file) => URL.createObjectURL(file)))
  }

  const buttons = [
    {
      Icon: IconImage,
      Input: (
        <input
          accept="image/*"
          className="hidden"
          disabled={!author}
          multiple
          onChange={handleFileChange}
          type="file"
        />
      ),
    },
    { Icon: IconMapPin, Input: <input className="hidden" disabled={!author} /> },
  ]

  function removePreviewURL(index: number) {
    setPreviewURLs((prev) => prev.filter((_, i) => i !== index))
  }

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
      <div className="grid gap-3">
        {author && (
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
          onKeyDown={(e) => {
            console.log(e.key)
          }}
          placeholder={placeholder}
          required
        />
        {previewURLs.length > 0 && (
          <div className="relative flex max-w-prose snap-x snap-mandatory gap-1 overflow-x-auto pb-4">
            {previewURLs.map((url, i) => (
              <div
                className={`relative max-h-[512px] shrink-0 snap-always overflow-hidden rounded-2xl border bg-gray-500 ${i === 0 ? 'snap-start' : ''} ${i === previewURLs.length - 1 ? 'snap-end' : ''} ${i === 0 && previewURLs.length === 1 ? 'w-full' : 'w-1/2'}`}
              >
                <button
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-2"
                  onClick={() => removePreviewURL(i)}
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
        <div className="flex justify-between gap-2">
          <div className="text-midnight-500 flex -translate-x-2 items-center dark:text-white">
            {buttons.map(({ Icon, Input }, i) => (
              <label
                aria-disabled={!author}
                className="hover:bg-midnight-500/20 hover:dark:bg-midnight-500/50 h-fit rounded-full p-2 transition aria-disabled:cursor-not-allowed aria-disabled:text-gray-500 hover:aria-disabled:bg-transparent hover:aria-disabled:dark:bg-transparent"
                key={i}
              >
                {Input}
                <Icon className="w-5" />
              </label>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div>{0}</div>
            <button
              className="bg-midnight-500 whitespace-nowrap rounded-full px-4 py-2 text-white disabled:bg-gray-500"
              disabled={!author}
              type="submit"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

const MAX_FILES = 4
