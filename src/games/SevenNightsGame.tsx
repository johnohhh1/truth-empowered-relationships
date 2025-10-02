'use client'

import { useState } from 'react'
import { Moon, CheckCircle2, Lock } from 'lucide-react'
import { GameComponentProps } from './BaggageClaimGame'

const prompts = [
  {
    night: 1,
    prompt: "What's something small I do that makes you feel loved?",
    depth: "low"
  },
  {
    night: 2,
    prompt: "What's one thing I could do this week that would help you feel more connected to me?",
    depth: "low"
  },
  {
    night: 3,
    prompt: "What's a fear you have about our relationship that you haven't said out loud?",
    depth: "medium"
  },
  {
    night: 4,
    prompt: "What's something you resent about me that you've been holding?",
    depth: "medium"
  },
  {
    night: 5,
    prompt: "What's something about yourself that you're afraid I'll stop loving if I really knew it?",
    depth: "high"
  },
  {
    night: 6,
    prompt: "What's the thing you most need from me that you're afraid to ask for?",
    depth: "high"
  },
  {
    night: 7,
    prompt: "If you could change one thing about how we love each other, what would it be?",
    depth: "high"
  }
]

export default function SevenNightsGame({ title, instructions, onComplete }: GameComponentProps) {
  const [step, setStep] = useState<'intro' | 'night-view' | 'complete'>('intro')
  const [currentNight, setCurrentNight] = useState(1)
  const [completedNights, setCompletedNights] = useState<number[]>([])
  const [responses, setResponses] = useState<Record<number, string>>({})

  const markNightComplete = () => {
    if (!completedNights.includes(currentNight)) {
      setCompletedNights([...completedNights, currentNight])
    }
    if (currentNight < 7) {
      setCurrentNight(currentNight + 1)
    } else {
      setStep('complete')
    }
  }

  if (step === 'intro') {
    return (
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-700 mb-4">
            Build progressive vulnerability over seven nights. Each night goes deeper than the last.
          </p>

          <div className="bg-ter-lavender/10 rounded-lg p-4 mb-4 border border-ter-lavender/30">
            <h3 className="font-semibold text-gray-900 mb-2">How It Works (7 nights × 5 min)</h3>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Each night, answer one vulnerability prompt together</li>
              <li>Take turns - one person shares, the other witnesses</li>
              <li>No fixing, defending, or explaining - just listening</li>
              <li>The prompts get progressively deeper each night</li>
            </ol>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-1">⚠️ Important</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Don't skip ahead - the order matters</li>
              <li>• If a night is too intense, pause and come back tomorrow</li>
              <li>• What's shared stays between you (sacred confidentiality)</li>
              <li>• You can't "fail" - any honest answer is the right answer</li>
            </ul>
          </div>

          <div className="space-y-2 mb-4">
            {prompts.map((p) => (
              <div
                key={p.night}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  completedNights.includes(p.night)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {completedNights.includes(p.night) ? (
                  <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                ) : (
                  <Moon size={20} className="text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Night {p.night}</p>
                  <p className="text-xs text-gray-600">{p.depth} depth</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('night-view')}
            className="btn-primary w-full"
          >
            Start Night {currentNight}
          </button>
        </div>
      </div>
    )
  }

  if (step === 'night-view') {
    const currentPrompt = prompts[currentNight - 1]
    const isLastNight = currentNight === 7

    return (
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Moon size={32} className="text-ter-lavender" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Night {currentNight} of 7</h3>
                <p className="text-sm text-gray-600 capitalize">{currentPrompt.depth} depth</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{completedNights.length} completed</p>
            </div>
          </div>

          <div className="bg-ter-lavender/10 rounded-lg p-6 mb-6 border border-ter-lavender/30">
            <p className="text-lg text-gray-900 font-medium text-center">
              "{currentPrompt.prompt}"
            </p>
          </div>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">How to Answer:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Take turns - one person shares first, then the other</li>
              <li>• Speak from your body, not just your head</li>
              <li>• The listener says "I see you" or "Thank you for sharing"</li>
              <li>• No defending, fixing, or explaining</li>
            </ul>
          </div>

          {currentPrompt.depth === 'high' && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
              <p className="text-sm text-yellow-900 font-medium mb-1">
                ⚠️ Deep Vulnerability Ahead
              </p>
              <p className="text-sm text-yellow-800">
                This is a high-depth question. Go slow. If it's too much tonight,
                it's okay to pause and come back tomorrow.
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Optional: Record your reflections (private)
            </label>
            <textarea
              value={responses[currentNight] || ''}
              onChange={(e) => setResponses({ ...responses, [currentNight]: e.target.value })}
              placeholder="What came up for you during this conversation?"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ter-lavender"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('intro')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={markNightComplete}
              className="btn-primary flex-1"
            >
              {isLastNight ? 'Complete Seven Nights' : `Night ${currentNight} Complete`}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 size={48} className="text-ter-lavender" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Seven Nights Complete 🌙
          </h3>

          <div className="bg-ter-lavender/10 rounded-lg p-4 mb-6 border border-ter-lavender/30">
            <p className="text-sm text-gray-700 mb-3">
              You completed all seven nights. That's profound work. You built progressive vulnerability together -
              starting with light truths and ending with the tender stuff that's hardest to say.
            </p>
          </div>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Reflection:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Which night was hardest for you? Why?</li>
              <li>• What did you learn about your partner?</li>
              <li>• What did you learn about yourself?</li>
              <li>• What's different between you now after seven nights?</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
            <p className="text-sm text-green-900 font-medium mb-2">
              ✓ What You Built
            </p>
            <p className="text-sm text-green-800">
              Vulnerability is the path to intimacy. You didn't just share facts - you shared fears, needs, and tender truths.
              That's how strangers become partners, and partners become safe havens.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>What's Next:</strong> You can repeat these seven nights in 3-6 months.
              Your answers will be different - because you're different, and your relationship is different.
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
