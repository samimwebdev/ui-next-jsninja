// app/dashboard/page.tsx - CLIENT COMPONENT
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/courses')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ninja-gold/30 border-t-ninja-gold mx-auto"></div>
        <p className="text-muted-foreground">Loading your courses...</p>
      </div>
    </div>
  )
}
