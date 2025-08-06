import { User } from '@/types/shared-types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractYouTubeId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}

// Generate YouTube thumbnail URL automatically
export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

// Helper function to extract plain text from HTML and limit words
export const getExcerpt = (
  htmlContent: string,
  wordLimit: number = 20
): string => {
  if (!htmlContent) return ''

  // Remove HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ')

  // Clean up extra spaces and split into words
  const words = textContent
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((word) => word.length > 0)

  // Limit to specified number of words
  const limitedWords = words.slice(0, wordLimit)

  // Add ellipsis if content was truncated
  const excerpt = limitedWords.join(' ')
  return words.length > wordLimit ? `${excerpt}...` : excerpt
}

// Helper function to calculate reading time from content
export const calculateReadingTime = (content: string): number => {
  if (!content) return 1 // Minimum 1 minute read

  // Remove HTML tags if content contains them
  const textContent = content.replace(/<[^>]*>/g, '')

  // Count words (split by whitespace and filter out empty strings)
  const wordCount = textContent
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  // Average reading speed is 200-250 words per minute
  // Using 200 WPM for a conservative estimate
  const wordsPerMinute = 200
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute)

  // Minimum 1 minute read time
  return Math.max(1, readingTimeMinutes)
}

// Helper function to format time to read from seconds to minutes
export const formatTimeToRead = (seconds: number): number => {
  if (!seconds || seconds <= 0) return 1 // Minimum 1 minute read

  const minutes = Math.ceil(seconds / 60) // Round up to nearest minute
  return minutes
}

// Updated helper function to handle both string formats and numeric conversions
export const formatDuration = (duration: number | string): string => {
  // If it's a string, check if it's already formatted (contains letters)
  if (typeof duration === 'string') {
    // If the string contains letters (like "13 weeks", "2 hours"), return as is
    if (/[a-zA-Z]/.test(duration)) {
      return duration
    }

    // If it's a numeric string, parse it
    const parsedDuration = parseInt(duration, 10)
    if (isNaN(parsedDuration)) {
      return duration // Return original string if parsing fails
    }
    duration = parsedDuration
  }

  // Handle numeric duration (assuming it's in seconds)
  if (!duration || duration <= 0) return '0 min'

  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)

  if (hours > 0 && minutes > 0) {
    return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ${minutes} ${
      minutes === 1 ? 'min' : 'mins'
    }`
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hr' : 'hrs'}`
  } else {
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'}`
  }
}

// Helper function to clean HTML content
export const getCleanText = (htmlContent: string) => {
  return htmlContent
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

//Helper function to extract features from HTML content
export const extractFeatures = (htmlContent: string): string[] => {
  const features: string[] = []
  const listItemRegex = /<li[^>]*>(.*?)<\/li>/g
  let match

  while ((match = listItemRegex.exec(htmlContent)) !== null) {
    const feature = match[1].replace(/<[^>]*>/g, '').trim()
    if (feature) {
      features.push(feature)
    }
  }

  return features
}

export function getProfileImageUrl(user: User): string | undefined {
  // First, check if imageUrl exists (direct URL like GitHub avatar)
  if (user?.profile?.imageUrl) {
    return user.profile.imageUrl
  }

  // Then, check if there's a Strapi uploaded image
  if (user?.profile?.image?.formats?.medium?.url) {
    // If it's a relative URL, prepend Strapi base URL
    const imageUrl = user.profile.image.formats.medium.url
    if (imageUrl.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`
    }
    return imageUrl
  }

  // Fallback to original image if medium doesn't exist
  if (user?.profile?.image?.url) {
    const imageUrl = user.profile.image.url
    if (imageUrl.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`
    }
    return imageUrl
  }

  return undefined
}
