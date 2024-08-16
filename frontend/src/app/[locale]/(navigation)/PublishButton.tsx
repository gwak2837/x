'use client'

import type { BaseParams } from '@/types/nextjs'

import Modal from '@/components/Modal'
import PenIcon from '@/svg/PenIcon'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function PublishButton() {
  const [isOpened, setIsOpened] = useState(false)
  const { locale } = useParams<BaseParams>()

  return (
    <>
      <div className="mx-auto my-4 hidden sm:block xl:mx-0">
        <button
          className="bg-midnight-500 rounded-full p-3 xl:hidden"
          onClick={() => setIsOpened(true)}
        >
          <PenIcon className="w-6 text-white" />
        </button>
        <button
          className="bg-midnight-500 focus-visible:border-midnight-200 hidden w-11/12 rounded-full border-2 border-transparent p-4 text-center text-lg leading-5 text-white transition-opacity hover:opacity-80 xl:block"
          onClick={() => setIsOpened(true)}
        >
          {dict.게시하기[locale]}
        </button>
      </div>
      <Modal onClose={() => setIsOpened(false)} open={isOpened} showCloseButton showDragButton>
        <div className="rounded-2xl bg-white px-4 pb-4 pt-5 shadow-xl">
          무슨 일이 일어나고 있나요?
        </div>
      </Modal>
    </>
  )
}

const dict = {
  게시하기: {
    ko: '게시하기',
    en: 'Create',
  },
} as const
