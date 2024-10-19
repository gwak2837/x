'use client'

import IconArrow from '@/svg/IconArrow'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      className="hover:bg-midnight-500/20 hover:dark:bg-midnight-500/50 focus-visible:outline-midnight-500 focus:dark:outline-midnight-200 rounded-full p-2 transition"
      onClick={() => router.back()}
    >
      <IconArrow className="h-6 w-6" />
    </button>
  )
}
