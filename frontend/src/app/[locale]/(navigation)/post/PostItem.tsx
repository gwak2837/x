import type { Locale } from '@/middleware'

import { THEME_COLOR } from '@/common/constants'
import { dict } from '@/common/dict'
import Squircle from '@/components/Squircle'
import BookmarkIcon from '@/svg/BookmarkIcon'
import Icon3Dots from '@/svg/Icon3Dots'
import IconChat from '@/svg/IconChat'
import IconHeart from '@/svg/IconHeart'
import IconRepeat from '@/svg/IconRepeat'
import LogoutIcon from '@/svg/LogoutIcon'
import Link from 'next/link'

import PostImages from './PostImages'

type Props = {
  post: Record<string, any>
  locale: Locale
}

export default function PostItem({ post, locale }: Props) {
  const imageURLs = post.imageURLs
  const author = post.author
  const referredPost = post.referredPost
  const referredPostAuthor = referredPost?.author
  const referredPostContent = referredPost?.content

  return (
    <Link
      className="grid grid-cols-[auto_1fr] gap-2 border-b px-4 pb-2 pt-3 transition hover:bg-gray-100 hover:dark:bg-gray-900"
      href={`/post/${post.id}`}
    >
      <Squircle
        className="text-white"
        fill={THEME_COLOR}
        src="https://pbs.twimg.com/profile_images/1699716066455506944/z9gfVj-__x96.jpg"
        wrapperClassName="w-10"
      >
        {'user.nickname'.slice(0, 2)}
      </Squircle>
      <div className="grid gap-3">
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
          <PostImages className="max-h-[512px] overflow-hidden border" urls={imageURLs} />
        )}
        {referredPost && (
          <div className="grid min-w-0 max-w-prose overflow-hidden rounded-2xl border border-gray-400 transition hover:bg-gray-200 dark:border-gray-600 hover:dark:bg-gray-800">
            <div className="grid gap-1 p-3">
              <div className="flex min-w-0 justify-between gap-1">
                <div className="flex min-w-0 gap-2 whitespace-nowrap">
                  <Squircle
                    className="text-white"
                    fill={THEME_COLOR}
                    src="https://pbs.twimg.com/profile_images/1699716066455506944/z9gfVj-__x96.jpg"
                    wrapperClassName="w-6 flex-shrink-0"
                  >
                    {'user.nickname'.slice(0, 2)}
                  </Squircle>
                  <div className="min-w-0 max-w-40 overflow-hidden font-semibold">
                    {referredPostAuthor.nickname}
                  </div>
                  <div className="flex min-w-0 items-center gap-1 text-gray-500">
                    <div className="min-w-10 max-w-40 overflow-hidden">
                      @{referredPostAuthor.name}
                    </div>
                    <span>·</span>
                    <div className="min-w-10 overflow-hidden">{post.createdAt}</div>
                    {referredPost.updatedAt && <div className="text-xs">{dict.수정됨[locale]}</div>}
                  </div>
                </div>
                <Icon3Dots className="w-5 text-gray-600" />
              </div>
              {referredPostContent && <p>{referredPostContent}</p>}
            </div>
            {imageURLs && (
              <PostImages
                className="max-h-[256px] w-full"
                imageClassName="w-full"
                urls={imageURLs}
              />
            )}
          </div>
        )}
      </div>
      <div className="col-start-2 grid grid-cols-[1fr_auto] gap-2 text-gray-600 dark:text-gray-400">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-1">
            <IconChat className="w-9 p-2" />
            {post.commentCount}
          </div>
          <div className="flex items-center gap-1">
            <IconRepeat className="w-9 p-2" />
            {post.repostCount}
          </div>
          <div className="flex items-center gap-1">
            <IconHeart className="w-9 p-2" />
            {post.likeCount}
          </div>
        </div>
        <div className="flex">
          <BookmarkIcon className="w-9 p-2" selected />
          <LogoutIcon className="w-9 -rotate-90 p-2" />
        </div>
      </div>
    </Link>
  )
}
