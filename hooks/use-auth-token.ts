import { useQuery } from '@tanstack/react-query'
import { getAuthToken } from '@/lib/auth'

export function useAuthToken() {
  return useQuery({
    queryKey: ['auth-token'],
    queryFn: getAuthToken,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
