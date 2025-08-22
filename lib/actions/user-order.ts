import { strapiFetch } from '@/lib/strapi'
import { OrdersResponse } from '@/types/dashboard-types'
import { getAuthToken } from '@/lib/auth'

export async function fetchUserOrders(): Promise<OrdersResponse> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required to fetch orders')
    }

    const response = await strapiFetch<OrdersResponse>('/api/orders', {
      method: 'GET',
      token,
    })

    return response
  } catch (error) {
    console.error('Error fetching user orders:', error)
    throw error instanceof Error ? error : new Error('Failed to fetch orders')
  }
}
