'use client'

import { useState, useEffect } from 'react'
import { Bomb, CheckCircle2, AlertTriangle } from 'lucide-react'
import { GameComponentProps } from './BaggageClaimGame'

const steps = [
  {
    id: 1,
    title: 'Name the Fight',
    prompt: 'What do you call this recurring fight? Give it a nickname.',
    placeholder: 'e.g., "The Dishes War", "The Schedule Spiral", "The Money Thing"',
    duration: 3
  },
  {
    id: 2,
    title: 'The Surface Pattern',
    prompt: 'What happens on the surface? Describe the visible cycle.',
    placeholder: 'What triggers it? Who says/does what? How does it usually end?',
    duration: 5
  },
  {
    id: 3,
    title: 'Your Under',
    prompt: 'Partner 1: What are you afraid of underneath this fight?',
    placeholder: "I'm afraid that...",
    duration: 5
  },
  {
    id: 4,
    title: "Partner's Under",
    prompt: 'Partner 2: What are you afraid of underneath this fight?',
    placeholder: "I'm afraid that...",
    duration: 5
  },
  {
    id: 5,
    title: 'The Real Fight',
    prompt: "What's the fight actually about? (Not the surface topic)",
    placeholder: 'Connection? Control? Being valued? Safety? Autonomy?',
    duration: 5
  },
  {
    id: 6,
    title: 'What Both Need',
    prompt: 'What do BOTH of you need to feel safe/valued/connected?',
    placeholder: 'List what each person truly needs...',
    duration: 7
  },
  {
    id: 7,
    title: 'The Defusal Agreement',
    prompt: 'What ONE thing can you try differently next time this pattern starts?',
    placeholder: 'A phrase to say? A pause signal? A specific action?',
    duration: 10
  },
  {
    id: 8,
    title: 'The Repair Plan',
    prompt: 'When this fight happens again (it will), how will you repair?',
    placeholder: 'What will you say/do to reconnect after the fight?',
    duration: 5
  }
]

export default function BombSquadGame({ title, instructions, onComplete }: GameComponentProps) {
  const [gameStep, setGameStep] = useState<'intro' | 'active' | 'complete'>('intro')
  const [currentStep, setCurrentStep] = useState(1)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)

  const activeStepData = steps.find(s => s.id === currentStep)

  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && isTimerActive) {
      setIsTimerActive(false)
    }
  }, [isTimerActive, timeRemaining])

  const startStep = (stepId: number) => {
    const stepData = steps.find(s => s.id === stepId)
    if (stepData) {
      setCurrentStep(stepId)
      setTimeRemaining(stepData.duration * 60)
      setIsTimerActive(true)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      startStep(currentStep + 1)
    } else {
      setGameStep('complete')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (gameStep === 'intro') {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Bomb size={32} className="text-red-500" />
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          </div>

          <p className="text-gray-700 mb-4">
            Defuse the recurring fights that keep blowing up your connection. This is structured repair work - 45 minutes exactly.
          </p>

          <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-2">⚠️ Before You Start</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Pick ONE recurring fight (not multiple)</li>
              <li>• Both partners must be willing to go beneath the surface</li>
              <li>• No defending, explaining, or counter-attacking</li>
              <li>• You need 45 uninterrupted minutes</li>
              <li>• This is hard work - be gentle with each other</li>
            </ul>
          </div>

          <div className="bg-ter-lavender/10 rounded-lg p-4 mb-4 border border-ter-lavender/30">
            <h3 className="font-semibold text-gray-900 mb-3">The 8 Steps (45 min total)</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              {steps.map((step) => (
                <li key={step.id} className="flex items-start">
                  <span className="font-medium text-gray-900 mr-2">{step.id}.</span>
                  <div className="flex-1">
                    <span className="font-medium">{step.title}</span>
                    <span className="text-gray-500 ml-2">({step.duration} min)</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-red-50 rounded-lg p-4 mb-4 border border-red-200">
            <p className="text-sm text-red-900 font-medium mb-1">🚨 When to Stop</p>
            <p className="text-sm text-red-800">
              If either person feels flooded, unsafe, or too activated - STOP. Use Pause game first, then come back to this later.
            </p>
          </div>

          <button
            onClick={() => {
              setGameStep('active')
              startStep(1)
            }}
            className="btn-primary w-full"
          >
            Start Bomb Squad (45 min)
          </button>
        </div>
      </div>
    )
  }

  if (gameStep === 'active' && activeStepData) {
    const progress = (currentStep / steps.length) * 100

    return (
      <div className="space-y-6">
        <div className="card">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-ter-lavender h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{activeStepData.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{activeStepData.duration} minutes</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-mono ${timeRemaining < 60 ? 'text-red-500' : 'text-gray-900'}`}>
                {formatTime(timeRemaining)}
              </div>
              <button
                onClick={() => setIsTimerActive(!isTimerActive)}
                className="text-sm text-gray-600 underline mt-1"
              >
                {isTimerActive ? 'Pause timer' : 'Resume timer'}
              </button>
            </div>
          </div>

          {/* Prompt */}
          <div className="bg-ter-lavender/10 rounded-lg p-6 mb-6 border border-ter-lavender/30">
            <p className="text-lg text-gray-900 font-medium">
              {activeStepData.prompt}
            </p>
          </div>

          {/* Response textarea */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Response (optional notes)
            </label>
            <textarea
              value={responses[currentStep] || ''}
              onChange={(e) => setResponses({ ...responses, [currentStep]: e.target.value })}
              placeholder={activeStepData.placeholder}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ter-lavender"
              rows={5}
            />
          </div>

          {/* Special guidance for specific steps */}
          {currentStep === 3 || currentStep === 4 ? (
            <div className="bg-ter-blue/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Reminder:</strong> This is about YOUR fear underneath, not their behavior.
                Start with "I'm afraid..." not "You always..."
              </p>
            </div>
          ) : null}

          {currentStep === 7 ? (
            <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
              <p className="text-sm text-green-900 font-medium mb-2">💡 Defusal Ideas</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• A code word that means "I'm feeling that Under again"</li>
                <li>• A physical signal (hand on heart, pause gesture)</li>
                <li>• A phrase like "Can we name what we're really fighting about?"</li>
                <li>• Taking a 5-minute break before re-engaging</li>
              </ul>
            </div>
          ) : null}

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (currentStep > 1) {
                  startStep(currentStep - 1)
                } else {
                  setGameStep('intro')
                }
              }}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="btn-primary flex-1"
            >
              {currentStep === steps.length ? 'Complete Bomb Squad' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameStep === 'complete') {
    const fightName = responses[1] || 'this recurring fight'

    return (
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 size={48} className="text-ter-lavender" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Bomb Defused 💣✓
          </h3>

          <div className="bg-ter-lavender/10 rounded-lg p-4 mb-6 border border-ter-lavender/30">
            <p className="text-sm text-gray-700 mb-3">
              You did hard work. You named {fightName}, went beneath the surface, and created a defusal plan.
            </p>
            <p className="text-sm text-gray-700">
              This fight WILL happen again - that's normal. The difference is now you have a map of what's really happening underneath.
            </p>
          </div>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">What You Discovered:</h4>
            <div className="space-y-3 text-sm text-gray-700">
              {responses[1] && (
                <div>
                  <span className="font-medium">Fight Name:</span> {responses[1]}
                </div>
              )}
              {responses[5] && (
                <div>
                  <span className="font-medium">Real Fight About:</span> {responses[5]}
                </div>
              )}
              {responses[7] && (
                <div>
                  <span className="font-medium">Defusal Agreement:</span> {responses[7]}
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-2">⚡ Next Time This Fight Starts</p>
            <ol className="text-sm text-yellow-800 space-y-1">
              <li>1. Notice it's happening ("Here's {fightName} again")</li>
              <li>2. Use your defusal agreement from Step 7</li>
              <li>3. Remember both people's Unders (Steps 3 & 4)</li>
              <li>4. If it escalates anyway, use your repair plan (Step 8)</li>
            </ol>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Reflection:</strong> Schedule a 10-minute check-in in 2 weeks.
              Ask: "How's our defusal plan working? Do we need to adjust it?"
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
