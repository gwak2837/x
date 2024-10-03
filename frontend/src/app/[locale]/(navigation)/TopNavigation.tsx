import type { Locale } from '@/middleware'
import type { ReactNode } from 'react'

import Dolphin from '@/svg/Dolphin'
import MenuIcon from '@/svg/MenuIcon'
import Link from 'next/link'

import Drawer from '../../../components/Drawer'
import DrawerProfileLink from './DrawerProfileLink'

type Props = {
  children?: ReactNode
  className?: string
  locale: Locale
}

export default function TopNavigation({ children, className, locale }: Props) {
  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white dark:bg-black ${className}`}
      role="navigation"
    >
      <div className="flex items-center justify-between gap-2 px-2 sm:hidden">
        <Drawer>
          <MenuIcon className="relative h-10 w-10 cursor-pointer p-2" />
          <div className="h-full overflow-x-auto border-r p-4">
            <DrawerProfileLink />
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
            <div>df</div>
          </div>
        </Drawer>
        <Link className="group p-2 focus:outline-none sm:hidden" href={`/${locale}/exam`}>
          <Dolphin className="text-midnight-500 outline-midnight-500 dark:outline-midnight-200 h-8 w-8 rounded border border-transparent group-focus-visible:outline" />
        </Link>
        <div className="w-12" />
      </div>
      {children}
    </nav>
  )
}
