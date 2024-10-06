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
}

export default function Post({ post, locale }: Props) {
  const imageURLs = post.imageURLs
  const author = post.author
  const referredPost = post.referredPost

  return (
    <Link
      className={`${styles.parent} grid grid-cols-[auto_1fr] gap-2 border-b px-4 pb-2 pt-3 transition`}
      href={`/${locale}/post/${post.id}`}
    >
      <Squircle
        className="text-white"
        fill={THEME_COLOR}
        src={author.profileImageURLs?.[0]}
        wrapperClassName="w-10"
      >
        {author.nickname.slice(0, 2)}
      </Squircle>
      <div className="grid gap-3 lg:w-min">
        <div className="flex min-w-0 justify-between gap-1">
          <div className="flex min-w-0 gap-2 whitespace-nowrap max-[319px]:flex-wrap">
            <div className="min-w-0 overflow-hidden font-semibold">{author.nickname}</div>
            <div className="flex min-w-0 items-center gap-1 text-gray-500">
              <div className="min-w-10 overflow-hidden">@{author.name}</div>
              <span>·</span>
              <div className="min-w-10 overflow-hidden">{post.createdAt}</div>
              {post.updatedAt && <div className="text-xs">({dict.수정됨[locale]})</div>}
            </div>
          </div>
          <Icon3Dots className="w-5 text-gray-600" />
        </div>
        <p className="min-w-0 max-w-prose lg:min-w-[65ch]">{post.content}</p>
        {imageURLs && (
          <PostImages
            className="max-h-[512px] overflow-hidden border"
            initialPost={post}
            urls={imageURLs}
          />
        )}
        {referredPost && <ReferredPost locale={locale} referredPost={referredPost} />}
      </div>
      <div className="col-start-2 flex flex-wrap gap-2 text-gray-600 dark:text-gray-400">
        <div className="grid grow grid-cols-4 gap-1 text-sm">
          <div className="flex items-center">
            <IconChat className="w-8 shrink-0 p-2" />
            {post.commentCount}
          </div>
          <div className="flex items-center">
            <IconRepeat className="w-8 shrink-0 p-2" />
            {post.repostCount}
          </div>
          <div className="flex items-center">
            <IconHeart className="w-8 shrink-0 p-2" />
            {post.likeCount}
          </div>
          <div className="flex items-center">
            <IconChart className="w-8 shrink-0 p-2" />
            {post.viewCount}
          </div>
        </div>
        <div className="flex">
          <BookmarkIcon className="w-8 p-2" selected={false} />
          <LogoutIcon className="w-8 -rotate-90 p-2" />
        </div>
      </div>
    </Link>
  )
}
