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

interface FAQItem {
  id?: number
  question: string
  answer: string
}

interface FAQAccordionProps {
  faqItems: FAQItem[]
  limit?: number
  sharedValue?: string
  onValueChange?: (value: string | undefined) => void
  valuePrefix?: string
}

export const FAQ: React.FC<FAQAccordionProps> = ({
  faqItems,
  limit,
  sharedValue,
  onValueChange,
  valuePrefix = 'question',
}) => {
  const [internalValue, setInternalValue] = useState<string>()

  const value = sharedValue !== undefined ? sharedValue : internalValue
  const setValue = onValueChange || setInternalValue

  const itemsToShow = limit ? faqItems.slice(0, limit) : faqItems

  if (!faqItems.length) {
    return null
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={value}
      onValueChange={setValue}
    >
      {itemsToShow.map((faqItem, index) => (
        <AccordionItem
          key={faqItem.id || index}
          value={`${valuePrefix}-${index}`}
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
  )
}
