// hooks/use-current-user.ts
import { useUser } from '@/components/context/AuthProvider'
import { fetchCurrentUser } from '@/lib/actions/current-user'
import { useQuery } from '@tanstack/react-query'

// Replace this with your actual user fetching logic
export function useCurrentUser() {
  const serverUser = useUser()
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    initialData: serverUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
