'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DynamicIcon from '@/components/shared/DynamicIcon'

import { StepSection } from '@/types/bootcamp-page-types'

export const StepsClient: React.FC<{
  secondaryHeading: string
  secondaryDescription: string
  steps: StepSection[]
}> = ({ secondaryHeading, secondaryDescription, steps }) => {
  const [expandedStep, setExpandedStep] = useState(1)
  const totalSteps = steps.length

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold">
            {secondaryHeading}
          </CardTitle>
          <p className="text-muted-foreground">{secondaryDescription}</p>
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
  )
}
