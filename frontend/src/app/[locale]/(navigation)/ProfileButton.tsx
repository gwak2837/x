'use client'

import type { BaseParams } from '@/types/nextjs'

import Squircle from '@/components/Squircle'
import { toHexColor } from '@/util'
import { useAuthStore } from '@/zustand/auth'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import NavigationLink from './NavigationLink'

export default function ProfileLink() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const { locale } = useParams<BaseParams>()

  return accessToken ? (
    <Link
      className="flex items-center justify-center gap-2 sm:py-4"
      href={`/${locale}/@${/* user.name */ 123}`}
    >
      <Squircle
        fill={/* toHexColor(user?.nickname) ??  */ '#fae100'}
        // href={user?.profileImageURLs?.[0]}
        wrapperClassName="w-8 flex-shrink-0 sm:w-10"
      >
        {/* {user?.nickname?.slice(0, 2) ?? 'DS'} */}
      </Squircle>
      <div className="hidden overflow-hidden text-ellipsis whitespace-nowrap xl:block">
        sadfasdfasdfasdfasdfsdfasdfsasafdsaf
      </div>
      <div className="hidden xl:block">...</div>
    </Link>
  ) : (
    <Link className="text-center" href={`/${locale}/login`}>
      로그인
    </Link>
  )
}
