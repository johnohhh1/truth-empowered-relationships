'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'

interface AssessmentQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface AssessmentProps {
  sectionId: string
  sectionTitle: string
  questions: AssessmentQuestion[]
  onComplete: (score: number, passed: boolean) => void
  passingScore?: number // Default 80%
}

export default function Assessment({
  sectionId,
  sectionTitle,
  questions,
  onComplete,
  passingScore = 80
}: AssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const hasAnswered = selectedAnswers[currentQuestion.id] !== undefined

  const handleSelectAnswer = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answerIndex
    })
  }

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Calculate score
    let correct = 0
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++
      }
    })

    const scorePercentage = Math.round((correct / questions.length) * 100)
    const passed = scorePercentage >= passingScore

    // Show results
    setShowResults(true)
    setIsSubmitting(false)

    // Callback to parent
    onComplete(scorePercentage, passed)
  }

  const handleRetry = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
  }

  if (showResults) {
    const correct = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length
    const scorePercentage = Math.round((correct / questions.length) * 100)
    const passed = scorePercentage >= passingScore

    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center mb-6">
            {passed ? (
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            ) : (
              <XCircle size={64} className="mx-auto text-orange-500 mb-4" />
            )}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {passed ? 'Well Done!' : 'Keep Exploring'}
            </h2>
            <p className="text-gray-600">
              You scored {scorePercentage}% ({correct} out of {questions.length} correct)
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {passed
                ? `You've passed! You can move forward when your partner is ready.`
                : `You need ${passingScore}% to pass. Review the material and try again.`
              }
            </p>
          </div>

          {/* Question Review */}
          <div className="space-y-4 mb-6">
            {questions.map((q, index) => {
              const userAnswer = selectedAnswers[q.id]
              const isCorrect = userAnswer === q.correctAnswer

              return (
                <div key={q.id} className={`border-l-4 pl-4 ${isCorrect ? 'border-green-500' : 'border-orange-500'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle size={20} className="text-green-500 mt-0.5" />
                    ) : (
                      <XCircle size={20} className="text-orange-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{index + 1}. {q.question}</p>
                      {!isCorrect && (
                        <>
                          <p className="text-sm text-orange-600">Your answer: {q.options[userAnswer]}</p>
                          <p className="text-sm text-green-600">Correct: {q.options[q.correctAnswer]}</p>
                          <p className="text-sm text-gray-600 mt-1 italic">{q.explanation}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {!passed && (
            <button
              onClick={handleRetry}
              className="w-full btn-primary flex items-center justify-center"
            >
              <RotateCcw size={20} className="mr-2" />
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{sectionTitle} - Assessment</h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <div className="flex gap-1">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentQuestionIndex
                      ? 'bg-ter-blue'
                      : selectedAnswers[questions[index].id] !== undefined
                      ? 'bg-ter-olive'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion.id] === index
                    ? 'border-ter-blue bg-ter-blue/10'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                    selectedAnswers[currentQuestion.id] === index
                      ? 'border-ter-blue bg-ter-blue'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion.id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={handleNext}
          disabled={!hasAnswered || isSubmitting}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            'Submitting...'
          ) : isLastQuestion ? (
            <>
              Submit Assessment
              <CheckCircle size={20} className="ml-2" />
            </>
          ) : (
            <>
              Next Question
              <ArrowRight size={20} className="ml-2" />
            </>
          )}
        </button>

        {/* Gentle reminder */}
        <p className="text-center text-sm text-gray-500 mt-4">
          This is a gentle check-in to ensure understanding. Take your time.
        </p>
      </div>
    </div>
  )
}
