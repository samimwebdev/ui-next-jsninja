'use client'

import { StrapiIcon } from '@/types/home-page-types'

export default function DynamicLogo({
  icon,
  width,
  height,
}: {
  icon: StrapiIcon
  width: number
  height: number
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: icon.iconData }}
    />
  )
}
