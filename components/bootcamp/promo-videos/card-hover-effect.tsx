'use client'

import { cn } from '@/lib/utils'
import type React from 'react'
import { createContext, useRef, useState } from 'react'

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)

export const CardHoverEffect = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}) => {
  const [isMouseEntered, setIsMouseEntered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        ref={ref}
        onMouseEnter={() => setIsMouseEntered(true)}
        onMouseLeave={() => setIsMouseEntered(false)}
        className={cn('relative group', containerClassName)}
      >
        <div className={cn('relative', className)}>{children}</div>
      </div>
    </MouseEnterContext.Provider>
  )
}
