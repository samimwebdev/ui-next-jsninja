// lib/certificate-utils.ts
export function formatDuration(durationStr: string): string {
  const duration = parseInt(durationStr)
  const weeks = Math.ceil(duration / (7 * 24 * 60 * 60)) // Convert seconds to weeks
  return `${weeks} week${weeks !== 1 ? 's' : ''}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function parseSkills(skillsString: string): string[] {
  return skillsString
    .split(',')
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0)
}

export function calculateTotalScore(
  receivedQuizMarks: number,
  totalQuizMarks: number,
  receivedAssignmentMarks: number,
  totalAssignmentMarks: number
): number {
  const totalPossible = totalQuizMarks + totalAssignmentMarks
  const totalReceived = receivedQuizMarks + receivedAssignmentMarks

  if (totalPossible === 0) return 0
  return Math.round((totalReceived / totalPossible) * 100)
}

export function downloadCertificate(url: string, courseName: string): void {
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.download = `${courseName
    .replace(/\s+/g, '-')
    .toLowerCase()}-certificate.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
