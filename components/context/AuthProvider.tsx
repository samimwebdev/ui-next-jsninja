// components/AuthProvider.tsx
'use client'

import { User } from '@/types/shared-types'
import { createContext, useContext, ReactNode } from 'react'

// Create context with proper typing
export const UserContext = createContext<User>(null)

// Provider component props type
interface AuthProviderProps {
  children: ReactNode
  user: User | null // Pass user data as prop instead of fetching inside component
}

export default function AuthProvider({ children, user }: AuthProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

// Custom hook
export const useUser = (): User => {
  const context = useContext(UserContext)

  // Optional: Add error handling if context is used outside provider
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider')
  }

  return context
}
