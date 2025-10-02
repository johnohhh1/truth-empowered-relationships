'use client'

import { useState, useEffect } from 'react'
import { Heart, Users, ArrowRight, Timer } from 'lucide-react'
import { GameComponentProps } from './BaggageClaimGame'

export default function ClosenessCounterGame({ title, instructions, onComplete }: GameComponentProps) {
  const [step, setStep] = useState<'intro' | 'setup' | 'active' | 'reflection'>('intro')
  const [targetTime, setTargetTime] = useState(30) // minutes
  const [emotionalDistance, setEmotionalDistance] = useState(5) // 1-10 scale
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false)
          setStep('reflection')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerRunning, timeLeft])

  const startGame = () => {
    setTimeLeft(targetTime * 60) // Convert to seconds
    setIsTimerRunning(true)
    setStep('active')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPhysicalDistanceForEmotionalDistance = (emotional: number) => {
    // 1 = closest, 10 = furthest
    const distances = [
      'Touching/embracing',
      'Arms length apart',
      'Across a small table',
      '3-4 feet apart',
      'Across a room',
      'In different rooms (door open)',
      'In different rooms (door closed)',
      'On different floors',
      'Outside the house',
      'Completely separate locations'
    ]
    return distances[emotional - 1] || distances[0]
  }

  if (step === 'intro') {
    return (
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-700 mb-4">
            Your physical distance reflects your emotional distance. Stay at that distance for 30-60 minutes - no screens, no distractions.
          </p>

          <div className="bg-ter-pink/10 rounded-lg p-4 mb-4 border border-ter-pink/30">
            <h3 className="font-semibold text-gray-900 mb-2">How It Works (30-60 min)</h3>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Rate your current emotional closeness (1 = very close, 10 = very distant)</li>
              <li>Match your physical distance to that emotional number</li>
              <li>Stay at that distance for the full time - no phones, no TV, no books</li>
              <li>Notice what happens in the silence and space</li>
            </ol>
          </div>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Examples</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Feeling close (1-2):</strong> Sit touching, hold hands, embrace</li>
              <li><strong>Neutral (5):</strong> Same room, across from each other</li>
              <li><strong>Distant (8-10):</strong> Different rooms or even different floors</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-1">⚠️ Rules</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• No phones, screens, books, or distractions</li>
              <li>• You can talk, but you don't have to</li>
              <li>• If someone needs closer, they can request it</li>
              <li>• The point is to feel what's true, not pretend</li>
            </ul>
          </div>

          <button
            onClick={() => setStep('setup')}
            className="btn-primary w-full"
          >
            Set Up Closeness Counter
          </button>
        </div>
      </div>
    )
  }

  if (step === 'setup') {
    return (
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Setup Your Practice</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How emotionally close do you feel right now?
            </label>
            <div className="flex justify-between gap-2 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setEmotionalDistance(num)}
                  className={`flex-1 aspect-square rounded-lg border-2 font-semibold transition-all ${
                    emotionalDistance === num
                      ? 'border-ter-pink bg-ter-pink/20 text-gray-900'
                      : 'border-gray-200 hover:border-ter-pink/50 text-gray-600 bg-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-1">
              <span className="text-xs text-gray-500">Very Close</span>
              <span className="text-xs text-gray-500">Very Distant</span>
            </div>
          </div>

          <div className="bg-ter-pink/10 rounded-lg p-4 mb-6 border border-ter-pink/30">
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} className="text-ter-pink" />
              <h4 className="font-semibold text-gray-900">Your Physical Distance:</h4>
            </div>
            <p className="text-lg text-gray-900 font-medium">
              {getPhysicalDistanceForEmotionalDistance(emotionalDistance)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Based on emotional distance rating of {emotionalDistance}/10
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How long? (minutes)
            </label>
            <div className="flex gap-3">
              {[30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTargetTime(mins)}
                  className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
                    targetTime === mins
                      ? 'border-ter-pink bg-ter-pink/20 text-gray-900'
                      : 'border-gray-200 hover:border-ter-pink/50 text-gray-600 bg-white'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('intro')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={startGame}
              className="btn-primary flex-1"
            >
              Start Timer
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'active') {
    const progress = ((targetTime * 60 - timeLeft) / (targetTime * 60)) * 100

    return (
      <div className="space-y-6">
        <div className="card">
          <div className="text-center py-8">
            <div className="flex justify-center mb-6">
              <Heart size={80} className="text-ter-pink animate-pulse" />
            </div>

            <h3 className="text-4xl font-bold text-gray-900 mb-2">
              {formatTime(timeLeft)}
            </h3>
            <p className="text-gray-600 mb-2">remaining</p>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
              <div
                className="bg-ter-pink h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="max-w-md mx-auto bg-ter-pink/10 rounded-lg p-6 mb-6 border border-ter-pink/30">
              <h4 className="font-semibold text-gray-900 mb-3">Your Distance:</h4>
              <p className="text-lg font-medium text-gray-900 mb-4">
                {getPhysicalDistanceForEmotionalDistance(emotionalDistance)}
              </p>
              <p className="text-sm text-gray-600">
                Stay at this distance. No screens. Just be.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">While You Wait:</h4>
              <ul className="space-y-2 text-sm text-gray-700 text-left">
                <li>• Notice the impulse to reach for your phone</li>
                <li>• Feel the discomfort of being present</li>
                <li>• What wants to be said in this space?</li>
                <li>• Do you want to move closer or further?</li>
              </ul>
            </div>

            {timeLeft > 0 && (
              <button
                onClick={() => {
                  setIsTimerRunning(false)
                  setStep('reflection')
                }}
                className="btn-secondary mt-6"
              >
                End Early
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'reflection') {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-center mb-4">
            <Heart size={48} className="text-ter-pink" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Closeness Counter Complete
          </h3>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Reflection Questions:</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-ter-blue mt-0.5">•</span>
                <span>How did it feel to maintain that distance?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ter-blue mt-0.5">•</span>
                <span>Did you want to move closer or further? What stopped you?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ter-blue mt-0.5">•</span>
                <span>What did you learn about your relationship in that space?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ter-blue mt-0.5">•</span>
                <span>If you could stay at any distance now, what would it be?</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
            <p className="text-sm text-green-900 mb-2">
              <strong>What This Game Reveals:</strong>
            </p>
            <p className="text-sm text-green-800">
              Physical distance is honest. We can lie with words but not with our bodies.
              If you stayed far apart, that's information. If you moved closer, that's also information.
              Both are okay - what matters is naming what's true.
            </p>
          </div>

          <button
            onClick={onComplete}
            className="btn-primary w-full"
          >
            Complete Practice
          </button>
        </div>
      </div>
    )
  }

  return null
}
