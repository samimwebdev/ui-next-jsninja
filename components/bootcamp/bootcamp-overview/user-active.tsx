import { useEffect, type RefObject } from 'react'

export function useActiveSection(
  contentRef: RefObject<HTMLDivElement>,
  sections: string[],
  setActiveSection: (section: string) => void
) {
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const sectionElements = sections.map((id) => ({
        id,
        element: document.getElementById(id),
      }))

      const scrollPosition = window.scrollY + 100 // Add offset for header

      let newActiveSection = sections[0]

      for (const { id, element } of sectionElements) {
        if (!element) continue
        const elementTop = element.offsetTop
        if (scrollPosition >= elementTop) {
          newActiveSection = id
        }
      }

      setActiveSection(newActiveSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Call once to set initial active section
    return () => window.removeEventListener('scroll', handleScroll)
  }, [contentRef, sections, setActiveSection])
}
