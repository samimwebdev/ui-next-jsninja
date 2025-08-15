import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  CourseQuizQuestion,
  CourseQuizSubmissionResponse,
} from '@/types/course-quiz-types'
import { Award, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { getOptionTextsByIds, getQuizStatusMessage } from '@/lib/utils'

interface CourseQuizResultsProps {
  isSubmitting: boolean
  submissionError: string | null
  submissionResults: CourseQuizSubmissionResponse | null
  questions: CourseQuizQuestion[]
  getSelectedOptionTexts: (questionIndex: number) => string[]
  onCloseQuiz: () => void
}

export default function CourseQuizResults({
  isSubmitting,
  submissionError,
  submissionResults,
  questions,
  getSelectedOptionTexts,
  onCloseQuiz,
}: CourseQuizResultsProps) {
  return (
    <>
      <CardHeader className="pb-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            {isSubmitting ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <Award className="h-8 w-8 text-primary" />
            )}
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-center text-primary">
          {isSubmitting ? 'Processing...' : 'Quiz Results'}
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[60vh] overflow-y-auto">
        {isSubmitting ? (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">
              Calculating your results...
            </p>
          </div>
        ) : submissionError ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Submission Error</p>
              <p className="text-sm">{submissionError}</p>
            </div>
            <p className="text-muted-foreground">
              Unable to calculate results. Please try again.
            </p>
          </div>
        ) : submissionResults ? (
          <>
            <div className="text-center space-y-4 mb-6">
              <p className="text-5xl font-bold mb-4">
                {submissionResults.score} / {submissionResults.totalScore}
              </p>
              <div className="relative pt-4">
                <Progress
                  value={submissionResults.percentage}
                  className="w-full h-4 rounded-full"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  {getQuizStatusMessage(
                    submissionResults.passed,
                    submissionResults.percentage
                  )}
                </p>
              </div>
            </div>

            {/* Question Results */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">
                Question Breakdown
              </h3>
              {questions.map((question, index) => {
                // Get selected option texts for display
                const selectedOptionTexts = getSelectedOptionTexts(index)

                const serverResult = submissionResults.answers.find(
                  (a) => a.questionId === question.documentId
                )

                // Get correct answers using utility function
                const correctAnswerTexts = serverResult?.correctAnswers
                  ? getOptionTextsByIds(question, serverResult.correctAnswers)
                  : []

                return (
                  <div
                    key={question.documentId || question.id}
                    className={`p-5 rounded-lg border-2 ${
                      serverResult?.correct
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 mt-1">
                        {serverResult?.correct ? (
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-lg text-foreground">
                            Question {index + 1}: {question.title}
                          </h4>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              serverResult?.correct
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            }`}
                          >
                            {serverResult?.correct ? 'Correct' : 'Incorrect'}
                          </div>
                        </div>

                        {/* Question Text */}
                        {question.text && (
                          <div
                            className="mt-2 text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: question.text }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Answer Section */}
                    <div className="ml-9 space-y-3">
                      {/* Your Answer */}
                      <div className="p-3 rounded-lg bg-background/50 border">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            Your Answer:
                          </span>
                        </div>
                        <div className="text-sm">
                          {selectedOptionTexts.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                              {selectedOptionTexts.map((text, idx) => (
                                <li key={idx} className="text-foreground">
                                  {text}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-muted-foreground italic">
                              No answer provided
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Correct Answer */}
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="font-medium text-green-700 dark:text-green-300">
                            Correct Answer:
                          </span>
                        </div>
                        <div className="text-sm">
                          {correctAnswerTexts.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                              {correctAnswerTexts.map((text, idx) => (
                                <li
                                  key={idx}
                                  className="text-green-700 dark:text-green-300"
                                >
                                  {text}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-muted-foreground italic">
                              No correct answer available
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Explanation */}
                      {serverResult?.explanation && (
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium text-blue-700 dark:text-blue-300">
                              Explanation:
                            </span>
                          </div>
                          <div
                            className="text-sm text-blue-700 dark:text-blue-300 prose prose-sm max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{
                              __html: serverResult.explanation,
                            }}
                          />
                        </div>
                      )}

                      {/* Points */}
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>
                          Points Earned:{' '}
                          <span className="font-medium text-foreground">
                            {serverResult?.points ?? 0}
                          </span>
                        </span>
                        <span>
                          Total Points:{' '}
                          <span className="font-medium text-foreground">
                            {question.points}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">
              No results available.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-center pt-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button
          onClick={onCloseQuiz}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 px-8 rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Close Quiz'}
        </Button>
      </CardFooter>
    </>
  )
}
