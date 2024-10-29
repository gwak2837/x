'use client'

import { useAuthStore } from '@/model/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Redirection() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const router = useRouter()

  useEffect(() => {
    if (accessToken) {
      router.back()
    }
  }, [accessToken])

  return null
}
