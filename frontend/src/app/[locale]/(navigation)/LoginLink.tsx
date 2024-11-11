'use client'

import type { BaseParams } from '@/types/nextjs'

import { SessionStorage } from '@/common/storage'
import LoginIcon from '@/svg/LoginIcon'
import { useParams, usePathname } from 'next/navigation'

import NavigLink from './NavigLink'

export default function LoginLink() {
  const { locale } = useParams<BaseParams>()
  const pathname = usePathname()

  return (
    <NavigLink
      Icon={LoginIcon}
      className="sm:py-4"
      href={`/${locale}/login`}
      onClick={() => sessionStorage.setItem(SessionStorage.LOGIN_REDIRECTION, pathname)}
    >
      로그인
    </NavigLink>
  )
}
