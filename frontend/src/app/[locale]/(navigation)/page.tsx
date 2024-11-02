import type { BasePageProps } from '@/types/nextjs'

import { permanentRedirect } from 'next/navigation'

export default async function HomePage(props: BasePageProps) {
  const params = await props.params;
  permanentRedirect(`${params.locale}/exam`)
}
