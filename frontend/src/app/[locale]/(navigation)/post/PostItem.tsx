import { THEME_COLOR } from '@/common/constants'
import Squircle from '@/components/Squircle'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  post: Record<string, any>
}

export default function PostItem({ post }: Props) {
  return (
    <Link className="grid grid-cols-[auto_1fr] gap-2 p-4" href={`/post/${post.id}`}>
      <Squircle
        className="text-white"
        fill={THEME_COLOR}
        src="https://pbs.twimg.com/profile_images/1699716066455506944/z9gfVj-__x96.jpg"
        wrapperClassName="w-10"
      >
        {/* {user?.nickname?.slice(0, 2) ?? 'DS'} */}
      </Squircle>
      <div className="grid gap-2">
        <div className="flex justify-between gap-1">
          <div className="flex gap-1">
            <div>user.nickname</div>
            <div>@user.name</div>
            <span>·</span>
            <div>post.createdAt</div>
            <div>post.updatedAt</div>
          </div>
          <div>...</div>
        </div>
        <p>{post.content}</p>
        <div className="grid overflow-hidden rounded">
          <Image
            alt="post-image"
            className="aspect-video object-cover"
            height={400}
            src="https://pbs.twimg.com/media/GUndZk7XwAAajBV?format=jpg&name=medium"
            width={400}
          />
        </div>
        <div className="rounded border">
          <div className="flex justify-between gap-1">
            <div className="flex gap-1">
              <Squircle
                className="text-white"
                fill={THEME_COLOR}
                src="https://pbs.twimg.com/profile_images/1699716066455506944/z9gfVj-__x96.jpg"
                wrapperClassName="w-6"
              >
                {/* {user?.nickname?.slice(0, 2) ?? 'DS'} */}
              </Squircle>
              <div>user.nickname</div>
              <div>@user.name</div>
              <span>·</span>
              <div>post.createdAt</div>
              <div>post.updatedAt</div>
            </div>
            <div>...</div>
          </div>
          <p>referredPost.content</p>
        </div>
      </div>
    </Link>
  )
}
