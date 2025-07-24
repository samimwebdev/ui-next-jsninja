const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL!

// This file is used to interact with the Strapi API.
// It provides a function to fetch data from the Strapi backend.
// The function supports custom headers, caching, and Next.js revalidation.
export async function strapiFetch<T>(
  path: string,
  options: RequestInit & {
    token?: string
    cache?: RequestCache
    next?: {
      revalidate?: number | false
      tags?: string[]
    }
  } = {}
): Promise<T> {
  const { cache = 'no-store', token, next, ...rest } = options

  try {
    console.log(`Fetching API endpoint: ${STRAPI}${path}`)
    const res = await fetch(`${STRAPI}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache, // 'no-store' | 'force-cache' | 'default'
      next, // supports { revalidate, tags } for Next.js 15
      ...rest,
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.log('Error data:', errorData)
      throw new Error(errorData?.error?.message || 'Server Error')
    }
    return res.json()
  } catch (err) {
    let message = 'Something went wrong'

    if (err instanceof Error) {
      message = err.message
    } else if (typeof err === 'string') {
      message = err
    }

    throw new Error(message)
  }
}
