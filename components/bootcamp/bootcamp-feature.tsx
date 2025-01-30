import {
  BookOpenIcon,
  MessagesSquareIcon,
  Settings2Icon,
  SettingsIcon,
  TabletSmartphoneIcon,
} from 'lucide-react'

export function BootcampFeatureSection() {
  return (
    <div className="flex items-center justify-center py-12">
      <div>
        <h2 className="text-4xl md:text-4xl font-black tracking-tight text-center">
          Feature of Our Courses
        </h2>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto px-6">
          {/* Icon Block */}
          <div className="group flex flex-col justify-center hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 ">
            <div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
              <TabletSmartphoneIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-semibold">Responsive</h3>
              <p className="mt-1 text-muted-foreground">
                Responsive, and mobile-first project on the web
              </p>
            </div>
          </div>
          {/* End Icon Block */}
          {/* Icon Block */}
          <div className="group flex flex-col justify-center hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 ">
            <div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
              <MessagesSquareIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-semibold">Responsive</h3>
              <p className="mt-1 text-muted-foreground">
                Responsive, and mobile-first project on the web
              </p>
            </div>
          </div>
          {/* End Icon Block */}
          {/* Icon Block */}
          <div className="group flex flex-col justify-center hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 ">
            <div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
              <BookOpenIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-semibold">Responsive</h3>
              <p className="mt-1 text-muted-foreground">
                Responsive, and mobile-first project on the web
              </p>
            </div>
          </div>
          {/* End Icon Block */}
          {/* Icon Block */}
          <div className="group flex flex-col justify-center hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 ">
            <div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
              <SettingsIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-semibold">Responsive</h3>
              <p className="mt-1 text-muted-foreground">
                Responsive, and mobile-first project on the web
              </p>
            </div>
          </div>
          <div className="group flex flex-col justify-center hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 ">
            <div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
              <Settings2Icon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-semibold">Responsive</h3>
              <p className="mt-1 text-muted-foreground">
                Responsive, and mobile-first project on the web
              </p>
            </div>
          </div>
          <div className="group flex flex-col justify-center hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 ">
            <div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
              <TabletSmartphoneIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-semibold">Responsive</h3>
              <p className="mt-1 text-muted-foreground">
                Responsive, and mobile-first project on the web
              </p>
            </div>
          </div>
          {/* End Icon Block */}

          {/* End Icon Blocks */}
        </div>
      </div>
    </div>
  )
}
