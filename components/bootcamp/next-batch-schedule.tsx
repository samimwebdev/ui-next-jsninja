import { Card } from '@/components/ui/card'
import { BatchScheduleContentSection } from '@/types/bootcamp-page-types'
import DynamicIcon from '@/components/shared/DynamicIcon'
import { formatDate } from '@/lib/bootcamp-utils'
import { BatchScheduleClient } from './next-batch-schedule-client'

export const BatchSchedule: React.FC<{ data: BatchScheduleContentSection }> = ({
  data,
}) => {
  // Process schedule items on server - SSR
  const scheduleItems = [
    {
      icon: data.enrollStartBtn,
      title: 'Enrollment Starts',
      date: formatDate(data.enrollmentStart),
      color: 'purple',
    },
    {
      icon: data.enrollEndBtn,
      title: 'Enrollment Ends',
      date: formatDate(data.enrollmentEnd),
      color: 'orange',
    },
    {
      icon: data.orientationStartBtn,
      title: 'Orientation Starts',
      date: formatDate(data.orientationStart),
      color: 'emerald',
    },
    {
      icon: data.classStartBtn,
      title: 'Class Starts',
      date: formatDate(data.classStart),
      color: 'emerald',
    },
  ]

  return (
    <section className="w-full px-4 py-12">
      <div className="container mx-auto max-w-screen-xl">
        <h2 className="text-4xl mb-12 text-center font-black leading-tight tracking-tight">
          {data.title}
        </h2>

        <Card className="backdrop-blur-sm p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {scheduleItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div
                  className={`p-3 rounded-xl bg-${item.color}-500/10 group-hover:bg-${item.color}-500/20 transition-colors`}
                >
                  {item.icon && (
                    <DynamicIcon
                      icon={item.icon}
                      className={`w-6 h-6 text-${item.color}-500`}
                      width={24}
                      height={24}
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                  <p className="font-semibold">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-slate-400 text-lg">
            If You Are Interested To{' '}
            <span className="text-orange-400 font-medium">
              Enroll In {data.batchNumber}th Batch
            </span>
            , Register On The Website
          </p>

          {/* Client component for button interactions */}
          <BatchScheduleClient buttonData={data.nextBatchScheduleBtn} />
        </div>
      </div>
    </section>
  )
}
