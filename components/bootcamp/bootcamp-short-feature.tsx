import { HighlightFeature } from '@/types/shared-types'
import { Video } from 'lucide-react'
import DynamicIcon from '@/components/shared/DynamicIcon'
import React from 'react'

const BootcampShortFeature = ({
  highlightedFeatures,
}: {
  highlightedFeatures: HighlightFeature[]
}) => {
  // Use provided data or fallback to defaults
  const features = highlightedFeatures?.length > 0 ? highlightedFeatures : []

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
