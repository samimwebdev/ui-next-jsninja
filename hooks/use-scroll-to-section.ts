// hooks/use-scroll-to-section.ts
import { useCallback } from 'react'

export const useScrollToSection = () => {
  const scrollToSection = useCallback((sectionId: string, offset = 0) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }, [])

  return { scrollToSection }
}
