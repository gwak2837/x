'use client'

import type { Locale } from '@/middleware'
import type { TPost, TReferedPost } from '@/mock/post'

import { THEME_COLOR } from '@/common/constants'
import { dict } from '@/common/dict'
import Squircle from '@/components/Squircle'
import Icon3Dots from '@/svg/Icon3Dots'
import { useRouter } from 'next/navigation'

import styles from './Post.module.css'
import PostImages from './PostImages'

type Props = {
  locale: Locale
  referredPost: TReferedPost
}

export default function ReferredPost({ locale, referredPost }: Props) {
  const referredPostImageURLs = referredPost.imageURLs
  const referredAuthor = referredPost.author
  const referredPostContent = referredPost.content

  const router = useRouter()

  function goToReferredPost(e: React.MouseEvent) {
    e.preventDefault()
    router.push(`/${locale}/post/${referredPost.id}`)
  }

  return (
    <div
      className={`${styles.child} grid min-w-0 overflow-hidden rounded-2xl border border-gray-400 transition hover:bg-gray-200 dark:border-gray-600 hover:dark:bg-gray-800`}
      onClick={goToReferredPost}
    >
      <div className="grid gap-1 p-3">
        <div className="flex min-w-0 justify-between gap-1">
          <div className="flex min-w-0 gap-1 whitespace-nowrap">
            <Squircle
              className="text-white"
              fill={THEME_COLOR}
              src={referredAuthor.profileImageURLs?.[0]}
              wrapperClassName="w-6 flex-shrink-0"
            >
              {referredAuthor.nickname.slice(0, 2)}
            </Squircle>
            <div className="min-w-0 max-w-40 overflow-hidden font-semibold">
              {referredAuthor.nickname}
            </div>
            <div className="flex min-w-0 items-center gap-1 text-gray-500">
              <div className="min-w-10 max-w-40 overflow-hidden">@{referredAuthor.name}</div>
              <span>·</span>
              <div className="min-w-10 overflow-hidden">{referredPost.createdAt}</div>
              {referredPost.updatedAt && <div className="text-xs">{dict.수정됨[locale]}</div>}
            </div>
          </div>
          <Icon3Dots className="w-5 text-gray-600" />
        </div>
        {referredPostContent && (
          <p className="max-w-prose whitespace-pre-wrap">{referredPostContent}</p>
        )}
      </div>
      {referredPostImageURLs && (
        <PostImages
          className="max-h-[256px] w-full"
          imageClassName="w-full"
          initialPost={referredPost as unknown as TPost}
          urls={referredPostImageURLs}
        />
      )}
    </div>
  )
}
