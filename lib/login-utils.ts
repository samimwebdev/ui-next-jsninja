// lib/login-utils.ts
import { LoginHistoryItem } from '@/types/dashboard-types'

export function getDeviceType(
  userAgent: string
): 'desktop' | 'mobile' | 'tablet' | 'laptop' {
  const ua = userAgent.toLowerCase()

  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    return 'mobile'
  }
  if (/tablet|ipad/i.test(ua)) {
    return 'tablet'
  }
  if (/macbook|laptop/i.test(ua)) {
    return 'laptop'
  }
  return 'desktop'
}

export function getBrowserName(userAgent: string): string {
  const ua = userAgent.toLowerCase()

  if (ua.includes('edg')) return 'Edge'
  if (ua.includes('chrome')) return 'Chrome'
  if (ua.includes('firefox')) return 'Firefox'
  if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari'
  if (ua.includes('opera')) return 'Opera'

  return 'Unknown Browser'
}

export function getDeviceInfo(
  browserData: LoginHistoryItem['browserData']
): string {
  const browser = getBrowserName(browserData.userAgent)
  const platform = browserData.platform.includes('Win')
    ? 'Windows'
    : browserData.platform.includes('Mac')
    ? 'Mac'
    : browserData.platform.includes('Linux')
    ? 'Linux'
    : browserData.platform

  return `${platform} - ${browser}`
}

// FIX: Updated status logic
export function getStatusVariant(accessType: LoginHistoryItem['accessType']): {
  status: 'safe' | 'suspicious'
  className: string
  label: string
} {
  switch (accessType) {
    case 'different_ip_same_browser':
    case 'same_ip_different_browser':
      return {
        status: 'suspicious',
        className:
          'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
        label: 'Suspicious',
      }
    case 'first_access':
    default:
      return {
        status: 'safe',
        className:
          'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
        label: 'Safe',
      }
  }
}

export function formatTimestamp(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
