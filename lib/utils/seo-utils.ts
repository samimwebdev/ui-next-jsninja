export function cleanHtmlForSeo(html: string, maxLength: number = 160): string {
  // Remove HTML tags
  const textOnly = html.replace(/<[^>]*>/g, '')

  // Remove extra whitespace and special characters
  const cleaned = textOnly
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[^;]+;/g, '')
    .trim()

  // Truncate to max length
  if (cleaned.length <= maxLength) return cleaned

  const truncated = cleaned.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...'
}

export function extractKeywordsFromContent(
  content: string,
  existingKeywords?: string
): string[] {
  // Split existing keywords
  const keywords = existingKeywords
    ? existingKeywords.split(',').map((k) => k.trim())
    : []

  // You could add more sophisticated keyword extraction here
  // For now, just return the existing keywords
  return keywords
}
