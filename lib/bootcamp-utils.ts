import {
  BootcampPageData,
  BootcampComponentType,
  BootcampComponentDataMap,
} from '@/types/bootcamp-page-types'

export function getBootcampContentSection<T extends BootcampComponentType>(
  bootcampData: BootcampPageData,
  componentType: T
): BootcampComponentDataMap[T] | undefined {
  return bootcampData.contentBlock?.find(
    (section): section is BootcampComponentDataMap[T] =>
      section.__component === componentType
  )
}

export function formatBootcampPrice(price: number): string {
  return `${price.toLocaleString()} TK`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function calculateBootcampDuration(
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}
