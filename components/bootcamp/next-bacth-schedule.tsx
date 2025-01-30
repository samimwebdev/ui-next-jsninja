'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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

export function BatchSchedule() {
  return (
    <section className="w-full bg-slate-950 text-slate-50 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
          Next Batch Schedule
        </h2>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm p-8 mb-12">
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
                    <h3 className="text-slate-400 text-sm font-medium mb-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-50 font-semibold">{item.date}</p>
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

          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-300"
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </section>
  )
}
