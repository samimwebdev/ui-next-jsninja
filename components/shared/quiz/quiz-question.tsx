import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Timer, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { AssessmentQuestion } from '@/types/bootcamp-page-types'

interface QuizQuestionProps {
  questions: AssessmentQuestion[]
  currentQuestion: number
  answers: string[][]
  timeLeft: number
  isSubmitting: boolean
  onAnswer: (optionId: string) => void
  onPrevious: () => void
  onNext: () => void
}

export default function QuizQuestion({
  questions,
  currentQuestion,
  answers,
  timeLeft,
  isSubmitting,
  onAnswer,
  onPrevious,
  onNext,
}: QuizQuestionProps) {
  return (
    <>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Question {currentQuestion + 1} of {questions.length}
        </CardTitle>
        <div className="flex flex-col space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <Progress
            value={((currentQuestion + 1) / questions.length) * 100}
            className="w-full h-2 rounded-full"
          />
          <div className="flex items-center justify-end mt-1 text-amber-600 dark:text-amber-400">
            <Timer className="mr-2 h-4 w-4" />
            <span className="font-medium">{timeLeft}s remaining</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 py-4">
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
          <p className="text-xl font-semibold">
            {questions[currentQuestion]?.title}
          </p>
          {questions[currentQuestion]?.text && (
            <div
              className="mt-2 text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: questions[currentQuestion].text,
              }}
            />
          )}
        </div>

        {questions[currentQuestion]?.questionType === 'singleChoice' ? (
          <RadioGroup
            value={answers[currentQuestion]?.[0] || ''}
            onValueChange={(value) => onAnswer(value)}
            className="space-y-3"
          >
            {questions[currentQuestion]?.options?.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                onClick={() => onAnswer(option.id)}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label
                  htmlFor={option.id}
                  className="flex-grow cursor-pointer font-medium"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            {questions[currentQuestion]?.options?.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  answers[currentQuestion]?.includes(option.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                } hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer`}
                onClick={() => onAnswer(option.id)}
              >
                <Checkbox
                  checked={answers[currentQuestion]?.includes(option.id)}
                  onCheckedChange={() => onAnswer(option.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label className="flex-grow cursor-pointer font-medium">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between p-4 border-t">
        <Button
          onClick={onPrevious}
          variant="outline"
          disabled={currentQuestion === 0}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          className="flex items-center gap-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : currentQuestion === questions.length - 1 ? (
            'Finish Quiz'
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </>
  )
}
