import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { useAuthStore } from '@/zustand/auth'

export default function useFetchWithAuth() {
  const authStore = useAuthStore()

  return async <T extends Record<string, unknown>>(
    input: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1],
  ) => {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}${input}`, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })
    if (response.status === 401) {
      authStore.setAccessToken('')
      throw new Error(await response.text())
    }
    if (response.status >= 400) throw new Error(await response.text())
    if (response.status >= 500) throw new Error(await response.text())

    return (await response.json()) as T
  }
}