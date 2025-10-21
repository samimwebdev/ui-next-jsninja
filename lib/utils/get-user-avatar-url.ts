// Helper function to get user avatar URL
export function getUserAvatarUrl(
  userProfileImage:
    | string
    | { url: string; formats?: { thumbnail?: { url: string } } }
): string {
  // If it's a string (external URL like GitHub avatar)
  if (typeof userProfileImage === 'string') {
    return userProfileImage
  }

  // If it's an object (Strapi media), prefer thumbnail
  if (userProfileImage?.formats?.thumbnail?.url) {
    return userProfileImage.formats.thumbnail.url
  }

  // Fallback to main URL
  return userProfileImage?.url || ''
}
