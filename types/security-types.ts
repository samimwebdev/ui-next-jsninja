export interface BrowserData {
  userAgent: string
  language: string
  platform: string
  screenResolution: string
  timezone: string
  plugins: string[]
}

export interface SecurityTrackingPayload {
  fingerprintId: string
  testOverrideIP?: string
  browserData: BrowserData
}

export interface LocationData {
  country: string
  countryCode: string
  region: string
  city: string
  latitude: number
  longitude: number
  timezone: string
  isp: string
}

export interface SecurityCheckResponse {
  error: boolean
  data: {
    accessType: string
    ipAddress: string
    locationData: LocationData
    fingerprintId: string
    isTracked: boolean
  } | null
}

export interface SecurityErrorResponse {
  data: null
  error: {
    status: number
    name: string
    message: string
    details: object
  }
}
