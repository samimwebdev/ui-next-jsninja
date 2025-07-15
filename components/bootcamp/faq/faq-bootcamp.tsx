'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

const faq = [
  {
    question: 'What is the duration of the JavaScript Bootcamp?',
    answer:
      'The bootcamp runs for 12 weeks, featuring daily lectures, coding assignments, and hands-on projects to help you master JavaScript and modern frontend development.',
  },
  {
    question: 'Do I need prior programming experience to join?',
    answer:
      'No prior experience is required. The bootcamp starts from the basics and gradually progresses to advanced topics, making it suitable for both beginners and those looking to upskill.',
  },
  {
    question: 'Which technologies will I learn in this bootcamp?',
    answer:
      'You will learn HTML, CSS, JavaScript, React, Next.js, TypeScript, and other essential frontend tools and frameworks used in the industry.',
  },
  {
    question: 'Will I receive a certificate after completing the bootcamp?',
    answer:
      'Yes, you will receive a certificate of completion and a portfolio of real-world projects to showcase your skills to potential employers.',
  },
  {
    question: 'What kind of support is available during the bootcamp?',
    answer:
      'You will have access to 24/7 support from instructors and mentors, as well as a community of fellow learners for collaboration and networking.',
  },
  {
    question: 'Are there job placement opportunities after graduation?',
    answer:
      'Yes, we offer career guidance, interview preparation, and connect you with hiring partners for job placement opportunities after graduation.',
  },
  {
    question: 'Can I access course materials after the bootcamp ends?',
    answer:
      'Absolutely! All course materials, recorded lectures, and resources remain accessible to you even after the bootcamp concludes.',
  },
  {
    question: 'How are the classes conducted?',
    answer:
      'Classes are conducted online via live sessions, with interactive Q&A, group projects, and recorded videos for flexible learning.',
  },
  {
    question: 'Is there a refund policy?',
    answer:
      'Yes, you can request a full refund within the first week if you are not satisfied with the bootcamp experience.',
  },
  {
    question: 'How do I enroll in the bootcamp?',
    answer:
      "Click the 'Enroll Now' button on the bootcamp page and follow the instructions to complete your registration and payment.",
  },
]
const FAQBootcamp = () => {
  const [value, setValue] = useState<string>()

  return (
    <div className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-screen-xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-4xl text-center !leading-[1.15] font-bold tracking-tight">
            - Frequently Asked Questions + JavaScript Bootcamp FAQs
          </h2>
          <p className="text-muted-foreground text-lg">
            - Find answers to common questions about our JavaScript Programming
            - Bootcamp, including curriculum, support, certification, and -
            enrollment details. + Get answers to the most common questions about
            our JavaScript Bootcamp, including curriculum, support,
            certification, and how to enroll.
          </p>
        </div>
        <div className="w-full grid md:grid-cols-2 gap-x-10">
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
                      'flex flex-1 items-center justify-between py-4 font-semibold transition-all hover:underline [&[data-state=open]>svg]:rotate-45',
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

          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={value}
            onValueChange={setValue}
          >
            {faq.slice(5).map(({ question, answer }, index) => (
              <AccordionItem key={question} value={`question-${index + 5}`}>
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
    </div>
  )
}

export default FAQBootcamp
