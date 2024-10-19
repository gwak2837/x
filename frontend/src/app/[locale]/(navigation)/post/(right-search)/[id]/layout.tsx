import type { BaseLayoutProps } from '@/types/nextjs'
import type { ReactNode } from 'react'

import BackButton from './BackButton'

type LayoutProps = {
  comment: ReactNode
  post: ReactNode
} & BaseLayoutProps

export default function Layout({ post, comment }: LayoutProps) {
  return (
    <>
      <div className="sticky left-0 top-0 z-10 flex items-center justify-between gap-9 bg-white/85 p-2 backdrop-blur-md dark:bg-black/85">
        <div className="flex items-center gap-9">
          <BackButton />
          <h3 className="text-xl font-bold">게시하기</h3>
        </div>
        <div>
          <button className="text-white">게시</button>
        </div>
      </div>
      {post}
      {comment}
    </>
  )
}
