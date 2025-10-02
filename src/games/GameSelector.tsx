'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Clock, Play } from 'lucide-react'
import BaggageClaimGame, { GameComponentProps, GameLevel } from './BaggageClaimGame'
import InternalWeatherReportGame from './InternalWeatherReportGame'
import PauseGame from './PauseGame'
import PillarTalkGame from './PillarTalkGame'
import AndWhatElseGame from './AndWhatElseGame'
import ClosenessCounterGame from './ClosenessCounterGame'
import SwitchGame from './SwitchGame'
import SevenNightsGame from './SevenNightsGame'
import BombSquadGame from './BombSquadGame'
import { getSupabaseClient } from '@/src/lib/supabaseClient'

interface GameDefinition {
  id: string
  title: string
  level: GameLevel
  duration: string
  description: string
  instructions: string
  component: (props: GameComponentProps) => JSX.Element | null
}

interface StoredProgress {
  completed: boolean
  completedAt?: string
}

export interface GameSelectorProps {
  level: GameLevel
  requestedGameId?: string | null
  onGameLaunch?: (gameId: string) => void
  onGameComplete?: (gameId: string) => void
  onRequestHandled?: () => void
}

const gamesCatalog: GameDefinition[] = [
  {
    id: 'internal-weather-report',
    title: 'Internal Weather Report',
    level: 'beginner',
    duration: '2-3 min',
    description: 'Share your emotional weather with each other using simple metaphors - no fixing, just witnessing.',
    instructions: `1. Each person picks a weather that matches their emotional state
2. Share without explaining or fixing
3. Witness each other without trying to change the weather`,
    component: InternalWeatherReportGame
  },
  {
    id: 'pause',
    title: 'Pause',
    level: 'beginner',
    duration: '1-2 min',
    description: 'A quick de-escalation tool when a conversation is heating up - call a 1-minute timeout.',
    instructions: `1. Either person can call "Pause" - no questions asked
2. Take 1 minute to breathe and regulate
3. Come back and decide: continue or table it?`,
    component: PauseGame
  },
  {
    id: 'pillar-talk',
    title: 'Pillar Talk',
    level: 'beginner',
    duration: '5-10 min',
    description: 'Check in on the Four Pillars: Freeness, Wholesomeness, Non-Meanness, and Fairness.',
    instructions: `1. Each person rates how they feel about each pillar (1-10)
2. Share ratings with each other
3. Discuss what would help the lowest pillar improve
4. Pick ONE concrete action for this week`,
    component: PillarTalkGame
  },
  {
    id: 'baggage-claim',
    title: 'Baggage Claim',
    level: 'beginner',
    duration: '6 min',
    description: 'Sort the stories, impacts, and needs so you can hand your baggage to the right carousel.',
    instructions: `1. Read the prompt on each suitcase.
2. Tap the reflection that belongs with that suitcase.
3. Check your matches and notice what clears when the baggage is claimed.`,
    component: BaggageClaimGame
  },
  {
    id: 'and-what-else',
    title: 'And What Else?',
    level: 'intermediate',
    duration: '10-20 min',
    description: 'Release layers of resentment - one partner shares, the other only says "And what else?"',
    instructions: `1. Partner 1 shares a resentment
2. Partner 2 only says "And what else?" - nothing else
3. Keep going until Partner 1 says "That's all"
4. Switch roles if desired`,
    component: AndWhatElseGame
  },
  {
    id: 'closeness-counter',
    title: 'Closeness Counter',
    level: 'intermediate',
    duration: '30-60 min',
    description: 'Match your physical distance to your emotional distance - a powerful embodiment practice.',
    instructions: `1. Rate how emotionally close you feel (1-10)
2. Maintain that physical distance for 30-60 minutes
3. Notice what shifts when distance becomes visible
4. Check in after the timer ends`,
    component: ClosenessCounterGame
  },
  {
    id: 'switch',
    title: 'Switch',
    level: 'advanced',
    duration: '10-15 min',
    description: 'Argue your partner\'s side better than they could - perspective-taking at its deepest.',
    instructions: `1. Pick a conflict you're having
2. Each person argues their own side (2-3 min)
3. Switch: argue your partner's side as convincingly as possible
4. Reflect on what you learned`,
    component: SwitchGame
  },
  {
    id: 'seven-nights',
    title: 'Seven Nights of Truth',
    level: 'advanced',
    duration: '7 nights × 5 min',
    description: 'Progressive vulnerability over seven nights - each night goes deeper than the last.',
    instructions: `1. Each night, answer one vulnerability prompt together
2. Take turns - one person shares, the other witnesses
3. No fixing, defending, or explaining - just listening
4. The prompts get progressively deeper each night`,
    component: SevenNightsGame
  },
  {
    id: 'bomb-squad',
    title: 'Bomb Squad',
    level: 'advanced',
    duration: '45 min',
    description: 'Defuse recurring fights by going beneath the surface - structured repair work.',
    instructions: `1. Pick ONE recurring fight
2. Follow 8 structured steps (45 min total)
3. Name the fight, find the Unders, discover what it's really about
4. Create a defusal agreement for next time`,
    component: BombSquadGame
  }
]

function levelAllowsGame(userLevel: GameLevel, gameLevel: GameLevel) {
  const order: GameLevel[] = ['beginner', 'intermediate', 'advanced']
  return order.indexOf(userLevel) >= order.indexOf(gameLevel)
}

export default function GameSelector({ level, requestedGameId, onGameLaunch, onGameComplete, onRequestHandled }: GameSelectorProps) {
  const [activeGameId, setActiveGameId] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, StoredProgress>>({})
  const [loadingProgress, setLoadingProgress] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const availableGames = useMemo(
    () => gamesCatalog.filter(game => levelAllowsGame(level, game.level)),
    [level]
  )

  const activeGame = useMemo(
    () => availableGames.find(game => game.id === activeGameId) ?? null,
    [availableGames, activeGameId]
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const stored = window.localStorage.getItem('ter-user-id')
    if (stored) {
      setUserId(stored)
      return
    }
    const newId = crypto.randomUUID()
    window.localStorage.setItem('ter-user-id', newId)
    setUserId(newId)
  }, [])

  const loadProgress = useCallback(async (resolvedUserId: string) => {
    setLoadingProgress(true)
    try {
      const client = getSupabaseClient()
      if (!client) {
        if (typeof window !== 'undefined') {
          const local = window.localStorage.getItem('ter-game-progress')
          if (local) {
            try {
              const parsed = JSON.parse(local) as Record<string, StoredProgress>
              setProgress(parsed)
            } catch (error) {
              console.warn('Unable to parse cached game progress', error)
            }
          }
        }
        return
      }

      const { data, error } = await client
        .from('game_progress')
        .select('game_id, completed, completed_at')
        .eq('user_id', resolvedUserId)

      if (error) {
        console.warn('Unable to load Supabase game progress', error)
        return
      }

      if (data) {
        const mapped: Record<string, StoredProgress> = {}
        ;(data as Array<{ game_id: string; completed: boolean | null; completed_at: string | null }>).forEach(entry => {
          mapped[entry.game_id] = {
            completed: Boolean(entry.completed ?? true),
            completedAt: entry.completed_at ?? undefined
          }
        })
        setProgress(mapped)
      }
    } finally {
      setLoadingProgress(false)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      loadProgress(userId)
    }
  }, [userId, loadProgress])

  useEffect(() => {
    if (!requestedGameId) {
      return
    }
    const game = availableGames.find(item => item.id === requestedGameId)
    if (game) {
      setActiveGameId(game.id)
      onGameLaunch?.(game.id)
    }
    onRequestHandled?.()
  }, [requestedGameId, availableGames, onGameLaunch, onRequestHandled])

  const persistProgress = useCallback(async (gameId: string, completedAt: string) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        [gameId]: {
          completed: true,
          completedAt
        }
      }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('ter-game-progress', JSON.stringify(updated))
      }
      return updated
    })

    if (!userId) {
      return
    }

    const client = getSupabaseClient()
    if (!client) {
      return
    }

    const { error } = await client
      .from('game_progress')
      .upsert(
        {
          user_id: userId,
          game_id: gameId,
          completed: true,
          completed_at: completedAt
        },
        {
          onConflict: 'user_id,game_id'
        }
      )

    if (error) {
      console.warn('Unable to save Supabase game progress', error)
    }
  }, [userId])

  const handleLaunchGame = useCallback((gameId: string) => {
    setActiveGameId(gameId)
    onGameLaunch?.(gameId)
  }, [onGameLaunch])

  const handleCompleteGame = useCallback(async (gameId: string) => {
    const timestamp = new Date().toISOString()
    await persistProgress(gameId, timestamp)
    onGameComplete?.(gameId)
  }, [persistProgress, onGameComplete])

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Choose a practice</h2>
          <p className="text-sm text-gray-600">Games adapt to your chosen growth edge. You are viewing {level} experiences.</p>
        </div>
        {loadingProgress ? (
          <span className="text-sm text-gray-500">Loading progress…</span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-ter-olive/10 px-3 py-1 text-sm font-medium text-ter-olive">
            <CheckCircle2 size={16} />
            {Object.values(progress).filter(value => value.completed).length} of {availableGames.length} completed
          </span>
        )}
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {availableGames.map(game => {
          const isActive = game.id === activeGameId
          const gameProgress = progress[game.id]
          return (
            <div key={game.id} className={`rounded-2xl border p-5 transition-shadow ${isActive ? 'border-ter-pink shadow-lg' : 'border-transparent bg-white shadow-sm'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{game.title}</h3>
                  <p className="text-sm text-gray-600">{game.description}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-ter-blue/10 px-2 py-1 text-xs font-medium text-ter-blue">
                  <Clock size={14} />
                  {game.duration}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {gameProgress?.completed ? (
                    <span>Last cleared {gameProgress.completedAt ? new Date(gameProgress.completedAt).toLocaleDateString() : 'recently'}</span>
                  ) : (
                    <span>Not started yet</span>
                  )}
                </div>
                <button
                  onClick={() => handleLaunchGame(game.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-ter-pink text-white shadow hover:bg-ter-pink/90'
                      : 'bg-gray-900 text-white hover:bg-gray-700'
                  }`}
                >
                  <Play size={16} />
                  {isActive ? 'Resume' : gameProgress?.completed ? 'Replay' : 'Play'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {activeGame && (
        <div className="rounded-3xl bg-gradient-to-br from-ter-pink/10 via-white to-ter-blue/10 p-6">
          <activeGame.component
            title={activeGame.title}
            level={activeGame.level}
            instructions={activeGame.instructions}
            onComplete={() => handleCompleteGame(activeGame.id)}
          />
        </div>
      )}
    </div>
  )
}
