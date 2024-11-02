import useFetchWithAuth from '@/hook/useFetchWithAuth'
import { useQuery } from '@tanstack/react-query'

type Params = {
  id: string
}

export default function useUserQuery({ id }: Params) {
  const fetchWithAuth = useFetchWithAuth()
  const userQueryKey = getUserQueryKey({ id })

  return useQuery({
    queryKey: userQueryKey,
    queryFn: () => fetchWithAuth<UserQueryResponse>(userQueryKey[0]),
    enabled: Boolean(id),
  })
}

type UserQueryResponse = {
  name: string
  nickname: string
  profileImageURLs: string[]
}

export function getUserQueryKey({ id }: Params) {
  return [`/user/${id}`]
}
