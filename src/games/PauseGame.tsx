'use client'

import { useState, useEffect } from 'react'
import { PauseCircle, Play, RotateCcw, Heart } from 'lucide-react'
import { GameComponentProps } from './BaggageClaimGame'

export default function PauseGame({ title, instructions, onComplete }: GameComponentProps) {
  const [step, setStep] = useState<'intro' | 'pausing' | 'reflection'>('intro')
  const [timeLeft, setTimeLeft] = useState(60) // 1 minute pause
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

  const startPause = () => {
    setStep('pausing')
    setTimeLeft(60)
    setIsTimerRunning(true)
  }

  const resetPause = () => {
    setIsTimerRunning(false)
    setTimeLeft(60)
    setStep('intro')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (step === 'intro') {
    return (
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-700 mb-4">
            A quick de-escalation tool when a conversation is heating up.
          </p>

          <div className="bg-ter-coral/10 rounded-lg p-4 mb-4 border border-ter-coral/30">
            <h3 className="font-semibold text-gray-900 mb-2">When to Use (1-2 min)</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• When you notice reactivity building (yours or theirs)</li>
              <li>• When the conversation is becoming mean or unfair</li>
              <li>• When you're no longer hearing each other</li>
              <li>• When one of you needs space to regulate</li>
            </ul>
          </div>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li><strong>Anyone can call "Pause"</strong> - no questions asked</li>
              <li><strong>Take 1 minute</strong> - Breathe, ground, regulate your nervous system</li>
              <li><strong>Come back</strong> - Decide together: continue or table the conversation?</li>
            </ol>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-1">⚠️ Ground Rules</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Either person can call Pause at any time</li>
              <li>• Don't follow your partner if they need physical space</li>
              <li>• No texting, social media, or distractions during the pause</li>
              <li>• Come back in 1-2 minutes maximum (longer breaks need agreement)</li>
            </ul>
          </div>

          <button
            onClick={startPause}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <PauseCircle size={20} />
            Start 1-Minute Pause
          </button>
        </div>
      </div>
    )
  }

  if (step === 'pausing') {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="text-center py-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <PauseCircle size={80} className="text-ter-coral animate-pulse" />
              </div>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {formatTime(timeLeft)}
            </h3>
            <p className="text-gray-600 mb-8">
              Take this time to breathe and regulate
            </p>

            <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">During the Pause:</h4>
              <ul className="space-y-2 text-sm text-gray-700 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-ter-coral mt-0.5">•</span>
                  <span><strong>Breathe deeply</strong> - In for 4, hold for 4, out for 6</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ter-coral mt-0.5">•</span>
                  <span><strong>Ground yourself</strong> - Feel your feet on the floor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ter-coral mt-0.5">•</span>
                  <span><strong>Notice sensations</strong> - Where is the heat/tension in your body?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ter-coral mt-0.5">•</span>
                  <span><strong>Remember</strong> - This person matters to you</span>
                </li>
              </ul>
            </div>

            {timeLeft > 0 && (
              <button
                onClick={() => {
                  setIsTimerRunning(false)
                  setStep('reflection')
                }}
                className="btn-secondary"
              >
                End Pause Early
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
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Pause Complete</h3>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Check In With Each Other:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-ter-blue mt-0.5">•</span>
                <span>"Are you regulated enough to continue, or do we need more time?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ter-blue mt-0.5">•</span>
                <span>"What do you need right now to feel safe enough to talk?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ter-blue mt-0.5">•</span>
                <span>"Should we continue this conversation or table it for later?"</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
            <p className="text-sm text-green-900 mb-2">
              <strong>✓ Options After the Pause:</strong>
            </p>
            <ul className="text-sm text-green-800 space-y-1">
              <li><strong>Continue:</strong> Resume the conversation with more groundedness</li>
              <li><strong>Table it:</strong> Agree on when to come back to this (within 24-48 hours)</li>
              <li><strong>Use Translation:</strong> Try translating your feelings through TES before continuing</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-1">💡 Remember</p>
            <p className="text-sm text-yellow-800">
              Calling Pause isn't giving up - it's choosing connection over being right.
              It's one of the most mature things you can do in a heated moment.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetPause}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Take Another Pause
            </button>
            <button
              onClick={onComplete}
              className="btn-primary flex-1"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
