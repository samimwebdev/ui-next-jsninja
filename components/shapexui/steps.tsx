'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { BootcampStepsContentSection } from '@/types/bootcamp-page-types'
import DynamicIcon from '@/components/shared/DynamicIcon'

const Steps: React.FC<{ data: BootcampStepsContentSection }> = ({ data }) => {
  const [expandedStep, setExpandedStep] = useState(1)

  // Create steps array from Strapi data with proper indexing
  const steps = data.stepSection.map((step, index) => ({
    id: index + 1, // Use index + 1 for sequential IDs starting from 1
    title: step.title,
    isCompleted: true, // Keep all as completed for design consistency
    details: step.details,
    icon: step.icon,
  }))

  const totalSteps = steps.length

  return (
    <div className="py-12 max-w-screen-xl flex flex-col md:flex-row  items-center justify-center mx-auto gap-8 ">
      <div className="align-top p-2">
        <h3 className="text-4xl md:text-4xl font-bold tracking-tight mb-4">
          <span className="text-primary">{data.title}</span>
        </h3>
        <p className="text-muted-foreground text-lg">{data.description}</p>
        {data.btn && (
          <Link
            href={data.btn.btnLink || '#'}
            className="inline-flex items-center justify-center px-6 mt-6 py-3 font-sans text-base font-semibold transition-all duration-200 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
            role="button"
          >
            {data.btn.btnLabel}
            {data.btn.btnIcon && (
              <DynamicIcon
                icon={data.btn.btnIcon}
                className="h-5 w-5 ml-2"
                width={20}
                height={20}
              />
            )}
            {!data.btn.btnIcon && (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </motion.svg>
            )}
          </Link>
        )}
      </div>
      <Card className="w-full  mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              {data.secondaryHeading}
            </CardTitle>
            <p className="text-muted-foreground">{data.secondaryDescription}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>Step {expandedStep}</span>
            <span>/</span>
            <span>{totalSteps}</span>
            <div className="flex-1 h-1 bg-muted rounded-full">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(expandedStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'rounded-lg border bg-card transition-colors',
                  expandedStep === step.id && 'bg-muted/50'
                )}
              >
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedStep(step.id)}
                >
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {step.icon?.iconName ? (
                        <DynamicIcon
                          icon={step.icon}
                          className="h-5 w-5 text-primary"
                          width={20}
                          height={20}
                        />
                      ) : (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 font-medium">{step.title}</div>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-muted-foreground/50 transition-transform',
                      expandedStep === step.id && 'rotate-180'
                    )}
                  />
                </div>

                {expandedStep === step.id && step.details && (
                  <div className="px-16 pb-4 space-y-4">
                    <div className="text-muted-foreground">
                      <div
                        dangerouslySetInnerHTML={{ __html: step.details }}
                        className="prose prose-sm max-w-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Steps
