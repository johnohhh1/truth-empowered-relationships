'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Heart } from 'lucide-react'
import { GameComponentProps } from './BaggageClaimGame'

interface PillarRating {
  pillar: string
  yourRating: number | null
  partnerRating: number | null
}

const pillars = [
  {
    name: 'Freeness',
    description: 'Can I be myself? Do I feel free to express what I think and feel?',
    color: 'ter-blue'
  },
  {
    name: 'Wholesomeness',
    description: 'Are we bringing out the best in each other? Growing together?',
    color: 'ter-olive'
  },
  {
    name: 'Non-Meanness',
    description: 'Do we treat each other with kindness, even when upset?',
    color: 'ter-pink'
  },
  {
    name: 'Fairness',
    description: 'Is the relationship balanced? Do we both give and receive?',
    color: 'ter-lavender'
  }
]

export default function PillarTalkGame({ title, instructions, onComplete }: GameComponentProps) {
  const [step, setStep] = useState<'intro' | 'your-ratings' | 'partner-ratings' | 'discussion'>('intro')
  const [ratings, setRatings] = useState<PillarRating[]>(
    pillars.map(p => ({ pillar: p.name, yourRating: null, partnerRating: null }))
  )
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0)
  const [isRatingYou, setIsRatingYou] = useState(true)

  const handleRating = (rating: number) => {
    const newRatings = [...ratings]
    const currentRating = newRatings[currentPillarIndex]

    if (isRatingYou) {
      currentRating.yourRating = rating
    } else {
      currentRating.partnerRating = rating
    }

    setRatings(newRatings)
  }

  const handleNext = () => {
    if (currentPillarIndex < pillars.length - 1) {
      setCurrentPillarIndex(currentPillarIndex + 1)
    } else {
      if (isRatingYou) {
        setIsRatingYou(false)
        setCurrentPillarIndex(0)
        setStep('partner-ratings')
      } else {
        setStep('discussion')
      }
    }
  }

  const handleBack = () => {
    if (currentPillarIndex > 0) {
      setCurrentPillarIndex(currentPillarIndex - 1)
    }
  }

  const canProgress = isRatingYou
    ? ratings[currentPillarIndex].yourRating !== null
    : ratings[currentPillarIndex].partnerRating !== null

  if (step === 'intro') {
    return (
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-700 mb-4">
            Check in on the Four Pillars of a healthy relationship: Freeness, Wholesomeness, Non-Meanness, and Fairness.
          </p>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">The Four Pillars</h3>
            <div className="space-y-3">
              {pillars.map((pillar) => (
                <div key={pillar.name} className="border-l-4 border-ter-blue pl-3">
                  <h4 className="font-medium text-gray-900">{pillar.name}</h4>
                  <p className="text-sm text-gray-600">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ter-lavender/10 rounded-lg p-4 mb-4 border border-ter-lavender/30">
            <h3 className="font-semibold text-gray-900 mb-2">How to Play (5-10 min)</h3>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Each person rates how they're feeling about each pillar (1-10)</li>
              <li>Share your ratings with each other</li>
              <li>Discuss what would help the lowest-rated pillar improve</li>
              <li>Pick ONE concrete action to strengthen that pillar this week</li>
            </ol>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-1">💡 Remember</p>
            <p className="text-sm text-yellow-800">
              This isn't about blaming - it's about honest check-ins.
              A low rating is information, not accusation.
            </p>
          </div>

          <button
            onClick={() => setStep('your-ratings')}
            className="btn-primary w-full"
          >
            Start Pillar Check-In
          </button>
        </div>
      </div>
    )
  }

  if (step === 'your-ratings' || step === 'partner-ratings') {
    const currentPillar = pillars[currentPillarIndex]
    const currentRating = ratings[currentPillarIndex]
    const selectedRating = isRatingYou ? currentRating.yourRating : currentRating.partnerRating

    return (
      <div className="space-y-6">
        <div className="card">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {isRatingYou ? 'Your Ratings' : "Partner's Ratings"}
              </span>
              <span className="text-sm font-medium text-gray-900">
                Pillar {currentPillarIndex + 1} of {pillars.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-ter-blue h-2 rounded-full transition-all"
                style={{ width: `${((currentPillarIndex + 1) / pillars.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{currentPillar.name}</h3>
          <p className="text-gray-600 mb-6">{currentPillar.description}</p>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              How is this pillar feeling right now? (1 = struggling, 10 = strong)
            </p>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = selectedRating === num
                let selectedClasses = 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'

                if (isSelected) {
                  if (currentPillar.color === 'ter-blue') {
                    selectedClasses = 'border-ter-blue bg-ter-blue/20 text-gray-900'
                  } else if (currentPillar.color === 'ter-olive') {
                    selectedClasses = 'border-ter-olive bg-ter-olive/20 text-gray-900'
                  } else if (currentPillar.color === 'ter-pink') {
                    selectedClasses = 'border-ter-pink bg-ter-pink/20 text-gray-900'
                  } else if (currentPillar.color === 'ter-lavender') {
                    selectedClasses = 'border-ter-lavender bg-ter-lavender/20 text-gray-900'
                  }
                }

                return (
                  <button
                    key={num}
                    onClick={() => handleRating(num)}
                    className={`flex-1 aspect-square rounded-lg border-2 font-semibold transition-all ${selectedClasses}`}
                  >
                    {num}
                  </button>
                )
              })}
            </div>
            <div className="flex justify-between mt-2 px-1">
              <span className="text-xs text-gray-500">Struggling</span>
              <span className="text-xs text-gray-500">Strong</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              disabled={currentPillarIndex === 0}
              className="btn-secondary flex-1 disabled:opacity-30"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProgress}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {currentPillarIndex === pillars.length - 1
                ? (isRatingYou ? "Partner's Turn" : 'See Results')
                : 'Next Pillar'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'discussion') {
    const lowestPillar = ratings.reduce((lowest, current) => {
      const yourAvg = (current.yourRating || 0)
      const partnerAvg = (current.partnerRating || 0)
      const avg = (yourAvg + partnerAvg) / 2

      const lowestYourAvg = (lowest.yourRating || 0)
      const lowestPartnerAvg = (lowest.partnerRating || 0)
      const lowestAvg = (lowestYourAvg + lowestPartnerAvg) / 2

      return avg < lowestAvg ? current : lowest
    })

    return (
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Pillar Check-In Results</h3>

          {pillars.map((pillar, index) => {
            const rating = ratings[index]
            const yourRating = rating.yourRating || 0
            const partnerRating = rating.partnerRating || 0
            const avg = ((yourRating + partnerRating) / 2).toFixed(1)

            let barColorClass = 'bg-gray-400'
            if (pillar.color === 'ter-blue') {
              barColorClass = 'bg-ter-blue'
            } else if (pillar.color === 'ter-olive') {
              barColorClass = 'bg-ter-olive'
            } else if (pillar.color === 'ter-pink') {
              barColorClass = 'bg-ter-pink'
            } else if (pillar.color === 'ter-lavender') {
              barColorClass = 'bg-ter-lavender'
            }

            return (
              <div key={pillar.name} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{pillar.name}</h4>
                  <span className="text-lg font-bold text-gray-900">{avg}/10</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>You: {yourRating}</span>
                  <span>Partner: {partnerRating}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${barColorClass} h-2 rounded-full`}
                    style={{ width: `${(parseFloat(avg) / 10) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}

          <div className="bg-ter-coral/10 rounded-lg p-4 mt-6 border border-ter-coral/30">
            <h4 className="font-semibold text-gray-900 mb-2">Focus Area</h4>
            <p className="text-sm text-gray-700 mb-3">
              <strong>{lowestPillar.pillar}</strong> has the lowest combined rating. This is a good place to focus your attention.
            </p>
            <p className="text-sm text-gray-600 italic">
              "{pillars.find(p => p.name === lowestPillar.pillar)?.description}"
            </p>
          </div>

          <div className="bg-ter-blue/10 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Discussion Questions:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-ter-blue mt-0.5">•</span>
                <span>"What would help {lowestPillar.pillar} feel stronger?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ter-blue mt-0.5">•</span>
                <span>"What's one thing I could do this week to support that pillar?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ter-blue mt-0.5">•</span>
                <span>"What's one thing you could do?"</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4 mt-4 border border-green-200">
            <p className="text-sm text-green-900 font-medium mb-2">
              ✓ Pick ONE Concrete Action
            </p>
            <p className="text-sm text-green-800">
              Don't try to fix everything. Choose one small, specific action each of you will take this week to strengthen {lowestPillar.pillar}.
            </p>
          </div>

          <button
            onClick={onComplete}
            className="btn-primary w-full mt-6"
          >
            Complete Check-In
          </button>
        </div>
      </div>
    )
  }

  return null
}
