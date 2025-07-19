// components/AuthProvider.tsx
'use client'

import { createContext, useContext, ReactNode } from 'react'

// Define the user type
export type User = {
  id: number
  documentId: string // Assuming this is the user ID in your Strapi setup
  email: string
  username?: string
  confirmed?: boolean
  profile?: {
    firstName: string
    lastName: string
    address?: string // Optional address field
    phone?: string // Optional phone field
    bio?: string // Optional bio field
    phoneNumber?: string // Optional phone image URL
    imageUrl?: string // Optional profile image URL
    image?: {
      formats?: {
        medium?: {
          url: string
        }
      }
      url?: string // Original image URL
    }
  }
} | null

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
