'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Mic, PauseCircle, Volume2 } from 'lucide-react'
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
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Aria Voice Companion</h2>
          <p className="text-sm text-gray-600">Ask for reflections, depth prompts, or say “Play Baggage Claim” to launch a game.</p>
        </div>
        <div className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
          isRecording ? 'bg-ter-pink text-white shadow-lg' : active ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          <button
            type="button"
            onClick={handleToggleRecording}
            disabled={!active}
            className="flex h-full w-full items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ter-pink/50"
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? <PauseCircle size={24} /> : <Mic size={24} />}
          </button>
          {isRecording && (
            <span
              className="absolute -bottom-3 h-3 w-3 animate-ping rounded-full bg-ter-pink"
              aria-hidden="true"
            />
          )}
        </div>
      </header>

      <div className="mb-4 h-40 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm italic text-gray-500">{placeholderMessage}</p>
        ) : (
          messages.map(message => (
            <div
              key={message.timestamp}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-ter-blue text-white'
                    : 'bg-white text-gray-800 shadow'
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Volume2 size={16} />
          {isSpeaking ? 'Speaking response…' : 'Responses will play aloud.'}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {isRecording && (
            <div className="flex items-center gap-1">
              <span className="relative inline-flex h-2 w-8 overflow-hidden rounded-full bg-ter-pink/20">
                <span
                  className="absolute inset-y-0 left-0 bg-ter-pink transition-all duration-150"
                  style={{ width: `${Math.max(10, waveformLevel * 100)}%` }}
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
        </div>
      </div>
    </div>
  )
}
