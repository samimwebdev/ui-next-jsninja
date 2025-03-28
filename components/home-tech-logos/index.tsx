import {
  Logo01,
  Logo02,
  Logo03,
  Logo04,
  Logo05,
  Logo06,
  Logo07,
  Logo08,
} from '@/components/home-tech-logos/logos'
import Marquee from '@/components/ui/marquee'

const HomeTechLogos = () => {
  return (
    <div className="flex items-center justify-center px-6 py-12">
      <div className="overflow-hidden">
        <h2 className="text-4xl font-bold text-center mb-4">Technology Stack</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Master the most in-demand technologies used by leading companies worldwide
        </p>

        <div className="mt-12 max-w-screen-xl space-y-8">
          <Marquee pauseOnHover className="[--duration:30s] [&_svg]:mr-10">
            <Logo01 />
            <Logo02 />
            <Logo03 />
            <Logo04 />
            <Logo05 />
            <Logo06 />
            <Logo07 />
            <Logo08 />
          </Marquee>
          <Marquee
            pauseOnHover
            reverse
            className="[--duration:30s] [&_svg]:mr-10"
          >
            <Logo01 />
            <Logo02 />
            <Logo03 />
            <Logo04 />
            <Logo05 />
            <Logo06 />
            <Logo07 />
            <Logo08 />
          </Marquee>
        </div>
      </div>
    </div>
  )
}

export default HomeTechLogos
