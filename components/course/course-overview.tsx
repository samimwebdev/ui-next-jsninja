import { OverviewFeature } from '@/types/course-page-types'
import { Check } from 'lucide-react'

const overviewSections = [
  {
    title: 'What Will You Learn From This Course?',
    items: [
      'Modern React with Hooks and Context API',
      'Next.js 14 with App Router and Server Components',
      'Responsive UI with Tailwind CSS and Shadcn UI',
      'State Management with Redux Toolkit and Zustand',
    ],
  },
  {
    title: 'Who This Course Is For',
    items: [
      'Beginner to Intermediate Web Developers',
      'UI/UX Designers Looking to Code Their Designs',
      'Backend Developers Wanting to Learn Frontend',
    ],
  },
  {
    title: 'Prerequisites For This Course',
    items: [
      'Basic HTML, CSS, and JavaScript Knowledge',
      'Familiarity with ES6+ Syntax',
      'Development Environment (VS Code recommended)',
    ],
  },
  {
    title: 'Benefits You Will Receive',
    items: [
      'Personal Code Reviews from Expert Instructors',
      'Access to Private Discord Community',
      'Real-world Project Portfolio',
      'Job Placement Assistance',
    ],
  },
]

export const Overview: React.FC<{ data: OverviewFeature[] }> = ({ data }) => {
  return (
    <section id="overview" className="my-12">
      <div className="grid gap-8 md:grid-cols-2">
        {overviewSections.map((section, index) => (
          <div key={index} className="bg-card rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            <ul className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#E91E63] mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
