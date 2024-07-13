import { create } from 'zustand'

export type AuthStore = {
  accessToken: string
  setAccessToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  accessToken: '',
  setAccessToken: (accessToken) => set(() => ({ accessToken })),
}))
