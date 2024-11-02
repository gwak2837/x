import type { BasePageProps } from '@/types/nextjs'

import { permanentRedirect } from 'next/navigation'

import { filters } from './(right-search)/(top-filter)/enum'

export default async function Page(props: BasePageProps) {
  const params = await props.params;
  const locale = params.locale
  permanentRedirect(`/${locale}/post/${filters[0]}`)
}
