'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Heart, MessageSquare, Mic, ToggleLeft, ToggleRight, TrendingUp, Users, Calendar, Settings, PlayCircle } from 'lucide-react'
import GameSelector from '@/src/games/GameSelector'
import { GameLevel } from '@/src/games/BaggageClaimGame'
import VoiceChat from '@/src/voice/VoiceChat'
import Footer from '@/src/components/Footer'

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
    <div className="min-h-screen bg-[#2A2A2A]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Today's Practice Section */}
        <div className="bg-[#E8DCC8] rounded-3xl p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Practice:</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Complete Comprehension Assessment</span>
              <button className="bg-[#9BB5B0] hover:bg-[#8AA5A0] text-gray-900 px-6 py-2 rounded-xl font-medium transition-colors">
                Start
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Play Internal Weather Report: Day 2</span>
              <button
                onClick={() => {
                  const section = document.getElementById('games-section')
                  section?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-[#9BB5B0] hover:bg-[#8AA5A0] text-gray-900 px-6 py-2 rounded-xl font-medium transition-colors"
              >
                Play
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Practice - Games */}
          <a
            href="#games-section"
            className="bg-[#A7CCD9] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[180px] hover:opacity-90 transition-opacity"
          >
            <Heart size={64} className="text-gray-900 mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">Practice</h3>
          </a>

          {/* Progress */}
          <button
            onClick={() => alert('Progress tracking coming soon! This will show your completion stats across all sections and games.')}
            className="bg-[#8D725D] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[180px] hover:opacity-90 transition-opacity"
          >
            <TrendingUp size={64} className="text-white mb-3" />
            <h3 className="text-2xl font-bold text-white">Progress</h3>
          </button>

          {/* Translation */}
          <Link
            href="/translator"
            className="bg-[#F5C95D] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[180px] hover:opacity-90 transition-opacity"
          >
            <MessageSquare size={64} className="text-gray-900 mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">Translation</h3>
          </Link>

          {/* Mediator */}
          <Link
            href="/mediator"
            className="bg-[#B8C77C] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[180px] hover:opacity-90 transition-opacity"
          >
            <Users size={64} className="text-gray-900 mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">Mediator</h3>
          </Link>

          {/* Reference */}
          <Link
            href="/pillars"
            className="bg-[#C5B9D6] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[180px] hover:opacity-90 transition-opacity"
          >
            <BookOpen size={64} className="text-gray-900 mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">Reference</h3>
          </Link>

          {/* Live Events */}
          <button
            onClick={() => alert('Live Events coming soon! Marshall and Heather will host live Q&A sessions and workshops here.')}
            className="bg-[#E07A5F] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[180px] hover:opacity-90 transition-opacity"
          >
            <PlayCircle size={64} className="text-gray-900 mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">Live Events</h3>
          </button>

          {/* Book a Session */}
          <button
            onClick={() => alert('Session Booking coming soon! Schedule 1-on-1 time with certified TER coaches.')}
            className="bg-[#F4B8C1] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[180px] hover:opacity-90 transition-opacity"
          >
            <Calendar size={64} className="text-gray-900 mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">Book a Session</h3>
          </button>

          {/* Settings */}
          <button
            onClick={() => alert('Settings coming soon! Manage notifications, couple pairing, privacy preferences, and more.')}
            className="bg-[#B8B8B8] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[180px] hover:opacity-90 transition-opacity"
          >
            <Settings size={64} className="text-gray-900 mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">Settings</h3>
          </button>
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

        <Footer />
      </div>
    </div>
  )
}
