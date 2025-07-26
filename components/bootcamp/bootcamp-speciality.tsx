'use client'
import {
  BookOpen,
  ClipboardCheck,
  HeadphonesIcon,
  GraduationCap,
  Briefcase,
} from 'lucide-react'
import { BootcampSpecialityContentSection } from '@/types/bootcamp-page-types'
import { SpecialityClientWrapper } from './bootcamp-speciality-client'

// Default icons mapping for fallback
const getDefaultIcon = (index: number) => {
  const defaultIcons = [
    BookOpen,
    ClipboardCheck,
    HeadphonesIcon,
    GraduationCap,
    Briefcase,
    BookOpen,
  ]
  return defaultIcons[index % defaultIcons.length]
}

// Default colors for visual variety
const getDefaultColor = (index: number) => {
  const colors = ['#16357F', '#53CD99', '#6A177D', '#02a95c', '#5428B8']
  return colors[index % colors.length]
}

export const BootcampSpeciality: React.FC<{
  data: BootcampSpecialityContentSection
}> = ({ data }) => {
  // Transform Strapi data to match component structure - SERVER SIDE
  const sections = data.specialitySection.map((section, index) => ({
    id: section.id,
    title: section.title,
    description: section.details.replace(/<[^>]*>/g, ''), // Strip HTML tags for description
    icon: section.icon ? section.icon : null,
    defaultIconName: getDefaultIcon(index).name, // Store icon name for client
    color: getDefaultColor(index),
  }))

  return (
    <main className="text-foreground bg-background">
      {/* Static header section - SSR */}
      <section className="w-full py-12 md:py-16 lg:py-20 grid place-content-center text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl px-8 mb-6 font-semibold text-center tracking-tight leading-[120%]">
          {data.title}
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
          {data.description}
        </p>
      </section>

      {/* Pass processed data to client component for animations */}
      <SpecialityClientWrapper sections={sections} />
    </main>
  )
}
