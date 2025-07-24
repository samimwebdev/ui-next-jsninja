'use client'

import { StrapiIcon } from '@/types/home-page-types'

export default function DynamicIcon({
  icon,
  width,
  height,
  className,
}: {
  icon: StrapiIcon
  width: number
  height: number
  className?: string
}) {
  return (
    <svg
      width={width}
      height={height}
      className={` ${className}`}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: icon.iconData }}
    />
  )
}
