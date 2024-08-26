'use client'

import type { BaseParams } from '@/types/nextjs'

import LoginIcon from '@/svg/LoginIcon'
import { useAuthStore } from '@/zustand/auth'
import { useParams, usePathname } from 'next/navigation'

import NavigLink from './NavigLink'
import ProfileLink from './ProfileLink'

export default function LoginLink() {
  const accessToken = useAuthStore((state) => state.accessToken)

  const { locale } = useParams<BaseParams>()
  const pathname = usePathname()

  function handleLoginLink() {
    sessionStorage.setItem('login-redirection', pathname)
  }

  return accessToken ? (
    <ProfileLink />
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
