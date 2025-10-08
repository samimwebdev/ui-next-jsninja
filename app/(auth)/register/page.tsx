import SignUpForm from '@/components/shapexui/signup-form'
import Image from 'next/image'

export default function SignUp() {
  return (
    <>
      {/* Hero */}
      <div className="relative min-h-screen bg-gradient-to-bl from-slate-50 via-slate-100 to-slate-200 dark:from-background dark:via-muted dark:to-card">
        {/* ✅ Enhanced overlays with better contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-ninja-gold/20 via-ninja-orange/10 to-ninja-gold/15 dark:from-ninja-gold/10 dark:via-transparent dark:to-ninja-orange/10" />

        {/* ✅ Additional texture overlay for light mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-transparent to-slate-900/10 dark:from-transparent dark:to-transparent" />

        <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-12 max-w-screen-xl mx-auto">
          {/* Grid */}
          <div className="grid items-center md:grid-cols-2 gap-8 lg:gap-12 min-h-[calc(100vh-6rem)]">
            <div className="relative">
              {/* ✅ Enhanced background for text readability */}
              <div className="absolute inset-0 -m-8 bg-gradient-to-r from-white/80 via-white/60 to-transparent dark:from-background/80 dark:via-background/60 dark:to-transparent backdrop-blur-sm rounded-3xl" />

              <div className="relative z-10">
                {/* <p className="inline-block text-sm font-medium bg-ninja-gold text-slate-900 dark:text-ninja-gold dark:text-gradient-ninja bg-ninja-gold/10 dark:bg-transparent px-3 py-1 rounded-full">
                  A vision for 2026
                </p> */}

                {/* Title */}
                <div className="mt-4 md:mb-12 max-w-2xl">
                  <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-foreground">
                    Unlock your potential with{' '}
                    <span className="text-gradient-ninja">
                      Javascript Ninja
                    </span>
                  </h1>
                  <p className="text-xl text-slate-700 dark:text-muted-foreground font-medium">
                    Experience limitless possibilities with our up to date
                    coding courses.
                  </p>
                </div>
                {/* End Title */}

                {/* Blockquote */}
                <blockquote className="hidden md:block relative max-w-screen-sm bg-white/70 dark:bg-card/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 dark:border-border/50 shadow-lg">
                  <svg
                    className="absolute top-0 start-0 transform -translate-x-3 -translate-y-3 h-12 w-12 text-ninja-gold/30 dark:text-ninja-gold/20"
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z"
                      fill="currentColor"
                    />
                  </svg>
                  <div className="relative z-10">
                    <p className="text-lg italic text-slate-800 dark:text-foreground font-medium leading-relaxed">
                      The JavaScript Ninja Bootcamp was an incredibly enriching
                      experience! In just a short time, I gained solid
                      fundamentals and practical insights. The structure was
                      engaging and perfectly paced for deeper learning ahead
                    </p>
                  </div>
                  <footer className="mt-4 pt-4 border-t border-slate-200 dark:border-border/50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-full ring-2 ring-ninja-gold/30"
                          src="https://i.pravatar.cc/64?img=3"
                          alt="Redwan Ahmed"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="grow ms-4">
                        <div className="font-semibold text-slate-900 dark:text-foreground">
                          Redwan Ahmed
                        </div>
                        <div className="text-sm text-slate-600 dark:text-muted-foreground">
                          Javascript Programming Bootcamp | Batch-11
                        </div>
                      </div>
                    </div>
                  </footer>
                </blockquote>
                {/* End Blockquote */}
              </div>
            </div>
            {/* End Col */}

            <div className="relative z-10">
              {/* Form */}
              <SignUpForm />
              {/* End Form */}
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}
        </div>
        {/* End Clients Section */}
      </div>
      {/* End Hero */}
    </>
  )
}
