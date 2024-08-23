import type { Locale } from '@/middleware'
import type { ReactNode } from 'react'

import Dolphin from '@/svg/Dolphin'
import MenuIcon from '@/svg/MenuIcon'
import Link from 'next/link'

type Props = {
  children?: ReactNode
  className?: string
  locale: Locale
}

export default function TopNavigation({ children, className, locale }: Props) {
  return (
    <nav className={`fixed top-0 z-50 w-full ${className}`}>
      <div className="flex items-center justify-between gap-2 px-2 sm:hidden">
        <MenuIcon className="h-8 w-8" />
        <Link className="group p-2 focus:outline-none sm:hidden" href={`/${locale}/exam`}>
          <Dolphin className="text-midnight-500 outline-midnight-500 dark:outline-midnight-200 h-12 w-12 rounded border border-transparent group-focus-visible:outline" />
        </Link>
        <div className="w-8" />
      </div>
      {children}
    </nav>
  )
}
