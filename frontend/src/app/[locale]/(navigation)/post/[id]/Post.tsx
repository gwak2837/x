'use client'

import type { Locale } from '@/middleware'
import type { TPost } from '@/mock/post'

import { THEME_COLOR } from '@/common/constants'
import Squircle from '@/components/Squircle'
import PostImages from '@/components/post/PostImages'
import PostItem from '@/components/post/PostItem'
import useFetchWithAuth from '@/hook/useFetchWithAuth'
import BookmarkIcon from '@/svg/BookmarkIcon'
import Icon3Dots from '@/svg/Icon3Dots'
import IconChart from '@/svg/IconChart'
import IconChat from '@/svg/IconChat'
import IconHeart from '@/svg/IconHeart'
import IconRepeat from '@/svg/IconRepeat'
import { useAuthStore } from '@/zustand/auth'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import FollowButton from './FollowButton'

type Props = {
  initialPost: TPost
}

export default function Post({ initialPost }: Props) {
  const params = useParams()
  const locale = params.locale as Locale

  const accessToken = useAuthStore((state) => state.accessToken)
  const fetchWithAuth = useFetchWithAuth()

  const { data: post } = useQuery({
    queryKey: ['post', initialPost.id],
    queryFn: () => fetchWithAuth<TPost>(`/post/${initialPost.id}?include=parent-post`),
    initialData: initialPost,
    enabled: Boolean(accessToken),
  })

  const author = post.author

  return (
    <section>
      {post.parentPosts?.map((post) => (
        <PostItem isThread key={post.id} locale={locale} post={post} />
      ))}
      <div className="grid gap-4 px-4 py-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Squircle
              className="text-white"
              fill={THEME_COLOR}
              src={author.profileImageURLs?.[0]}
              wrapperClassName="w-10 flex-shrink-0"
            >
              {author.nickname.slice(0, 2)}
            </Squircle>
            <div>
              <div>{author.nickname}</div>
              <div className="text-gray-500">@{author.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FollowButton />
            <Icon3Dots className="w-5 text-gray-500" />
          </div>
        </div>
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.imageURLs && (
          <PostImages
            className="max-h-[512px] overflow-hidden border"
            initialPost={post}
            urls={post.imageURLs}
          />
        )}
        <div className="flex items-center gap-1 text-gray-500">
          <span>{post.createdAt}</span>
          <span>·</span>
          <span className="translate-y-px text-sm">
            <span className="font-bold text-black dark:text-white">{101}</span> 조회수
          </span>
        </div>
        <div className="flex justify-between gap-1 border-b border-t px-2 py-1 text-sm">
          {[
            { Icon: IconChat, content: post.commentCount },
            { Icon: IconRepeat, content: post.repostCount },
            { Icon: IconHeart, content: post.likeCount },
            { Icon: IconChart, content: post.viewCount },
            { Icon: BookmarkIcon },
          ].map(({ Icon, content }) => (
            <div className="flex items-center">
              <button className="group flex items-center gap-2 p-2">
                <Icon className="w-6 shrink-0 rounded-full group-hover:bg-white" selected={false} />
                {content}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
