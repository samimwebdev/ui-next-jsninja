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
    enabled: !!serverUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      console.log({ error })
      // Don't retry authentication errors
      if (error?.message?.includes('Authentication required')) {
        return false
      }
      return failureCount < 3
    },
    refetchOnWindowFocus: false, // Don't refetch on window focus to avoid unnecessary calls
    refetchOnMount: 'always',
  })
}
