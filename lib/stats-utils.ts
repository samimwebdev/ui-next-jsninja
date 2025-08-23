// lib/stats-utils.ts
import { WeeklyCourseProgress, StatsAssignment } from '@/types/dashboard-types'

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function getTotalTimeSpent(totalTimeSpent: number): string {
  return formatDuration(totalTimeSpent)
}

export function processWeeklyProgress(
  weeklyCourseProgress: WeeklyCourseProgress[]
) {
  return weeklyCourseProgress.map((week) => ({
    week: `Week ${week.week}`,
    progress: Math.round(
      (week.weeklyStats.completedLessons /
        Math.max(week.weeklyStats.totalLessons, 1)) *
        100
    ),
  }))
}

export function processDailyActivity(
  dailyStrength: Record<string, 'no' | 'weak' | 'medium' | 'strong'>
): number[] {
  const daysProgressStats = Object.entries(dailyStrength)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([, strength]) => {
      switch (strength) {
        case 'strong':
          return 3
        case 'medium':
          return 2
        case 'weak':
          return 1
        case 'no':
        default:
          return 0
      }
    })

  //   // Pad with zeros if less than 52 days
  //   while (daysProgressStats.length < 52) {
  //     daysProgressStats.unshift(0)
  //   }

  return daysProgressStats
}

export function getAssignmentStatus(assignment: StatsAssignment): {
  status: string
  className: string
} {
  const now = new Date()
  const deadline = new Date(assignment.deadline)
  const isOverdue = now > deadline

  switch (assignment.status) {
    case 'graded':
      return {
        status: 'graded',
        className:
          'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      }
    case 'submitted':
      return {
        status: 'Submitted',
        className:
          'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      }
    case 'pending':
      return {
        status: isOverdue ? 'Overdue' : 'Pending',
        className: isOverdue
          ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      }
    default:
      return {
        status: 'Unknown',
        className:
          'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
      }
  }
}
