import type { Locale } from '@/middleware'

import Link from 'next/link'

type Props = {
  locale: Locale
}

export default function Navigation({ locale }: Props) {
  return (
    <nav className="flex w-full justify-center gap-2">
      <Link href={`/${locale}`}>Home</Link>
      <Link href={`/${locale}/login`}>Login</Link>
      <Link href={`/${locale}/post`}>Posts</Link>
      <Link href={`/${locale}/post/create`}>Create</Link>
    </nav>
  )
}
