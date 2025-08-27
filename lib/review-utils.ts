// lib/review-utils.ts
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export function formatReviewDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
