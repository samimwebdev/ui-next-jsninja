import Marquee from '@/components/ui/marquee'
import DynamicIcon from '@/components/shared/DynamicIcon'
import { TechSectionData } from '@/types/home-page-types'

const HomeTechLogos: React.FC<{ data: TechSectionData }> = ({ data }) => {
  return (
    <div className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 w-full">
      <div className="overflow-hidden w-full">
        <p className="text-center text-lg sm:text-xl font-medium px-4">
          {data.title}
        </p>

        <div className="mt-8 sm:mt-12 max-w-screen-xl space-y-2">
          <Marquee pauseOnHover className="[--duration:30s]">
            {data.techIconContent.map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className="flex items-center mr-8 sm:mr-12"
                title={tech.alt}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center flex-shrink-0">
                    <DynamicIcon icon={tech.icon} width={34} height={34} />
                  </div>
                  <span className="font-bold text-xl sm:text-2xl text-[#23216E] dark:text-[#A0AEC0] whitespace-nowrap">
                    {tech.name}
                  </span>
                </div>
              </div>
            ))}
          </Marquee>
          <Marquee pauseOnHover reverse className="[--duration:30s]">
            {data.techIconContent.map((tech, index) => (
              <div
                key={`reverse-${tech.name}-${index}`}
                className="flex items-center mr-8 sm:mr-12"
                title={tech.alt}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center flex-shrink-0">
                    <DynamicIcon icon={tech.icon} width={34} height={34} />
                  </div>
                  <span className="font-bold text-xl sm:text-2xl text-[#23216E] dark:text-[#A0AEC0] whitespace-nowrap">
                    {tech.name}
                  </span>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  )
}

export default HomeTechLogos
