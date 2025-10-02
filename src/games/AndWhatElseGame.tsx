'use client'

import { useState } from 'react'
import { MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { GameComponentProps } from './BaggageClaimGame'

export default function AndWhatElseGame({ title, instructions, onComplete }: GameComponentProps) {
  const [step, setStep] = useState<'intro' | 'process' | 'reflection'>('intro')
  const [resentments, setResentments] = useState<string[]>([])
  const [currentResentment, setCurrentResentment] = useState('')
  const [rounds, setRounds] = useState(0)

  const handleAddResentment = () => {
    if (currentResentment.trim()) {
      setResentments([...resentments, currentResentment.trim()])
      setCurrentResentment('')
      setRounds(rounds + 1)
    }
  }

  const handleFinish = () => {
    setStep('reflection')
  }

  if (step === 'intro') {
    return (
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-700 mb-4">
            Release layers of unspoken resentment through gentle inquiry. The person sharing keeps going until they hit bottom.
          </p>

          <div className="bg-ter-coral/10 rounded-lg p-4 mb-4 border border-ter-coral/30">
            <h3 className="font-semibold text-gray-900 mb-2">How to Play (10-20 min)</h3>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Partner A starts: "I resent that..."</li>
              <li>Partner B responds only with: "And what else?"</li>
              <li>Partner A shares another layer: "I resent that..."</li>
              <li>Repeat until Partner A says "That's all" or "Nothing else"</li>
              <li>Switch roles</li>
            </ol>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-1">⚠️ Important Rules</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Listener ONLY says "And what else?" - no defending, explaining, or fixing</li>
              <li>• Sharer speaks in "I" statements - no "you always" or accusations</li>
              <li>• Go until you hit bottom - sometimes 5 rounds, sometimes 20</li>
              <li>• This isn't about solving - it's about releasing what's been held</li>
            </ul>
          </div>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              <strong>Why it works:</strong> Resentments often hide beneath other resentments.
              The simple question "And what else?" helps you discover what's really bothering you -
              often something completely different from where you started.
            </p>
          </div>

          <button
            onClick={() => setStep('process')}
            className="btn-primary w-full"
          >
            Start "And What Else?"
          </button>
        </div>
      </div>
    )
  }

  if (step === 'process') {
    return (
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Partner A Sharing</h3>
          <p className="text-gray-600 mb-6">
            Share what you resent. Partner B, only respond with "And what else?"
          </p>

          {/* Resentments list */}
          <div className="mb-6 space-y-3">
            {resentments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 italic">
                Start by sharing your first resentment...
              </div>
            ) : (
              resentments.map((resentment, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start gap-2">
                    <MessageCircle size={16} className="text-ter-coral mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">"{resentment}"</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Partner B prompt */}
          {resentments.length > 0 && (
            <div className="bg-ter-olive/10 rounded-lg p-4 mb-6 border border-ter-olive/30">
              <p className="text-lg font-semibold text-gray-900 text-center">
                "And what else?"
              </p>
            </div>
          )}

          {/* Input for next resentment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I resent that...
            </label>
            <textarea
              value={currentResentment}
              onChange={(e) => setCurrentResentment(e.target.value)}
              placeholder="Share what's present for you..."
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ter-coral"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAddResentment()
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Press Enter to add, Shift+Enter for new line</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddResentment}
              disabled={!currentResentment.trim()}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Add Resentment
            </button>
            <button
              onClick={handleFinish}
              disabled={resentments.length === 0}
              className="btn-secondary flex-1 disabled:opacity-50"
            >
              That's All ({resentments.length})
            </button>
          </div>

          {resentments.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              {resentments.length} resentments shared • Keep going until you hit bottom
            </div>
          )}
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
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Partner A Complete ({resentments.length} layers released)
          </h3>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">What Just Happened:</h4>
            <p className="text-sm text-gray-700 mb-3">
              You released {resentments.length} layers of resentment. Notice:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Did you discover something surprising beneath the surface?</li>
              <li>• What was the deepest layer - what did you really resent?</li>
              <li>• How does your body feel now that you've spoken it?</li>
            </ul>
          </div>

          <div className="bg-ter-olive/10 rounded-lg p-4 mb-6 border border-ter-olive/30">
            <h4 className="font-semibold text-gray-900 mb-3">For Partner B (The Listener):</h4>
            <p className="text-sm text-gray-700 mb-2">
              You held space without defending or fixing. That's powerful. Notice:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Was it hard to just listen without explaining?</li>
              <li>• What did you learn about your partner?</li>
              <li>• Which resentment was most surprising to hear?</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-2">
              💡 Now Switch Roles
            </p>
            <p className="text-sm text-yellow-800">
              Partner B gets to share, Partner A asks "And what else?"
              This game works best when both people get to release.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>After Both Partners Share:</strong>
            </p>
            <p className="text-sm text-gray-600">
              Don't try to solve everything tonight. You've made space. That's enough.
              If one specific resentment needs attention, you can translate it through TES tomorrow.
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
