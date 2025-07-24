import { HighlightFeature } from '@/types/shared-types'
import { Video } from 'lucide-react'
import DynamicIcon from '@/components/shared/DynamicIcon'
import React from 'react'

const BootcampShortFeature = ({
  highlightedFeatures,
}: {
  highlightedFeatures: HighlightFeature[]
}) => {
  // Default fallback features if no data provided
  const defaultFeatures: HighlightFeature[] = [
    {
      id: 1,
      title: '400+ Videos',
      icon: {
        iconName: 'mdi:video',
        width: 24,
        height: 24,
        iconData:
          "<path fill='currentColor' d='M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z'/>",
      },
      features: [
        {
          id: 1,
          feature: 'Comprehensive video tutorials covering all aspects',
        },
      ],
    },
    {
      id: 2,
      title: '12+ Projects',
      icon: {
        iconName: 'mdi:folder-multiple',
        width: 24,
        height: 24,
        iconData:
          "<path fill='currentColor' d='M3,6H21V8H3V6M5,10H19V12H5V10M7,14H17V16H7V14Z'/>",
      },
      features: [
        { id: 2, feature: 'Real-world projects to build your portfolio' },
      ],
    },
    {
      id: 3,
      title: '12+ Assignments',
      icon: {
        iconName: 'mdi:file-document',
        width: 24,
        height: 24,
        iconData:
          "<path fill='currentColor' d='M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z'/>",
      },
      features: [
        { id: 3, feature: 'Hands-on assignments to practice your skills' },
      ],
    },
  ]

  // Use provided data or fallback to defaults
  const features =
    highlightedFeatures?.length > 0 ? highlightedFeatures : defaultFeatures

  return (
    <div className="flex flex-col md:flex-row items-center justify-center py-6 gap-4 w-full">
      {features.map((eachFeature, index) => (
        <div
          key={eachFeature.id || index}
          className="flex flex-col border rounded-xl py-6 px-5 w-full md:w-auto flex-1 hover:shadow-lg transition-all duration-300 hover:border-primary/20 hover:-translate-y-1 bg-card/50"
        >
          <div className="mb-4 h-12 w-12 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30 rounded-full shadow-sm">
            {eachFeature.icon ? (
              <DynamicIcon
                icon={eachFeature.icon}
                width={24}
                height={24}
                className="h-6 w-6 text-primary"
              />
            ) : (
              <Video className="h-6 w-6 text-primary" />
            )}
          </div>

          <span className="text-lg font-semibold tracking-tight">
            {eachFeature.title}
          </span>

          <p className="mt-2 text-foreground/70 text-[15px] leading-relaxed">
            {eachFeature.features?.[0]?.feature ||
              'Feature description not available'}
          </p>
        </div>
      ))}
    </div>
  )
}

export default BootcampShortFeature
