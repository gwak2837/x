import type { Locale } from '@/middleware'
import type { TPost } from '@/mock/post'

import { THEME_COLOR } from '@/common/constants'
import { dict } from '@/common/dict'
import Squircle from '@/components/Squircle'
import BookmarkIcon from '@/svg/BookmarkIcon'
import Icon3Dots from '@/svg/Icon3Dots'
import IconChart from '@/svg/IconChart'
import IconChat from '@/svg/IconChat'
import IconHeart from '@/svg/IconHeart'
import IconRepeat from '@/svg/IconRepeat'
import LogoutIcon from '@/svg/LogoutIcon'
import Link from 'next/link'

import styles from './Post.module.css'
import PostImages from './PostImages'
import ReferredPost from './ReferredPost'

type Props = {
  post: TPost
  locale: Locale
  isThread?: boolean
}

export default function PostItem({ post, locale, isThread }: Props) {
  const imageURLs = post.imageURLs
  const author = post.author
  const referredPost = post.referredPost

  return (
    <Link
      className={`${styles.parent} grid min-w-0 grid-cols-[auto_1fr] gap-2 px-4 pb-2 pt-3 transition ${isThread ? '' : 'border-b'}`}
      href={`/${locale}/post/${post.id}#post`}
    >
      <div className="relative flex flex-col items-center gap-1">
        <Squircle
          className="text-white"
          fill={THEME_COLOR}
          src={author?.profileImageURLs?.[0]}
          wrapperClassName="w-10 "
        >
          {author?.nickname.slice(0, 2) ?? '탈퇴'}
        </Squircle>
        {isThread && (
          <>
            <div className="h-full w-0.5 dark:bg-gray-700" />
            <div className="absolute -bottom-4 left-1/2 h-4 w-0.5 -translate-x-1/2 dark:bg-gray-700" />
          </>
        )}
      </div>
      <div className="grid gap-2">
        <div className="grid gap-3">
          <div className="flex min-w-0 justify-between gap-1">
            <div className="flex min-w-0 gap-2 whitespace-nowrap max-[319px]:flex-wrap">
              <div
                aria-disabled={!author}
                className="min-w-0 overflow-hidden font-semibold aria-disabled:text-gray-500"
              >
                {author?.nickname ?? '탈퇴한 사용자입니다'}
              </div>
              <div className="flex min-w-0 items-center gap-1 text-gray-500">
                {author && (
                  <>
                    <div className="min-w-10 overflow-hidden">@{author.name}</div>
                    <span>·</span>
                  </>
                )}
                <div className="min-w-10 overflow-hidden">{post.createdAt}</div>
                {post.updatedAt && <div className="text-xs">({dict.수정됨[locale]})</div>}
              </div>
            </div>
            <Icon3Dots className="w-5 text-gray-600" />
          </div>
          <p className="min-w-0 whitespace-pre-wrap">{post.content}</p>
          {imageURLs && (
            <PostImages
              className="max-h-[512px] overflow-hidden border"
              initialPost={post}
              urls={imageURLs}
            />
          )}
          {referredPost && <ReferredPost locale={locale} referredPost={referredPost} />}
        </div>
        <div className="flex flex-wrap gap-2 text-gray-600 dark:text-gray-400">
          <div className="grid grow grid-cols-4 gap-1 text-sm">
            <div className="flex items-center">
              <IconChat className="w-9 shrink-0 p-2" />
              {post.commentCount}
            </div>
            <div className="flex items-center">
              <IconRepeat className="w-9 shrink-0 p-2" />
              {post.repostCount}
            </div>
            <div className="flex items-center">
              <IconHeart className="w-9 shrink-0 p-2" />
              {post.likeCount}
            </div>
            <div className="flex items-center">
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
    </Link>
  )
}

export function PostSkeleton() {
  return (
    <div
      className={`${styles.parent} grid min-w-0 grid-cols-[auto_1fr] gap-2 border-b px-4 pb-2 pt-3 transition`}
    >
      <Squircle className="text-white" fill={THEME_COLOR} wrapperClassName="w-10" />
      <div className="grid gap-3">
        <div className="flex min-w-0 justify-between gap-1">
          <div className="inline-block h-6 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
          <Icon3Dots className="w-5 text-gray-600" />
        </div>
        <p className="min-w-0 animate-pulse">
          <span className="inline-block h-4 w-full rounded-full bg-gray-100 dark:bg-gray-800" />
          <span className="inline-block h-4 w-1/2 rounded-full bg-gray-100 dark:bg-gray-800" />
          <span className="inline-block h-4 w-2/3 rounded-full bg-gray-100 dark:bg-gray-800" />
        </p>
        <div className="inline-block h-60 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
      </div>
      <div className="col-start-2 flex flex-wrap gap-2 text-gray-600 dark:text-gray-400">
        <div className="grid grow grid-cols-4 gap-1 text-sm">
          <div className="flex items-center">
            <IconChat className="w-8 shrink-0 p-2" />
            <div className="h-4 w-full min-w-4 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="flex items-center">
            <IconRepeat className="w-8 shrink-0 p-2" />
            <div className="h-4 w-full min-w-4 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="flex items-center">
            <IconHeart className="w-8 shrink-0 p-2" />
            <div className="h-4 w-full min-w-4 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="flex items-center">
            <IconChart className="w-8 shrink-0 p-2" />
            <div className="h-4 w-full min-w-4 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
        <div className="flex">
          <BookmarkIcon className="w-8 p-2" selected={false} />
          <LogoutIcon className="w-8 -rotate-90 p-2" />
        </div>
      </div>
    </div>
  )
}
