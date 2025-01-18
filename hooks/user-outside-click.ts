import React, { useEffect } from 'react'

/**
 * Hook: useOutsideClick
 *
 * This hook listens for clicks outside a specified DOM element and invokes a callback function.
 *
 * Source: [https://ui.aceternity.com/components/expandable-card by Manu Arora]
 *
 */
export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void // Specify a more specific function type
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Specify event types here
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      callback(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, callback])
}
