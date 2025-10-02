'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, MessageSquare, Mic, ToggleLeft, ToggleRight } from 'lucide-react'
import GameSelector from '@/src/games/GameSelector'
import { GameLevel } from '@/src/games/BaggageClaimGame'
import VoiceChat from '@/src/voice/VoiceChat'

const levelOptions: Array<{ value: GameLevel; label: string; description: string }> = [
  { value: 'beginner', label: 'Beginner', description: 'Gentle introductions that build shared language.' },
  { value: 'intermediate', label: 'Intermediate', description: 'Adds embodied check-ins and collaborative experiments.' },
  { value: 'advanced', label: 'Advanced', description: 'For seasoned pairs integrating playful rigor.' }
]

const modules: Array<{
  href: string
  title: string
  description: string
  icon: typeof MessageSquare
  accent: string
  spotlight: string
}> = [
  {
    href: '/translator',
    title: 'Translator',
    description: 'Rehearse conscious communication, swap reactive phrases for embodied truth, and export new scripts.',
    icon: MessageSquare,
    accent: 'from-ter-pink via-ter-gold/70 to-ter-gold',
    spotlight: 'Speaking + Listening'
  },
  {
    href: '/mediator',
    title: 'Mediator',
    description: 'Capture short reflections, surface emotional data, and receive depth prompts for what to explore next.',
    icon: Mic,
    accent: 'from-ter-blue via-ter-olive/80 to-ter-olive',
    spotlight: 'Live session support'
  },
  {
    href: '/pillars',
    title: 'Four Pillars',
    description: 'Keep Truth Empowered pillars at your fingertips with micro practices and stories to embody each pillar.',
    icon: BookOpen,
    accent: 'from-ter-lavender via-ter-pink/80 to-ter-pink',
    spotlight: 'Foundational study'
  },
  {
    href: '#games-section',
    title: 'Games Library',
    description: 'Practice clearing stories, naming impact, and aligning on needs through structured, playful modules.',
    icon: ArrowRight,
    accent: 'from-ter-coral via-ter-blue/70 to-ter-blue',
    spotlight: 'Guided experiences'
  }
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

  const scrollToGames = useCallback(() => {
    if (typeof window !== 'undefined') {
      const section = document.getElementById('games-section')
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  useEffect(() => {
    if (lastCompletedGame) {
      const timeout = setTimeout(() => setLastCompletedGame(null), 5000)
      return () => clearTimeout(timeout)
    }
  }, [lastCompletedGame])

  return (
    <div className="min-h-screen bg-gradient-to-br from-ter-blue/20 via-white to-ter-lavender/30">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 lg:px-6">
        <header className="mb-12 grid gap-10 rounded-3xl bg-white/90 p-6 shadow-xl shadow-ter-blue/10 backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-ter-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ter-blue">
              Truth Empowered Relationships
            </span>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Practice tools for brave, wholehearted partnership.</h1>
            <p className="text-base text-gray-600 sm:text-lg">
              Choose games from Heather’s workbook, rehearse key conversations, and let Aria guide you with live voice support. Everything is tuned for quick sessions on phones or tablets.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white/90 p-4 text-sm text-gray-700 shadow-sm">
                <span className="mb-2 text-xs uppercase tracking-[0.12em] text-gray-400">Choose your growth edge</span>
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
                <span className="mt-2 text-xs text-gray-500">{selectedLevel.description}</span>
              </label>
              <div className="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white/90 p-4 text-sm font-medium text-gray-700 shadow-sm">
                <span className="mb-2 text-xs uppercase tracking-[0.12em] text-gray-400">Voice mode</span>
                <button
                  type="button"
                  onClick={() => setVoiceMode(value => !value)}
                  className={`inline-flex items-center justify-between rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    voiceMode ? 'bg-ter-pink text-white shadow-inner shadow-ter-pink/30' : 'bg-gray-900 text-white shadow'
                  }`}
                >
                  <span>{voiceMode ? 'On' : 'Off'}</span>
                  {voiceMode ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <span className="mt-2 text-xs text-gray-500">Let Aria listen, respond, and launch games hands-free.</span>
              </div>
            </div>
            {lastCompletedGame && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/95 px-4 py-3 text-sm text-emerald-700">
                {lastCompletedGame} logged. Beautiful integration!
              </div>
            )}
            <button
              type="button"
              onClick={scrollToGames}
              className="group inline-flex w-full items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-ter-pink to-ter-blue px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl sm:w-auto"
            >
              <span>Jump to today’s game</span>
              <ArrowRight className="transition group-hover:translate-x-1" size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 max-[420px]:grid-cols-1">
            {modules.map(module => {
              const Icon = module.icon
              return (
                <Link
                  key={module.title}
                  href={module.href}
                  className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-4 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.accent} opacity-90`} aria-hidden="true" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/25 backdrop-blur">
                      <Icon size={26} />
                    </div>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/90">
                      {module.spotlight}
                    </span>
                  </div>
                  <div className="relative space-y-2">
                    <h2 className="text-2xl font-semibold">{module.title}</h2>
                    <p className="text-sm text-white/90">{module.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </header>

        <section id="games-section" className="mb-16 rounded-3xl bg-white/90 p-6 shadow-xl shadow-ter-pink/10 backdrop-blur">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-ter-pink/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ter-pink">
                Games Library
              </span>
              <h2 className="text-3xl font-semibold text-gray-900">Clear the baggage, reconnect faster.</h2>
              <p className="text-sm text-gray-600">
                Designed for couches, kitchen tables, and long-distance calls. Progress syncs through Supabase so you can pick up on any device.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-600 shadow-sm">
              <Mic size={16} className="text-ter-pink" />
              Say “Play Baggage Claim” and Aria will open it for you.
            </div>
          </div>
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

        <section id="voice-section" className="mb-16">
          <VoiceChat active={voiceMode} onStartGame={handleVoiceStartGame} />
        </section>

        <div className="rounded-3xl bg-white/90 p-6 shadow-lg shadow-ter-blue/10 backdrop-blur">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">🚀 Ready to run</h3>
          <p className="text-sm text-gray-600">
            This build includes fully wired Supabase progress tracking and the Aria voice companion. To launch locally:
          </p>
          <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-gray-600">
            <li>
              Duplicate <code className="rounded bg-gray-100 px-1">.env.local.example</code> to <code className="rounded bg-gray-100 px-1">.env.local</code> and add your keys, including <code className="rounded bg-gray-100 px-1">OPENAI_ARIA_ASSISTANT_ID=asst_G8kVmjn1axL9RHvD620YzfRe</code>.
            </li>
            <li>Run <code className="rounded bg-gray-100 px-1">npm install</code> followed by <code className="rounded bg-gray-100 px-1">npm run dev</code>.</li>
            <li>Sign in through Supabase if prompted and watch progress sync as you complete games.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
