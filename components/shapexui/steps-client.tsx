'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import DynamicIcon from '@/components/shared/DynamicIcon'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StrapiIcon } from '@/types/shared-types'

interface Step {
  id: number
  title: string
  isCompleted: boolean
  details: string
  icon: StrapiIcon | null
}

interface StepsClientProps {
  secondaryHeading: string
  secondaryDescription: string
  steps: Step[]
}

export const StepsClient: React.FC<StepsClientProps> = ({
  secondaryHeading,
  secondaryDescription,
  steps,
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const progress = ((currentStep + 1) / steps.length) * 100

  const toggleStepDetails = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  return (
    <Card className="w-full max-w-2xl md:w-auto bg-card rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-border/50 backdrop-blur-sm">
      {/* Header - More breathing room */}
      <div className="mb-5 sm:mb-6 lg:mb-8">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 text-foreground leading-tight">
          {secondaryHeading}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {secondaryDescription}
        </p>
      </div>

      {/* Progress Indicator - Improved spacing */}
      <div className="mb-5 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
            Step {currentStep + 1} / {steps.length}
          </span>
          <Badge variant="secondary" className="text-xs sm:text-sm px-2 py-0.5">
            {Math.round(progress)}%
          </Badge>
        </div>
        <Progress value={progress} className="h-2 sm:h-2.5" />
      </div>

      {/* Steps List - Better card spacing */}
      <div className="space-y-3 sm:space-y-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isExpanded = expandedStep === step.id

          return (
            <div
              key={step.id}
              className={cn(
                'rounded-lg border transition-all duration-300',
                isActive
                  ? 'bg-primary/5 dark:bg-primary/10 border-primary/30 shadow-md'
                  : 'bg-muted/30 dark:bg-muted/20 border-border/50 hover:border-border'
              )}
            >
              {/* Step Header - Improved padding and layout */}
              <button
                onClick={() => {
                  setCurrentStep(index)
                  toggleStepDetails(step.id)
                }}
                className="w-full p-3 sm:p-4 flex items-start gap-3 sm:gap-4 text-left group"
              >
                {/* Icon - Better sizing */}
                <div
                  className={cn(
                    'flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : step.isCompleted
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                      : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20'
                  )}
                >
                  {step.isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : step.icon ? (
                    <DynamicIcon
                      icon={step.icon}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold">
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Title - Better typography */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4
                    className={cn(
                      'font-semibold text-sm sm:text-base lg:text-lg leading-snug mb-1 transition-colors',
                      isActive
                        ? 'text-primary'
                        : 'text-foreground group-hover:text-primary'
                    )}
                  >
                    {step.title}
                  </h4>

                  {/* Mobile preview text */}
                  {!isExpanded && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 leading-relaxed">
                      {step.details.replace(/<[^>]*>/g, '').substring(0, 60)}...
                    </p>
                  )}
                </div>

                {/* Chevron - Better visibility */}
                <div className="flex-shrink-0 pt-1">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expandable Details - Better content spacing */}
              {isExpanded && (
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                  <div className="pl-10 sm:pl-12 pr-2 border-l-2 border-primary/20 ml-3.5 sm:ml-4">
                    <div
                      className="prose prose-sm sm:prose-base dark:prose-invert max-w-none
                        [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-3 sm:[&_p]:mb-4
                        [&_ul]:ml-4 sm:[&_ul]:ml-6 [&_ul]:space-y-2 sm:[&_ul]:space-y-2.5 [&_ul]:list-disc
                        [&_ul]:text-muted-foreground [&_ul]:text-sm sm:[&_ul]:text-base
                        [&_li]:leading-relaxed [&_li]:pl-1
                        [&_strong]:text-foreground [&_strong]:font-semibold
                        text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: step.details }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation Buttons - Better touch targets */}
      <div className="flex gap-3 sm:gap-4 mt-5 sm:mt-6 lg:mt-8">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className={cn(
            'flex-1 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200',
            currentStep === 0
              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              : 'bg-muted hover:bg-muted/80 text-foreground hover:shadow-md active:scale-95'
          )}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
          }
          disabled={currentStep === steps.length - 1}
          className={cn(
            'flex-1 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200',
            currentStep === steps.length - 1
              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-md active:scale-95'
          )}
        >
          {currentStep === steps.length - 1 ? 'Completed' : 'Next'}
        </button>
      </div>
    </Card>
  )
}
