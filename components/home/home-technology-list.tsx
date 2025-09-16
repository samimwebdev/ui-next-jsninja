import Marquee from '@/components/ui/marquee'
import DynamicIcon from '@/components/shared/DynamicIcon'
import { TechSectionData } from '@/types/home-page-types'

const HomeTechLogos: React.FC<{ data: TechSectionData }> = ({ data }) => {
  return (
    <div className="flex items-center justify-center px-6 py-12">
      <div className="overflow-hidden">
        <p className="text-center text-xl font-medium">{data.title}</p>

        <div className="mt-12 max-w-screen-xl space-y-2">
          <Marquee pauseOnHover className="[--duration:30s]">
            {data.techIconContent.map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className="flex items-center mr-12"
                title={tech.alt}
              >
                <div className="flex items-center">
                  <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                    <DynamicIcon icon={tech.icon} width={34} height={34} />
                  </div>
                  <span className="font-bold text-2xl text-[#23216E] dark:text-[#A0AEC0] whitespace-nowrap">
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
                className="flex items-center mr-12"
                title={tech.alt}
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <DynamicIcon icon={tech.icon} width={34} height={34} />
                  </div>
                  <span className="font-bold text-2xl text-[#23216E] dark:text-[#A0AEC0] whitespace-nowrap">
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
