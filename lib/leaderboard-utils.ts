// lib/leaderboard-utils.ts
export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function formatProgress(progress: number | null): string {
  if (!progress) {
    return 'N/A'
  }
  return `${progress}%`
}

export function formatScore(score: number): string {
  if (!score) {
    return 'N/A'
  }
  // Round to 2 decimal places if it's a decimal, otherwise show as integer
  return score % 1 === 0 ? score.toString() : score?.toFixed(2)
}

export function getMedalColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'text-yellow-500' // Gold
    case 2:
      return 'text-gray-400' // Silver
    case 3:
      return 'text-amber-600' // Bronze
    default:
      return ''
  }
}
