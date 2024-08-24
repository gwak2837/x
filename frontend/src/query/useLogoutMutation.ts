import useFetchWithAuth from '@/hook/useFetchWithAuth'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export default function useLogoutMutation() {
  const fetchWithAuth = useFetchWithAuth()
  return useMutation({
    mutationFn: () => fetchWithAuth(`/auth/logout`, { method: 'DELETE' }),
    onError: (error) => toast.error(error.message),
  })
}
