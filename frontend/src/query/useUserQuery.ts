import useFetchWithAuth from '@/hook/useFetchWithAuth'
import { useQuery } from '@tanstack/react-query'

type Params = {
  id: string
}

export default function useUserQuery({ id }: Params) {
  const fetchWithAuth = useFetchWithAuth()

  return useQuery({
    queryKey: getUserQueryKey({ id }),
    queryFn: () =>
      fetchWithAuth<{ name: string; nickname: string; profileImageURLs: string[] }>(`/user/${id}`),
    enabled: Boolean(id),
  })
}

type Params2 = {
  id: string
}

export function getUserQueryKey({ id }: Params2) {
  return [`/user/${id}`]
}
