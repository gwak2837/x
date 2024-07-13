/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { useAuthStore } from '@/zustand/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const provider = searchParams.get('provider')
  const [reason, setReason] = useState('')
  const setAccessToken = useAuthStore((state) => state.setAccessToken)

  useEffect(() => {
    if (!code || !provider) return

    const loginPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/${provider}?code=${code}`, {
          method: 'POST',
        })

        if (response.status === 403) {
          setReason(await response.text())
          reject()
          return
        } else if (response.status >= 500) {
          reject()
          return
        }

        const result = await response.json()
        setAccessToken(result.accessToken)
        localStorage.setItem('refreshToken', result.refreshToken)

        const deletedSearchParams = new URLSearchParams(searchParams)
        deletedSearchParams.delete('code')
        deletedSearchParams.delete('provider')
        router.replace(`?${deletedSearchParams}`)
        resolve()
      } catch (error) {
        reject(error)
      }
    })

    toast.promise(loginPromise, {
      loading: '로그인 중이에요',
      success: '로그인에 성공했어요',
      error: '로그인에 실패했어요',
    })
  }, [code])

  return <div>{reason}</div>
}
