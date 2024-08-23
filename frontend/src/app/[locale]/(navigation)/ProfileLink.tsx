'use client'

import type { BaseParams } from '@/types/nextjs'

import { THEME_COLOR } from '@/common/constants'
import Squircle from '@/components/Squircle'
import useUserQuery from '@/query/useUserQuery'
import LoginIcon from '@/svg/LoginIcon'
import MoreIcon from '@/svg/MoreIcon'
import { parseJWT } from '@/util'
import { useAuthStore } from '@/zustand/auth'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import NavigLink from './NavigLink'

export default function ProfileLink() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const userId: string = parseJWT(accessToken).sub
  const { data: user } = useUserQuery({ id: userId })
  const userNickname = user?.nickname ?? ''
  const userName = user?.name ?? ''

  const { locale } = useParams<BaseParams>()
  const pathname = usePathname()

  function handleLoginLink() {
    sessionStorage.setItem('login-redirection', pathname)
  }

  return accessToken ? (
    <Link
      className="flex items-center justify-center gap-3 rounded-full sm:px-2 sm:py-4"
      href={`/${locale}/@${userName}`}
    >
      <Squircle
        className="text-white"
        fill={THEME_COLOR}
        src={
          user?.profileImageURLs?.[0] ??
          'https://pbs.twimg.com/profile_images/1699716066455506944/z9gfVj-__x96.jpg'
        }
        wrapperClassName="w-8 flex-shrink-0 sm:w-10"
      >
        {userNickname.slice(0, 2)}
      </Squircle>
      <div className="grid min-w-0 gap-1">
        <div className="hidden overflow-hidden text-ellipsis whitespace-nowrap leading-5 xl:block">
          {userNickname}
        </div>
        <div className="dark:text-midnight-400 text-midnight-300 hidden overflow-hidden text-ellipsis whitespace-nowrap leading-5 xl:block">
          @{userName}
        </div>
      </div>
      <MoreIcon className="hidden w-5 xl:block" />
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
