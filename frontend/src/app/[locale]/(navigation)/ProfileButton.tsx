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
    <Link className="flex gap-2" href={`/${locale}/@${/* user.name */ 123}`}>
      <Squircle
        fill={/* toHexColor(user?.nickname) ??  */ '#fae100'}
        // href={user?.profileImageURLs?.[0]}
        wrapperClassName="w-7 sm:w-9"
      >
        {/* {user?.nickname?.slice(0, 2) ?? 'DS'} */}
      </Squircle>
      <div className="hidden overflow-hidden text-ellipsis whitespace-nowrap lg:block">
        sadfasdfasdfasdfasdfsdfasdfsasafdsaf
      </div>
      <div className="hidden lg:block">...</div>
    </Link>
  ) : (
    <Link className="text-center" href={`/${locale}/login`}>
      로그인
    </Link>
  )
}
