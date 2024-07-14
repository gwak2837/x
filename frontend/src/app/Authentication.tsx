/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { sleep } from '@/utils'
import { AuthStore, useAuthStore } from '@/zustand/auth'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Authentication() {
  const { accessToken, setAccessToken } = useAuthStore()

  useEffect(() => {
    if (accessToken) return

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return

    fetchAccessToken(3, 1)

    async function fetchAccessToken(retries: number, delay: number) {
      if (retries < 0) {
        localStorage.removeItem('refreshToken')
        toast.error('인증 오류가 발생했어요. 잠시 후 다시 시도해주세요.')
        return
      }

      try {
        const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/access-token`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${refreshToken}` },
        })
        if (response.status === 401) {
          localStorage.removeItem('refreshToken')
          toast.error('로그인 기간이 만료됐어요. 다시 로그인해주세요.')
          return
        } else if (response.status === 403) {
          localStorage.removeItem('refreshToken')
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

export async function fetchWithToken<T>(
  authStore: AuthStore,
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
) {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${authStore.accessToken}`,
    },
  })
  if (!response.ok) {
    if (response.status === 401) authStore.setAccessToken('')
    throw Error(await response.text())
  }

  return (await response.json()) as T
}
