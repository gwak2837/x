import type { Locale } from '@/middleware'

import { THEME_COLOR } from '@/common/constants'
import Squircle from '@/components/Squircle'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  post: Record<string, any>
  locale: Locale
}

export default function PostItem({ post, locale }: Props) {
  const referredPost = post.referredPost

  return (
    <Link className="grid grid-cols-[auto_1fr] gap-2 px-4 py-3" href={`/post/${post.id}`}>
      <Squircle
        className="text-white"
        fill={THEME_COLOR}
        src="https://pbs.twimg.com/profile_images/1699716066455506944/z9gfVj-__x96.jpg"
        wrapperClassName="w-10"
      >
        {'user.nickname'.slice(0, 2)}
      </Squircle>
      <div className="grid gap-2">
        <div className="flex min-w-0 justify-between gap-1">
          <div className="flex min-w-0 gap-1 whitespace-nowrap">
            <div className="min-w-10 max-w-40 overflow-hidden">user.nicknamenic name</div>
            <div className="min-w-10 max-w-40 overflow-hidden">@user.name</div>
            <span>·</span>
            <div>post.createdAt</div>
            {post.updatedAt && <div>({dict.수정됨[locale]})</div>}
          </div>
          <div>...</div>
        </div>
        <p className="max-w-prose">{post.content}</p>
        <div className="grid overflow-hidden rounded">
          <Image
            alt="post-image"
            className="aspect-video object-cover"
            height={400}
            src="https://pbs.twimg.com/media/GUndZk7XwAAajBV?format=jpg&name=medium"
            width={400}
          />
        </div>
        {referredPost && (
          <div className="min-w-0 overflow-hidden rounded border">
            <div className="flex min-w-0 justify-between gap-1">
              <div className="flex min-w-0 gap-1 whitespace-nowrap">
                <Squircle
                  className="text-white"
                  fill={THEME_COLOR}
                  src="https://pbs.twimg.com/profile_images/1699716066455506944/z9gfVj-__x96.jpg"
                  wrapperClassName="w-6 flex-shrink-0"
                >
                  {'user.nickname'.slice(0, 2)}
                </Squircle>
                <div className="min-w-10 max-w-40 overflow-hidden">user.nicknamenic name</div>
                <div className="min-w-10 max-w-40 overflow-hidden">@user.name</div>
                <span>·</span>
                <div>post.createdAt</div>
                {referredPost.updatedAt && <div>{dict.수정됨[locale]}</div>}
              </div>
              <div>...</div>
            </div>
            <p className="max-w-prose">referredPost.content</p>
          </div>
        )}
      </div>
    </Link>
  )
}

const dict = {
  수정됨: {
    en: 'Edited',
    ko: '수정됨',
  },
} as const
