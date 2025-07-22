'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { FAQContentSection } from '@/types/course-page-types'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

const faq = [
  {
    question: 'What prerequisites do I need for this frontend course?',
    answer:
      'Basic knowledge of HTML, CSS, and JavaScript is recommended. However, we have introductory modules for complete beginners to help you get started with the fundamentals.',
  },
  {
    question: 'How long do I have access to the course materials?',
    answer:
      'You get lifetime access to all course materials, including future updates. Once enrolled, you can learn at your own pace and revisit lessons whenever needed.',
  },
  {
    question: 'Is there a certificate upon completion?',
    answer:
      'Yes, youll receive a certificate of completion after finishing all course modules and projects. This certificate can be added to your portfolio and LinkedIn profile.',
  },
  {
    question: 'What kind of support will I receive during the course?',
    answer:
      'Youll have access to our community forum where instructors and fellow students can help with questions. Premium enrollments include 3 months of direct 1:1 support with our instructors.',
  },
  {
    question: 'Are the projects in this course suitable for my portfolio?',
    answer:
      'Absolutely! The course includes 5 real-world projects designed to showcase different frontend skills. These projects are perfect for demonstrating your abilities to potential employers.',
  },
  {
    question: 'How often is the course content updated?',
    answer:
      'We update the course quarterly to ensure all content reflects current frontend development best practices and the latest framework versions.',
  },
  {
    question: 'Can I get a refund if the course isnt right for me?',
    answer:
      'Yes, we offer a 30-day money-back guarantee. If youre not satisfied with the course, contact our support team within 30 days of purchase for a full refund.',
  },
  {
    question: 'Will this course help me get a job as a frontend developer?',
    answer:
      'Many of our graduates have successfully landed frontend developer roles. The course focuses on practical skills, modern frameworks, and portfolio-building projects that employers value.',
  },
  {
    question: 'Do you offer any discounts for students or groups?',
    answer:
      'Yes, we offer special discounts for students with valid ID and for groups of 5 or more. Contact our sales team for details on group enrollment discounts.',
  },
  {
    question: 'What makes this frontend course different from others?',
    answer:
      'Our course combines theory with extensive hands-on practice, focuses on the latest frontend technologies (React, Vue, and more), and includes mentorship from industry professionals currently working at top tech companies.',
  },
]
export const FAQ: React.FC<{ data: FAQContentSection }> = ({ data }) => {
  const [value, setValue] = useState<string>()

  return (
    <div className="w-full max-w-screen-xl">
      <h2 className="text-3xl md:text-3xl !leading-[1.15] font-bold tracking-tight">
        Frequently Asked Questions
      </h2>

      <div className="mt-6 w-full">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={value}
          onValueChange={setValue}
        >
          {faq.slice(0, 5).map(({ question, answer }, index) => (
            <AccordionItem key={question} value={`question-${index}`}>
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger
                  className={cn(
                    'flex flex-1 items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline [&[data-state=open]>svg]:rotate-45',
                    'text-start text-lg'
                  )}
                >
                  {question}
                  <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
