'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

export type GameLevel = 'beginner' | 'intermediate' | 'advanced'

export interface GameComponentProps {
  title: string
  level: GameLevel
  instructions: string
  onComplete: () => void
}

interface PromptOption {
  id: string
  text: string
  isMatch: boolean
}

interface Prompt {
  id: string
  suitcaseLabel: string
  description: string
  options: PromptOption[]
}

export default function BaggageClaimGame({ title, level, instructions, onComplete }: GameComponentProps) {
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [completed, setCompleted] = useState(false)

  const prompts: Prompt[] = useMemo(() => ([
    {
      id: 'story',
      suitcaseLabel: 'Story I am telling myself',
      description: 'Match the inner narrative with the suitcase label it belongs to.',
      options: [
        { id: 'story-a', text: "If they really cared they would have checked in.", isMatch: true },
        { id: 'story-b', text: "The meeting started at 3pm like the calendar invite said.", isMatch: false },
        { id: 'story-c', text: "The dog barked when the delivery driver knocked.", isMatch: false }
      ]
    },
    {
      id: 'impact',
      suitcaseLabel: 'Impact on me right now',
      description: 'Identify which reflection belongs to this suitcase.',
      options: [
        { id: 'impact-a', text: "My chest tightens and I want to pull away.", isMatch: true },
        { id: 'impact-b', text: "They should already know better than to do that.", isMatch: false },
        { id: 'impact-c', text: "Last year I felt the same way on our anniversary.", isMatch: false }
      ]
    },
    {
      id: 'need',
      suitcaseLabel: 'What I am needing',
      description: 'Choose the need that clears this suitcase.',
      options: [
        { id: 'need-a', text: "To feel chosen and kept in the loop when plans change.", isMatch: true },
        { id: 'need-b', text: "To remind them of the agreement we made months ago.", isMatch: false },
        { id: 'need-c', text: "To point out what happened during our first year together.", isMatch: false }
      ]
    }
  ]), [])

  const handleSelect = useCallback((promptId: string, optionId: string) => {
    setSelections(prev => ({ ...prev, [promptId]: optionId }))
    setShowFeedback(false)
  }, [])

  const handleCheckAnswers = useCallback(() => {
    if (completed) {
      return
    }

    const allAnswered = prompts.every(prompt => selections[prompt.id])
    if (!allAnswered) {
      setShowFeedback(true)
      return
    }

    const allCorrect = prompts.every(prompt => {
      const selectedOptionId = selections[prompt.id]
      const option = prompt.options.find(opt => opt.id === selectedOptionId)
      return option?.isMatch
    })

    setShowFeedback(true)
    if (allCorrect) {
      setCompleted(true)
    }
  }, [completed, prompts, selections])

  useEffect(() => {
    if (completed) {
      onComplete()
    }
  }, [completed, onComplete])

  const correctCount = useMemo(() => {
    return prompts.reduce((count, prompt) => {
      const selectedOptionId = selections[prompt.id]
      if (!selectedOptionId) {
        return count
      }
      const option = prompt.options.find(opt => opt.id === selectedOptionId)
      return option?.isMatch ? count + 1 : count
    }, 0)
  }, [prompts, selections])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <span className="inline-flex items-center rounded-full bg-ter-pink/10 px-3 py-1 text-sm font-medium text-ter-pink">
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 whitespace-pre-line">{instructions}</p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {prompts.map(prompt => {
          const selectedOptionId = selections[prompt.id]
          const isCorrect = prompt.options.find(opt => opt.id === selectedOptionId)?.isMatch

          return (
            <div key={prompt.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{prompt.suitcaseLabel}</h3>
              <p className="text-sm text-gray-600 mb-4">{prompt.description}</p>
              <div className="space-y-2">
                {prompt.options.map(option => {
                  const isSelected = option.id === selectedOptionId
                  const isOptionCorrect = completed && option.isMatch
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(prompt.id, option.id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        isOptionCorrect
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                          : isSelected
                            ? 'border-ter-pink bg-white text-ter-pink shadow'
                            : 'border-transparent bg-white text-gray-700 hover:border-ter-pink/40'
                      }`}
                    >
                      {option.text}
                    </button>
                  )
                })}
              </div>
              {showFeedback && selectedOptionId && (
                <div
                  className={`mt-3 rounded-md border px-3 py-2 text-sm ${
                    isCorrect
                      ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                      : 'border-rose-100 bg-rose-50 text-rose-600'
                  }`}
                >
                  {isCorrect ? 'You matched this suitcase perfectly.' : 'Try a different match for this suitcase.'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <footer className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-600">
          {completed ? 'All suitcases are claimed. Beautiful work clearing the baggage!' : 'Match each suitcase with the reflection that belongs to it.'}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            Correct matches: {correctCount} / {prompts.length}
          </span>
          <button
            onClick={handleCheckAnswers}
            className="rounded-full bg-ter-pink px-5 py-2 text-sm font-semibold text-white shadow hover:bg-ter-pink/90 disabled:cursor-not-allowed disabled:bg-gray-300"
            disabled={completed}
          >
            {completed ? 'Completed' : 'Check Matches'}
          </button>
        </div>
      </footer>
    </div>
  )
}
