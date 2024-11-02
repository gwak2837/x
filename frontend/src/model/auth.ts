import { parseJWT } from '@/util'
import { create } from 'zustand'

export type AuthStore = {
  accessToken: string
  isLoading: boolean
  setAccessToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  accessToken: '',
  isLoading: true,
  setAccessToken: (accessToken) => set(() => ({ accessToken, isLoading: false })),
}))

export function getUserId(accessToken: string) {
  return (parseJWT(accessToken)?.sub ?? '') as string
}
