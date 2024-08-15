import type { LayoutProps } from '@/types/nextjs'

import Navigation from '../Navigation'

export default function Layout({ children, params }: LayoutProps) {
  return (
    <>
      <Navigation locale={params.locale} />
      {children}
    </>
  )
}
