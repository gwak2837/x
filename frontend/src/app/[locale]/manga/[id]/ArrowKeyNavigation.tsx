'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Props = {
  max: number
  i: number
}

export default function ArrowKeyNavigation({ max, i }: Props) {
  const router = useRouter()

  useEffect(() => {
    function downHandler({ code }: KeyboardEvent) {
      const newSearchParams = new URLSearchParams({ max: String(max) })

      if (code === 'ArrowLeft') {
        newSearchParams.set('i', String(Math.max(1, i - 1)))
        router.replace(`?${newSearchParams}`)
      } else if (code === 'ArrowRight') {
        newSearchParams.set('i', String(Math.min(i + 1, max)))
        router.replace(`?${newSearchParams}`)
      }
    }

    document.addEventListener('keydown', downHandler)
    return () => {
      document.removeEventListener('keydown', downHandler)
    }
  }, [i])

  return null
}
