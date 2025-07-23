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

export const FAQ: React.FC<{ data: FAQContentSection }> = ({ data }) => {
  const [value, setValue] = useState<string>()

  // Use data from API
  const faqItems = data?.faq?.questionAnswer || []
  const title = data?.title || 'Frequently Asked Questions'

  if (!faqItems.length) {
    return (
      <div className="w-full max-w-screen-xl">
        <h2 className="text-3xl md:text-3xl !leading-[1.15] font-bold tracking-tight">
          {title}
        </h2>
        <p className="mt-6 text-muted-foreground">
          No FAQs available at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-xl">
      <h2 className="text-3xl md:text-3xl !leading-[1.15] font-bold tracking-tight">
        {title}
      </h2>

      <div className="mt-6 w-full">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={value}
          onValueChange={setValue}
        >
          {faqItems.slice(0, 5).map((faqItem, index) => (
            <AccordionItem
              key={faqItem.id || index}
              value={`question-${index}`}
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger
                  className={cn(
                    'flex flex-1 items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline [&[data-state=open]>svg]:rotate-45',
                    'text-start text-lg'
                  )}
                >
                  {faqItem.question}
                  <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent>{faqItem.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
