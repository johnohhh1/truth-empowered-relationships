'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Mic, PauseCircle, Send, Volume2 } from 'lucide-react'
import { useSpeech } from '@/app/hooks/useSpeech'

interface VoiceMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface VoiceChatProps {
  active: boolean
  onStartGame?: (gameId: string) => void
}

export default function VoiceChat({ active, onStartGame }: VoiceChatProps) {
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [waveformLevel, setWaveformLevel] = useState(0)
  const [draft, setDraft] = useState('')

  const {
    isRecording,
    isSpeaking,
    transcribing,
    startRecording,
    stopRecording,
    transcribeAudio,
    speak,
    stopSpeaking
  } = useSpeech()

  useEffect(() => {
    let animation: ReturnType<typeof setInterval> | null = null
    if (isRecording) {
      animation = setInterval(() => {
        setWaveformLevel(Math.random())
      }, 120)
    } else {
      setWaveformLevel(0)
    }
    return () => {
      if (animation) {
        clearInterval(animation)
      }
    }
  }, [isRecording])

  const pushMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [
      ...prev,
      {
        role,
        content,
        timestamp: new Date().toISOString()
      }
    ])
  }, [])

  const handleSend = useCallback(async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed) {
      return
    }

    pushMessage('user', trimmed)
    setError(null)
    setIsProcessing(true)
    setDraft('')

    try {
      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: trimmed, timestamp: new Date().toISOString() }
          ].map(({ role, content }) => ({ role, content }))
        })
      })

      const data: { reply: string; intent?: string | null; gameId?: string | null } = await response.json()
      const assistantReply = data.reply?.trim() || 'I am here with you.'
      pushMessage('assistant', assistantReply)

      if (data.intent === 'start_game' && data.gameId) {
        onStartGame?.(data.gameId)
      }

      if (assistantReply) {
        if (isSpeaking) {
          stopSpeaking()
        }
        await speak(assistantReply)
      }
    } catch (err) {
      console.error('Voice chat error', err)
      setError('I had trouble reaching Aria. Try again in a moment.')
    } finally {
      setIsProcessing(false)
    }
  }, [messages, onStartGame, pushMessage, speak, stopSpeaking, isSpeaking])

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft.trim()) {
      return
    }
    await handleSend(draft)
  }, [draft, handleSend])

  const handleToggleRecording = useCallback(async () => {
    if (!active) {
      return
    }

    if (isRecording) {
      const audioBlob = await stopRecording()
      if (audioBlob && audioBlob.size > 0) {
        const transcript = await transcribeAudio(audioBlob)
        if (transcript) {
          await handleSend(transcript)
        }
      }
    } else {
      const granted = await startRecording()
      if (!granted) {
        setError('Microphone permission is required for voice mode.')
      }
    }
  }, [active, handleSend, isRecording, startRecording, stopRecording, transcribeAudio])

  const placeholderMessage = useMemo(() => {
    if (!active) {
      return 'Enable voice mode to talk with Aria.'
    }
    if (isRecording) {
      return 'Listening… share what is present or ask for a practice.'
    }
    if (isProcessing || transcribing) {
      return 'Processing…'
    }
    return 'Tap the microphone to begin.'
  }, [active, isProcessing, isRecording, transcribing])

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-white via-ter-blue/10 to-ter-pink/10 p-[1px] shadow-xl">
      <div className="rounded-[30px] bg-white/90 p-6 backdrop-blur">
        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Aria Voice Companion</h2>
            <p className="text-sm text-gray-600">Ask for reflections, depth prompts, or say “Play Baggage Claim” to launch a game.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all ${
              isRecording
                ? 'border-ter-pink/60 bg-ter-pink text-white shadow-lg shadow-ter-pink/30'
                : active
                  ? 'border-gray-900/50 bg-gray-900 text-white shadow'
                  : 'border-gray-200 bg-gray-100 text-gray-400'
            }`}>
              <button
                type="button"
                onClick={handleToggleRecording}
                disabled={!active}
                className="flex h-full w-full items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ter-pink/50 disabled:cursor-not-allowed"
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              >
                {isRecording ? <PauseCircle size={26} /> : <Mic size={26} />}
              </button>
              {isRecording && (
                <span
                  className="absolute -bottom-3 h-3 w-3 animate-ping rounded-full bg-ter-pink"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="hidden flex-col text-xs text-gray-500 sm:flex">
              <span className="font-semibold uppercase tracking-wide text-gray-400">Voice Mode</span>
              <span>{active ? (isRecording ? 'Listening…' : 'Ready to receive') : 'Toggle on to speak with Aria'}</span>
            </div>
          </div>
        </header>

        <div className="mb-4 h-52 overflow-y-auto rounded-2xl border border-gray-200/70 bg-gray-50/70 p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm italic text-gray-500">{placeholderMessage}</p>
          ) : (
            messages.map(message => (
              <div
                key={message.timestamp}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    message.role === 'user'
                      ? 'bg-ter-blue text-white'
                      : 'bg-white/90 text-gray-800 shadow'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-700">Type to talk instead</span>
            <textarea
              value={draft}
              onChange={event => setDraft(event.target.value)}
              placeholder={active ? 'Share what is present for you or ask Aria to suggest a practice…' : 'Enable voice mode or type to chat with Aria.'}
              className="min-h-[72px] resize-y rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-sm text-gray-700 shadow-inner focus:border-ter-pink focus:outline-none focus:ring-2 focus:ring-ter-pink/40"
              disabled={isProcessing}
            />
          </label>
          <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Volume2 size={16} />
              {isSpeaking ? 'Speaking response…' : 'Responses will play aloud.'}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              {isRecording && (
                <div className="flex items-center gap-1">
                  <span className="relative inline-flex h-2 w-14 overflow-hidden rounded-full bg-ter-pink/20">
                    <span
                      className="absolute inset-y-0 left-0 bg-ter-pink transition-all duration-150"
                      style={{ width: `${Math.max(16, waveformLevel * 100)}%` }}
                    />
                  </span>
                  Listening…
                </div>
              )}
              {(isProcessing || transcribing) && (
                <span className="inline-flex items-center gap-2 text-ter-pink">
                  <Loader2 size={16} className="animate-spin" />
                  Working
                </span>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                disabled={isProcessing || !draft.trim()}
              >
                <Send size={16} />
                Send to Aria
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
