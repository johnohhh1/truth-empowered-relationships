'use client'

import { useState } from 'react'
import { RefreshCw, MessageSquare, CheckCircle2 } from 'lucide-react'
import { GameComponentProps } from './BaggageClaimGame'

export default function SwitchGame({ title, instructions, onComplete }: GameComponentProps) {
  const [step, setStep] = useState<'intro' | 'setup' | 'partner-a' | 'partner-b' | 'reflection'>('intro')
  const [issue, setIssue] = useState('')
  const [partnerAArgument, setPartnerAArgument] = useState('')
  const [partnerBArgument, setPartnerBArgument] = useState('')

  if (step === 'intro') {
    return (
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-700 mb-4">
            Argue from your partner's perspective. This isn't about winning - it's about understanding.
          </p>

          <div className="bg-ter-coral/10 rounded-lg p-4 mb-4 border border-ter-coral/30">
            <h3 className="font-semibold text-gray-900 mb-2">How to Play (10-15 min)</h3>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Pick a recurring disagreement (not the biggest fight, something medium-sized)</li>
              <li>Each person argues from the OTHER person's perspective for 2-3 minutes</li>
              <li>Try to make the BEST case for your partner's viewpoint</li>
              <li>Your partner listens and corrects if you miss something important</li>
            </ol>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-1">⚠️ Safety Notes</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Pick a medium-sized issue, not your biggest wound</li>
              <li>• The goal is empathy, not mockery or sarcasm</li>
              <li>• If it gets too hot, call Pause</li>
              <li>• This requires emotional regulation - be honest if you're not ready</li>
            </ul>
          </div>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              <strong>Why it works:</strong> When you have to argue your partner's side,
              you often discover their concerns are more reasonable than you thought.
              It's hard to villainize someone when you're standing in their shoes.
            </p>
          </div>

          <button
            onClick={() => setStep('setup')}
            className="btn-primary w-full"
          >
            Start Switch
          </button>
        </div>
      </div>
    )
  }

  if (step === 'setup') {
    return (
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Pick Your Issue</h3>
          <p className="text-gray-600 mb-6">
            Choose a recurring disagreement - something you've argued about multiple times.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you disagree about?
            </label>
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g., 'How we spend weekends' or 'Division of household tasks' or 'Money decisions'"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ter-coral"
              rows={3}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Good choices:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• How to spend free time</li>
              <li>• Social plans and boundaries</li>
              <li>• Household responsibilities</li>
              <li>• Parenting approaches</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Avoid for now:</strong> Anything involving trauma, betrayal, or deep wounds.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('intro')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setStep('partner-a')}
              disabled={!issue.trim()}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'partner-a') {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw size={24} className="text-ter-coral" />
            <h3 className="text-xl font-semibold text-gray-900">Partner A's Turn</h3>
          </div>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Issue:</strong> {issue}
            </p>
            <p className="text-sm text-gray-600">
              Partner A: Argue from Partner B's perspective. Make the BEST case for their viewpoint.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partner A: What would Partner B say? Why do they see it their way?
            </label>
            <textarea
              value={partnerAArgument}
              onChange={(e) => setPartnerAArgument(e.target.value)}
              placeholder="Try to capture your partner's perspective as accurately as possible... Why do they care about this? What are they afraid of? What do they need?"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ter-coral"
              rows={6}
            />
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-1">
              💡 Tips for Partner A:
            </p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Use "I" statements as if you ARE your partner</li>
              <li>• What are they afraid of? What do they need?</li>
              <li>• Make their argument BETTER than they would</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('setup')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setStep('partner-b')}
              disabled={!partnerAArgument.trim()}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Partner B's Turn
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'partner-b') {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw size={24} className="text-ter-coral" />
            <h3 className="text-xl font-semibold text-gray-900">Partner B's Turn</h3>
          </div>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Issue:</strong> {issue}
            </p>
            <p className="text-sm text-gray-600">
              Partner B: Argue from Partner A's perspective. Make the BEST case for their viewpoint.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partner B: What would Partner A say? Why do they see it their way?
            </label>
            <textarea
              value={partnerBArgument}
              onChange={(e) => setPartnerBArgument(e.target.value)}
              placeholder="Try to capture your partner's perspective as accurately as possible... Why do they care about this? What are they afraid of? What do they need?"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ter-coral"
              rows={6}
            />
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-1">
              💡 Tips for Partner B:
            </p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Use "I" statements as if you ARE your partner</li>
              <li>• What are they afraid of? What do they need?</li>
              <li>• Make their argument BETTER than they would</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('partner-a')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setStep('reflection')}
              disabled={!partnerBArgument.trim()}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              See Results
            </button>
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
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Switch Complete
          </h3>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">The Issue:</h4>
            <p className="text-gray-700">{issue}</p>
          </div>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-4 border border-ter-blue/30">
            <h4 className="font-semibold text-gray-900 mb-2">Partner A argued B's side:</h4>
            <p className="text-sm text-gray-700 italic">"{partnerAArgument}"</p>
          </div>

          <div className="bg-ter-olive/10 rounded-lg p-4 mb-6 border border-ter-olive/30">
            <h4 className="font-semibold text-gray-900 mb-2">Partner B argued A's side:</h4>
            <p className="text-sm text-gray-700 italic">"{partnerBArgument}"</p>
          </div>

          <div className="bg-ter-pink/10 rounded-lg p-4 mb-6 border border-ter-pink/30">
            <h4 className="font-semibold text-gray-900 mb-3">Discussion Questions:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-ter-pink mt-0.5">•</span>
                <span>"How accurate was my partner's description of my viewpoint?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ter-pink mt-0.5">•</span>
                <span>"What did they understand that surprised me?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ter-pink mt-0.5">•</span>
                <span>"What did I miss about your perspective?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ter-pink mt-0.5">•</span>
                <span>"Now that we've stood in each other's shoes, what looks different?"</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
            <p className="text-sm text-green-900 font-medium mb-2">
              ✓ What This Reveals
            </p>
            <p className="text-sm text-green-800">
              When you argue your partner's side well, they feel seen - maybe for the first time.
              And when you hear YOUR argument from their mouth, you realize they actually do understand you.
              The issue doesn't always get solved, but the distance between you shrinks.
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
