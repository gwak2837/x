import type { BasePageProps } from '@/types/nextjs'

import { permanentRedirect } from 'next/navigation'

export default function HomePage({ params }: BasePageProps) {
  permanentRedirect(`${params.locale}/exam`)
}
