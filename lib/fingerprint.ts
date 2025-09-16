// lib/fingerprint.ts
export interface BrowserData {
  userAgent: string
  language: string
  platform: string
  screenResolution: string
  timezone: string
  plugins: string[]
}

export function getBrowserData(): BrowserData {
  if (typeof window === 'undefined') {
    // Return default values for SSR
    return {
      userAgent: '',
      language: 'en-US',
      platform: '',
      screenResolution: '',
      timezone: 'UTC',
      plugins: [],
    }
  }

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    plugins: Array.from(navigator.plugins).map((plugin) => plugin.name),
  }
}

export function generateFingerprintId(): string {
  return `fp_${Math.random().toString(36).substr(2, 9)}`
}
