import type { PageProps } from '@/types/nextjs'

import { permanentRedirect } from 'next/navigation'

import { filters } from './[filter]/enum'

export default async function Page({ params }: PageProps) {
  const locale = params.locale
  permanentRedirect(`/${locale}/post/filter/${filters[0]}`)
}
