import useFetchWithAuth from '@/hook/useFetchWithAuth'
import { getUserId, useAuthStore } from '@/model/auth'
import { useFollowStore } from '@/model/follow'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

type Params = {
  leaderId: string
}

type MutationParams = {
  type: 'follow' | 'unfollow'
}

export default function useFollowMutation({ leaderId }: Params) {
  const fetchWithAuth = useFetchWithAuth()
  const accessToken = useAuthStore((state) => state.accessToken)
  const userId = getUserId(accessToken)
  const setFollow = useFollowStore((state) => state.setFollow)
  return useMutation({
    mutationFn: ({ type }: MutationParams) =>
      fetchWithAuth(`/user/${leaderId}/follower`, {
        method: type === 'follow' ? 'POST' : 'DELETE',
      }),
    onError: (error) => toast.error(error.message),
    onSuccess: (_, { type }) =>
      setFollow({ leaderId, followerId: userId, isFollowing: type === 'follow' }),
  })
}
