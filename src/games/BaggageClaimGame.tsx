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

  const instructionSteps = useMemo(() => {
    return instructions
      .split('\n')
      .map(step => step.trim().replace(/^\d+\.\s*/, ''))
      .filter(Boolean)
  }, [instructions])

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
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">Pair the story, impact, and need so the baggage can finally land.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-ter-pink/15 px-4 py-1.5 text-sm font-semibold text-ter-pink">
            {level.charAt(0).toUpperCase() + level.slice(1)} practice
          </span>
        </div>
        <ol className="grid gap-2 rounded-2xl border border-gray-200/70 bg-white/90 p-4 text-sm text-gray-700 shadow-sm sm:grid-cols-3">
          {instructionSteps.map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ter-blue/20 text-xs font-semibold text-ter-blue">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {prompts.map(prompt => {
          const selectedOptionId = selections[prompt.id]
          const isCorrect = prompt.options.find(opt => opt.id === selectedOptionId)?.isMatch

          return (
            <div
              key={prompt.id}
              className="flex h-full flex-col overflow-hidden rounded-[26px] border border-gray-200/70 bg-white/95 p-4 shadow-sm"
            >
              <div className="mb-4 rounded-2xl bg-ter-blue/10 px-4 py-3">
                <h3 className="text-lg font-semibold text-gray-900">{prompt.suitcaseLabel}</h3>
                <p className="mt-1 text-sm text-gray-600">{prompt.description}</p>
              </div>
              <div className="space-y-2">
                {prompt.options.map(option => {
                  const isSelected = option.id === selectedOptionId
                  const isOptionCorrect = completed && option.isMatch
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(prompt.id, option.id)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
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
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="inline-flex items-center gap-2 rounded-full bg-ter-blue/15 px-3 py-1 text-xs font-semibold text-ter-blue">
            {completed ? 'All suitcases claimed' : 'Sort each suitcase with care'}
          </div>
          <span>
            Correct matches: <strong>{correctCount}</strong> / {prompts.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCheckAnswers}
            className="rounded-full bg-ter-pink px-5 py-2 text-sm font-semibold text-white shadow hover:bg-ter-pink/90 disabled:cursor-not-allowed disabled:bg-gray-300"
            disabled={completed}
          >
            {completed ? 'Practice logged' : 'Reveal matches'}
          </button>
        </div>
      </footer>
    </div>
  )
}
