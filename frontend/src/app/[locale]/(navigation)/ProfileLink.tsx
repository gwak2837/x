'use client'

import type { BaseParams } from '@/types/nextjs'

import { THEME_COLOR } from '@/common/constants'
import Squircle from '@/components/Squircle'
import LoginIcon from '@/svg/LoginIcon'
import { useAuthStore } from '@/zustand/auth'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import NavigLink from './NavigLink'

export default function ProfileLink() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const { locale } = useParams<BaseParams>()
  const pathname = usePathname()

  function handleLoginLink() {
    sessionStorage.setItem('login-redirection', pathname)
  }

  return accessToken ? (
    <Link
      className="flex items-center justify-center gap-2 sm:px-2 sm:py-4"
      href={`/${locale}/@${/* user.name */ 123}`}
    >
      <Squircle
        // href={user?.profileImageURLs?.[0]}
        className="text-white"
        fill={THEME_COLOR}
        src="https://pbs.twimg.com/profile_images/1699716066455506944/z9gfVj-__x96.jpg"
        wrapperClassName="w-8 flex-shrink-0 sm:w-10"
      >
        {/* {user?.nickname?.slice(0, 2) ?? 'DS'} */}
      </Squircle>
      <div className="min-w-0">
        <div className="hidden overflow-hidden text-ellipsis whitespace-nowrap xl:block">
          sadfasdfasdfasdfasdfsdfasdfsasafdsaf
        </div>
        <div className="hidden overflow-hidden text-ellipsis whitespace-nowrap xl:block">
          sadfasdfasdfasdfasdfsdfasdfsasafdsaf
        </div>
      </div>
      <div className="hidden xl:block">...</div>
    </Link>
  ) : (
    <NavigLink
      Icon={LoginIcon}
      className="sm:py-2"
      href={`/${locale}/login`}
      onClick={handleLoginLink}
    >
      로그인
    </NavigLink>
  )
}
