import type { BasePageProps } from '@/types/nextjs'

import { permanentRedirect } from 'next/navigation'

import { filters } from './(right-search)/(top-filter)/enum'

export default async function Page({ params }: BasePageProps) {
  const locale = params.locale
  permanentRedirect(`/${locale}/post/${filters[0]}`)
}
