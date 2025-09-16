'use client'

import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { TechnologyLayoutContentSection } from '@/types/bootcamp-page-types'
import DynamicIcon from '@/components/shared/DynamicIcon'

export const BootcampLogoSlider: React.FC<{
  data: TechnologyLayoutContentSection
}> = ({ data }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0)
        api.scrollTo(0)
      } else {
        api.scrollNext()
        setCurrent(current + 1)
      }
    }, 1000)
  }, [api, current])

  return (
    <div className="w-full max-w-screen-xl mx-auto py-12 lg:py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-5 gap-10 items-center">
          <h3 className="text-xl tracking-tighter lg:max-w-xl font-regular text-left">
            {data.title}
          </h3>
          <div className="relative w-full col-span-4">
            <div className="bg-gradient-to-r from-background via-transparent to-background z-10 absolute left-0 top-0 right-0 bottom-0 w-full h-full"></div>
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {data.techIconContent.map((tech, index) => (
                  <CarouselItem className="basis-1/4 lg:basis-1/6" key={index}>
                    <div className="flex flex-col rounded-md aspect-square bg-card items-center justify-center p-3 hover:shadow-md transition-all duration-300">
                      <div className="relative w-12 h-12 mb-2 flex items-center justify-center">
                        {/* <p>{getIconColor(tech.icon?.iconName)}</p> */}
                        {tech.icon ? (
                          <DynamicIcon
                            icon={tech.icon}
                            style={{ color: tech.btnColor }}
                            width={48}
                            height={48}
                          />
                        ) : null}
                      </div>
                      <span className="text-xs text-center font-medium text-foreground">
                        {tech.name}
                      </span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  )
}
