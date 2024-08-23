'use client'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { sleep } from '@/util'
import { useAuthStore } from '@/zustand/auth'
import Link from 'next/link'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Authentication() {
  const { accessToken, setAccessToken } = useAuthStore()

  useEffect(() => {
    if (accessToken) return

    const refreshToken = localStorage.getItem('refresh-token')
    if (!refreshToken) return

    fetchAccessToken(3, 1)

    async function fetchAccessToken(retries: number, delay: number) {
      if (retries <= 0) {
        localStorage.removeItem('refresh-token')
        toast.error('인증 오류가 발생했어요. 잠시 후 다시 로그인해주세요.')
        return
      }

      try {
        const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/access-token`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${refreshToken}` },
        })
        if (response.status === 401) {
          localStorage.removeItem('refresh-token')
          toast.error(
            <div>
              로그인 유지 기간이 만료됐어요{' '}
              <Link className="text-violet-700 underline underline-offset-2" href="/login">
                로그인하기
              </Link>
            </div>,
          )
          return
        } else if (response.status === 403) {
          localStorage.removeItem('refresh-token')
          toast.error('로그인할 수 없어요')
          return
        } else if (!response.ok) {
          await sleep(delay)
          fetchAccessToken(retries - 1, delay * 2)
          return
        }

        const { accessToken } = await response.json()
        setAccessToken(accessToken)
      } catch (error) {
        await sleep(delay)
        fetchAccessToken(retries - 1, delay * 3)
      }
    }
  }, [accessToken])

  return null
}
