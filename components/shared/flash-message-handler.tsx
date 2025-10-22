'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function FlashMessageHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const error = searchParams.get('error')
    const success = searchParams.get('success')
    const warning = searchParams.get('warning')
    const info = searchParams.get('info')

    if (error) {
      // FIX: Filter out NEXT_REDIRECT messages
      if (error.includes('NEXT_REDIRECT') || error.includes('digest')) {
        cleanUpUrl('error')
        return
      }

      toast.error('Access Error', {
        description: error,
        duration: 6000,
        action: {
          label: 'Dismiss',
          onClick: () => {},
        },
      })
      // Clean up URL
      cleanUpUrl('error')
    }

    if (success) {
      toast.success('Success', {
        description: success,
        duration: 4000,
      })
      cleanUpUrl('success')
    }

    if (warning) {
      toast.warning('Warning', {
        description: warning,
        duration: 5000,
      })
      cleanUpUrl('warning')
    }

    if (info) {
      toast.info('Information', {
        description: info,
        duration: 4000,
      })
      cleanUpUrl('info')
    }
  }, [searchParams, router])

  const cleanUpUrl = (param: string) => {
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete(param)
    router.replace(newUrl.pathname + newUrl.search, { scroll: false })
  }

  return null
}
