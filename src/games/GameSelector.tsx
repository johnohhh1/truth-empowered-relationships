'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Clock, Play } from 'lucide-react'
import BaggageClaimGame, { GameComponentProps, GameLevel } from './BaggageClaimGame'
import { getSupabaseClient } from '@/src/lib/supabaseClient'

interface GameDefinition {
  id: string
  title: string
  level: GameLevel
  duration: string
  description: string
  instructions: string
  component: (props: GameComponentProps) => JSX.Element
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
    id: 'baggage-claim',
    title: 'Baggage Claim',
    level: 'beginner',
    duration: '6 min',
    description: 'Sort the stories, impacts, and needs so you can hand your baggage to the right carousel.',
    instructions: `1. Read the prompt on each suitcase.
2. Tap the reflection that belongs with that suitcase.
3. Check your matches and notice what clears when the baggage is claimed.`,
    component: BaggageClaimGame
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
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-semibold text-gray-900">Choose a practice</h2>
          <p className="text-sm text-gray-600">Games adapt to your chosen growth edge. You are viewing {level} experiences.</p>
          <p className="text-xs uppercase tracking-[0.16em] text-ter-blue">Say “Play Baggage Claim” and Aria will open it for you.</p>
        </div>
        {loadingProgress ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-sm font-medium text-gray-500 shadow-sm">
            Loading progress…
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-ter-olive/20 px-4 py-2 text-sm font-semibold text-ter-olive shadow-sm">
            <CheckCircle2 size={16} />
            {Object.values(progress).filter(value => value.completed).length} of {availableGames.length} completed
          </span>
        )}
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {availableGames.map(game => {
          const isActive = game.id === activeGameId
          const gameProgress = progress[game.id]
          return (
            <div
              key={game.id}
              className={`group relative overflow-hidden rounded-[28px] border p-6 transition-all ${
                isActive
                  ? 'border-ter-pink/80 bg-white/95 shadow-xl shadow-ter-pink/20'
                  : 'border-gray-200/70 bg-white/90 shadow-sm hover:shadow-lg'
              }`}
            >
              <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-ter-blue/10 px-3 py-1 text-xs font-semibold text-ter-blue">
                <Clock size={14} />
                {game.duration}
              </div>
              <div className="pr-20">
                <h3 className="text-lg font-semibold text-gray-900">{game.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{game.description}</p>
              </div>
              <p className="mt-4 text-xs text-gray-500">{game.instructions.split('\n')[0]}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-gray-500">
                  {gameProgress?.completed ? (
                    <span>Last cleared {gameProgress.completedAt ? new Date(gameProgress.completedAt).toLocaleDateString() : 'recently'}</span>
                  ) : (
                    <span>Not started yet</span>
                  )}
                </div>
                <button
                  onClick={() => handleLaunchGame(game.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-ter-pink text-white shadow hover:bg-ter-pink/90'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
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
        <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-ter-pink/15 via-white to-ter-blue/15 p-[1px] shadow-xl">
          <div className="rounded-[34px] bg-white/95 p-6">
            <activeGame.component
              title={activeGame.title}
              level={activeGame.level}
              instructions={activeGame.instructions}
              onComplete={() => handleCompleteGame(activeGame.id)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
