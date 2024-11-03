'use client'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { LocalStorage } from '@/common/storage'
import { useAuthStore } from '@/model/auth'
import { sleep } from '@/util'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

import { LoginSearchParams } from './(navigation)/login/enum'

export default function AccessTokenFetcher() {
  const { accessToken, setAccessToken } = useAuthStore()
  const searchParams = useSearchParams()
  const isLogining = searchParams.get(LoginSearchParams.CODE)

  useEffect(() => {
    ;(async () => {
      if (accessToken !== null || isLogining) return

      const refreshToken = localStorage.getItem(LocalStorage.REFRESH_TOKEN)
      if (!refreshToken) {
        setAccessToken('')
        return
      }

      const newAccessToken = await fetchAccessToken({
        retries: 3,
        delay: 1,
        refreshToken,
      })

      setAccessToken(newAccessToken)
    })()
  }, [accessToken, isLogining, setAccessToken])

  return null
}

type Params = {
  retries: number
  delay: number
  refreshToken: string
}

async function fetchAccessToken({ retries, delay, refreshToken }: Params): Promise<string> {
  if (retries <= 0) {
    localStorage.removeItem(LocalStorage.REFRESH_TOKEN)
    toast.error('인증 오류가 발생했어요. 잠시 후 다시 로그인해주세요.')
    return ''
  }

  try {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/access-token`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
    if (response.status === 401) {
      localStorage.removeItem(LocalStorage.REFRESH_TOKEN)
      toast.error(
        <div>
          로그인 유지 기간이 만료됐어요{' '}
          <Link className="text-violet-700 underline underline-offset-2" href="/login">
            로그인하기
          </Link>
        </div>,
      )
      return ''
    } else if (response.status === 403) {
      localStorage.removeItem(LocalStorage.REFRESH_TOKEN)
      toast.error('로그인할 수 없어요')
      return ''
    } else if (!response.ok) {
      await sleep(delay)
      return fetchAccessToken({ retries: retries - 1, delay: delay * 2, refreshToken })
    }

    const { accessToken } = await response.json()
    return accessToken
  } catch (error) {
    await sleep(delay)
    return fetchAccessToken({ retries: retries - 1, delay: delay * 3, refreshToken })
  }
}
