import type { PageProps } from '@/types/nextjs'

import { permanentRedirect } from 'next/navigation'

export default function HomePage({ params }: PageProps) {
  permanentRedirect(`${params.locale}/exam`)
}
