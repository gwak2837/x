import { create } from 'zustand'

export type FollowStore = {
  follow: Record<string, Record<string, boolean> | undefined>
  setFollow: ({ leaderId, followerId, isFollowing }: Params) => void
}

type Params = {
  leaderId: string
  followerId: string
  isFollowing: boolean
}

export const useFollowStore = create<FollowStore>()((set) => ({
  follow: {},
  setFollow: ({ leaderId, followerId, isFollowing }: Params) =>
    set((prev) => ({
      follow: {
        ...prev.follow,
        [leaderId]: {
          ...prev.follow?.[leaderId],
          [followerId]: isFollowing,
        },
      },
    })),
}))
