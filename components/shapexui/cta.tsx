import React from 'react'
import { CallToActionContentSection } from '@/types/bootcamp-page-types'
import { CTAClientWrapper } from './cta-client'
import { CourseType } from '@/types/checkout-types'

export interface CourseInfoType {
  title: string
  slug: string
  price: number
  courseType: CourseType
  isRegistrationOpen: boolean
  isEnrolled: boolean
}

const CallToAction: React.FC<{
  data: CallToActionContentSection
  courseInfo: CourseInfoType
}> = ({ data, courseInfo }) => {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-40 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='30' cy='10' r='1'/%3E%3Ccircle cx='10' cy='30' r='1'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:via-transparent dark:to-accent/10"></div>

      {/* Optional floating elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/5 dark:bg-accent/10 rounded-full blur-2xl"></div>

      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Pass all data to client wrapper to maintain exact animations */}
        <CTAClientWrapper
          data={data}
          courseInfo={courseInfo}
          isRegistrationOpen={courseInfo.isRegistrationOpen}
        />
      </div>
    </section>
  )
}

export default CallToAction
