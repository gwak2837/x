'use client'

import type { ReactNode } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
  iconClassName?: string
  href: string
  children: ReactNode
  Icon: (props: { className: string; selected: boolean }) => ReactNode
}

export default function NavigationLink({
  className = '',
  iconClassName = '',
  href,
  children,
  Icon,
}: Props) {
  const pathname = usePathname()
  const isSelected = pathname === href

  return (
    <Link className={`group flex p-2 sm:block sm:p-0 ${className}`} href={href}>
      <div className="group-hover:bg-midnight-500/20 group-hover:dark:bg-midnight-500/50 group-focus-visible:border-midnight-400 group-focus-visible:dark:border-midnight-200 mx-auto flex w-fit items-center gap-5 rounded-full border-2 border-transparent p-3 transition group-active:scale-95 lg:m-0">
        <Icon
          className={`w-6 transition-transform group-hover:scale-105 ${iconClassName}`}
          selected={isSelected}
        />
        <span className="hidden min-w-0 lg:block">{children}</span>
      </div>
    </Link>
  )
}
