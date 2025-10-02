'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Heart, MessageSquare, Mic, ToggleLeft, ToggleRight } from 'lucide-react'
import GameSelector from '@/src/games/GameSelector'
import { GameLevel } from '@/src/games/BaggageClaimGame'
import VoiceChat from '@/src/voice/VoiceChat'

const levelOptions: Array<{ value: GameLevel; label: string; description: string }> = [
  { value: 'beginner', label: 'Beginner', description: 'Gentle introductions that build shared language.' },
  { value: 'intermediate', label: 'Intermediate', description: 'Adds embodied check-ins and collaborative experiments.' },
  { value: 'advanced', label: 'Advanced', description: 'For seasoned pairs integrating playful rigor.' }
]

export default function App() {
  const [voiceMode, setVoiceMode] = useState(false)
  const [level, setLevel] = useState<GameLevel>('beginner')
  const [requestedGameId, setRequestedGameId] = useState<string | null>(null)
  const [lastCompletedGame, setLastCompletedGame] = useState<string | null>(null)

  const selectedLevel = useMemo(() => levelOptions.find(option => option.value === level) ?? levelOptions[0], [level])

  const handleVoiceStartGame = useCallback((gameId: string) => {
    setRequestedGameId(gameId)
    if (!voiceMode) {
      setVoiceMode(true)
    }
    if (typeof window !== 'undefined') {
      const section = document.getElementById('games-section')
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [voiceMode])

  useEffect(() => {
    if (lastCompletedGame) {
      const timeout = setTimeout(() => setLastCompletedGame(null), 5000)
      return () => clearTimeout(timeout)
    }
  }, [lastCompletedGame])

  return (
    <div className="min-h-screen bg-gradient-to-br from-ter-blue/20 to-ter-lavender/20">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/icon-192.png" alt="TER Logo" className="w-16 h-16 rounded-2xl shadow-lg" />
            <h1 className="text-4xl font-bold text-gray-900">Truth Empowered Relationships</h1>
          </div>
          <p className="text-gray-600">Transform reactive patterns into conscious connection</p>
        </header>

        <div className="max-w-4xl mx-auto mb-10 rounded-3xl bg-white/80 p-6 shadow-lg">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Practice Settings</h2>
              <p className="text-sm text-gray-600">Tune the experience for where you are today.</p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <label className="flex flex-col text-left text-sm font-medium text-gray-700">
                <span className="mb-1">Growth Edge</span>
                <select
                  value={level}
                  onChange={event => setLevel(event.target.value as GameLevel)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-ter-pink focus:outline-none focus:ring-2 focus:ring-ter-pink/40"
                >
                  {levelOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="mt-1 text-xs font-normal text-gray-500">{selectedLevel.description}</span>
              </label>

              <div className="flex flex-col text-sm font-medium text-gray-700">
                <span className="mb-1">Voice Mode</span>
                <button
                  type="button"
                  onClick={() => setVoiceMode(value => !value)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    voiceMode ? 'border-ter-pink bg-ter-pink text-white shadow-inner' : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  {voiceMode ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  {voiceMode ? 'On' : 'Off'}
                </button>
                <span className="mt-1 text-xs font-normal text-gray-500">Let Aria listen and speak back in real time.</span>
              </div>
            </div>
          </div>
          {lastCompletedGame && (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {lastCompletedGame} logged. Beautiful integration!
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link href="/translator" className="block transform transition-transform hover:scale-105">
            <div className="bg-ter-gold rounded-2xl p-8 text-white h-full">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare size={40} />
                <span className="text-white/80 text-sm">TES / TEL</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Translator</h2>
              <p className="text-white/90">Transform reactive language into conscious communication</p>
              <div className="mt-6 text-sm text-white/80">
                • Truth Empowered Speaking<br />
                • Truth Empowered Listening
              </div>
            </div>
          </Link>

          <Link href="/mediator" className="block transform transition-transform hover:scale-105">
            <div className="bg-ter-olive rounded-2xl p-8 text-white h-full">
              <div className="flex items-center justify-between mb-4">
                <Mic size={40} />
                <span className="text-white/80 text-sm">Beta</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Mediator</h2>
              <p className="text-white/90">Record & analyze conversations in real-time</p>
              <div className="mt-6 text-sm text-white/80">
                • 15-60 second recordings<br />
                • Get depth questions & games
              </div>
            </div>
          </Link>

          <Link href="/pillars" className="block transform transition-transform hover:scale-105">
            <div className="bg-ter-taupe rounded-2xl p-8 text-white h-full">
              <div className="flex items-center justify-between mb-4">
                <BookOpen size={40} />
                <span className="text-white/80 text-sm">Reference</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Four Pillars</h2>
              <p className="text-white/90">The foundation of Truth Empowered Relationships</p>
              <div className="mt-6 text-sm text-white/80">
                • Freeness • Wholesomeness<br />
                • Non-Meanness • Fairness
              </div>
            </div>
          </Link>

          <a href="#games-section" className="block transform transition-transform hover:scale-105">
            <div className="bg-ter-pink rounded-2xl p-8 text-white h-full">
              <div className="flex items-center justify-between mb-4">
                <Heart size={40} />
                <span className="text-white/80 text-sm">New</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Games</h2>
              <p className="text-white/90">Playful exercises to deepen connection</p>
              <div className="mt-6 text-sm text-white/80">
                • Internal Weather Report<br />
                • Pause • And What Else?
              </div>
            </div>
          </a>
        </div>

        <section id="games-section" className="max-w-4xl mx-auto mb-16">
          <GameSelector
            level={level}
            requestedGameId={requestedGameId}
            onGameLaunch={(gameId) => {
              setRequestedGameId(current => (current === gameId ? null : current))
            }}
            onRequestHandled={() => setRequestedGameId(null)}
            onGameComplete={(gameId) => setLastCompletedGame(gameId === 'baggage-claim' ? 'Baggage Claim practice' : gameId)}
          />
        </section>

        <section id="voice-section" className="max-w-4xl mx-auto mb-16">
          <VoiceChat active={voiceMode} onStartGame={handleVoiceStartGame} />
        </section>

        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white/80 backdrop-blur rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">🚀 Demo Version</h3>
          <p className="text-gray-600 text-sm">
            This is a functional prototype of the Truth Empowered Relationships app.
            The Translator, Mediator, and Games tools are now connected. To explore them:
          </p>
          <ol className="mt-3 text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li>Copy the <code className="bg-gray-100 px-1 rounded">.env.local.example</code> file to <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
            <li>Add your OpenAI and Supabase keys</li>
            <li>Run <code className="bg-gray-100 px-1 rounded">npm install && npm run dev</code></li>
          </ol>
        </div>
      </div>
    </div>
  )
}
