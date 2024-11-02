'use client'

import type { Locale } from '@/middleware'
import type { TPost } from '@/mock/post'

import { THEME_COLOR } from '@/common/constants'
import Squircle from '@/components/Squircle'
import PostCreationForm, { PostCreationFormSkeleton } from '@/components/post/PostCreationForm'
import PostImages from '@/components/post/PostImages'
import PostItem from '@/components/post/PostItem'
import ReferredPost from '@/components/post/ReferredPost'
import useFetchWithAuth from '@/hook/useFetchWithAuth'
import { getUserId, useAuthStore } from '@/model/auth'
import { useFollowStore } from '@/model/follow'
import useUserQuery from '@/query/useUserQuery'
import BookmarkIcon from '@/svg/BookmarkIcon'
import Icon3Dots from '@/svg/Icon3Dots'
import IconChart from '@/svg/IconChart'
import IconChat from '@/svg/IconChat'
import IconHeart from '@/svg/IconHeart'
import IconRepeat from '@/svg/IconRepeat'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

import FollowButton from './FollowButton'

type Props = {
  initialPost: TPost
}

export default function Post({ initialPost }: Props) {
  const params = useParams()
  const locale = params.locale as Locale

  const accessToken = useAuthStore((state) => state.accessToken)
  const userId = getUserId(accessToken)
  const fetchWithAuth = useFetchWithAuth()

  const { data: post } = useQuery({
    queryKey: ['post', initialPost.id],
    queryFn: () => fetchWithAuth<TPost>(`/post/${initialPost.id}?include=parent-post`),
    initialData: initialPost,
    enabled: Boolean(accessToken),
  })

  const author = post.author
  const referredPost = post.referredPost
  const isMyPost = userId === author?.id

  const setFollow = useFollowStore((state) => state.setFollow)

  useEffect(() => {
    if (!author || isMyPost || !userId) return

    setFollow({ leaderId: author.id, followerId: userId, isFollowing: true })
  }, [post])

  return (
    <section>
      {post.parentPosts?.map((post) => (
        <PostItem isThread key={post.id} locale={locale} post={post} />
      ))}
      <div className="relative grid gap-4 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex gap-2">
            <Squircle
              className="text-white"
              fill={THEME_COLOR}
              src={author?.profileImageURLs?.[0]}
              wrapperClassName="w-10 flex-shrink-0"
            >
              {author?.nickname.slice(0, 2)}
            </Squircle>
            <div>
              <div aria-disabled={!author} className="font-semibold aria-disabled:text-gray-500">
                {author?.nickname ?? '탈퇴한 사용자입니다'}
              </div>
              {author && <div className="text-gray-500">@{author.name}</div>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isMyPost && author && <FollowButton leader={author} />}
            <Icon3Dots className="w-5 text-gray-500" />
          </div>
        </div>
        <p className="min-w-0 whitespace-pre-wrap text-lg">{post.content}</p>
        {post.imageURLs && (
          <PostImages
            className="w-full overflow-hidden border"
            initialPost={post}
            urls={post.imageURLs}
          />
        )}
        {referredPost && <ReferredPost locale={locale} referredPost={referredPost} />}
        <div className="flex items-center gap-1 text-gray-500">
          <span>{post.createdAt}</span>
          <span>·</span>
          <span className="translate-y-px text-sm">
            <span className="font-bold text-black dark:text-white">{101}</span> 조회수
          </span>
        </div>
        <div className="flex justify-between gap-1 border-b border-t px-2 py-1 text-sm">
          {[
            {
              Icon: IconChat,
              content: post.commentCount,
              iconClassName: 'group-hover:bg-midnight-500/20 group-hover:dark:bg-midnight-500/50',
            },
            {
              Icon: IconRepeat,
              content: post.repostCount,
              iconClassName: 'group-hover:bg-green-500/20 group-hover:text-green-500',
              textClassName: 'hover:text-green-500',
            },
            {
              Icon: IconHeart,
              content: post.likeCount,
              iconClassName: 'group-hover:bg-red-500/20 group-hover:text-red-500',
              textClassName: 'hover:text-red-500',
            },
            {
              Icon: IconChart,
              content: post.viewCount,
              iconClassName: 'group-hover:bg-midnight-500/20 group-hover:dark:bg-midnight-500/50',
            },
            {
              Icon: BookmarkIcon,
              iconClassName: 'group-hover:bg-midnight-500/20 group-hover:dark:bg-midnight-500/50',
            },
          ].map(({ Icon, content, iconClassName = '', textClassName = '' }, i) => (
            <div className="flex items-center" key={i}>
              <button className={`group flex items-center transition ${textClassName}`}>
                <Icon
                  className={`w-10 shrink-0 rounded-full p-2 transition ${iconClassName}`}
                  selected={false}
                />
                {content}
              </button>
            </div>
          ))}
        </div>
        <Suspense fallback={<PostCreationFormSkeleton />}>
          <PostCreationForm buttonText="답글" placeholder="답글 게시하기" />
        </Suspense>
      </div>
    </section>
  )
}
