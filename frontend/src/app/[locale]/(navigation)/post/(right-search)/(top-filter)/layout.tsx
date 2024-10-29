import type { BaseLayoutProps } from '@/types/nextjs'
import type { ReactNode } from 'react'

import PostCreationForm from '@/components/post/PostCreationForm'

import TopNavigation from '../../../TopNavigation'

type LayoutProps = {
  filter: ReactNode
  post: ReactNode
} & BaseLayoutProps

export default function Layout({ params, filter, post }: LayoutProps) {
  const locale = params.locale

  return (
    <>
      <TopNavigation
        className="border-b bg-white sm:sticky sm:bg-white/75 sm:backdrop-blur dark:bg-black sm:dark:bg-black/75"
        locale={locale}
      >
        {filter}
      </TopNavigation>
      <PostCreationForm
        buttonText="게시하기"
        className="hidden border-b p-4 sm:block"
        placeholder="무슨 일이 일어나고 있나요?"
      />
      <ul className="overscroll-none">
        {post}
        <div className="h-20" />
      </ul>
    </>
  )
}
