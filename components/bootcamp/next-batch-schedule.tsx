'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BatchScheduleContentSection } from '@/types/bootcamp-page-types'
import { ClipboardList, Users, School, CalendarCheck } from 'lucide-react'

interface ScheduleItem {
  icon: React.ElementType
  title: string
  date: string
  color: string
}

const scheduleItems: ScheduleItem[] = [
  {
    icon: ClipboardList,
    title: 'Enrollment Starts',
    date: '10 June, 2025',
    color: 'purple',
  },
  {
    icon: CalendarCheck,
    title: 'Enrollment Ends',
    date: '24 June, 2025',
    color: 'orange',
  },
  {
    icon: Users,
    title: 'Orientation Starts',
    date: '28 June, 2025',
    color: 'emerald',
  },
  {
    icon: School,
    title: 'Class Starts',
    date: '30 June, 2025',
    color: 'emerald',
  },
]

export const BatchSchedule: React.FC<{ data: BatchScheduleContentSection }> = ({
  data,
}) => {
  return (
    <section className="w-full px-4 py-12">
      <div className="container mx-auto max-w-screen-xl">
        <h2 className="text-4xl mb-12 text-center font-black leading-tight tracking-tight ">
          Next Batch Schedule
        </h2>

        <Card className="backdrop-blur-sm p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {scheduleItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-start gap-4 group">
                  <div
                    className={`p-3 rounded-xl bg-${item.color}-500/10 group-hover:bg-${item.color}-500/20 transition-colors`}
                  >
                    <Icon className={`w-6 h-6 text-${item.color}-500`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                    <p className="font-semibold">{item.date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-slate-400 text-lg">
            If You Are Interested To{' '}
            <span className="text-orange-400 font-medium">
              Enroll In 12th Batch
            </span>
            , Register On The Website
          </p>

          <Button size="lg" className="rounded-full text-base ">
            Register Now
          </Button>
        </div>
      </div>
    </section>
  )
}
