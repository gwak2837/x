'use client'

import { useAuthStore } from '@/zustand/auth'

export default function Test() {
  const accessToken = useAuthStore((state) => state.accessToken)

  return <div>{accessToken}</div>
}
