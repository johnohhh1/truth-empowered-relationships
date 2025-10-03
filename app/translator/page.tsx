'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, CheckCircle, Info, Loader2, ChevronDown, Mic, Volume2 } from 'lucide-react'
import { useSpeech } from '../hooks/useSpeech'
import Footer from '@/src/components/Footer'

type TranslationMode = 'TES' | 'TEL'

interface TESTranslation {
  noticing: string
  outer: string
  under: string
  why: string
  ask: string
  checks: {
    nonMeanness: boolean
    pillarsAligned: boolean
    instructionsFollowed: number[]
  }
  curiousQuestions?: string[]
}

interface TELTranslation {
  outer: string
  undercurrents: string
  whatMatters: string
  depthQuestions: string[]
  suggestedResponse?: string
  responseDisclaimer?: string
}

export default function TranslatorPage() {
  const [mode, setMode] = useState<TranslationMode>('TES')
  const [input, setInput] = useState('')
  const [translation, setTranslation] = useState<TESTranslation | TELTranslation | null>(null)
  const [loading, setLoading] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showChecks, setShowChecks] = useState(false)

  // Speech features
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

  // Voice input handler - FIXED to properly transcribe audio
  const handleVoiceInput = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording()
      if (audioBlob && audioBlob.size > 0) {
        const text = await transcribeAudio(audioBlob, mode)
        if (text) {
          setInput(text)
        }
      }
    } else {
      startRecording()
    }
  }

  // Speak translation
  const speakText = (text: string) => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speak(text)
    }
  }

  const handleTranslate = async () => {
    if (!input.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, input })
      })
      
      const data = await response.json()
      setTranslation(data)
    } catch (error) {
      console.error('Translation error:', error)
      // Set a mock translation for demo purposes
      if (mode === 'TES') {
        setTranslation({
          noticing: "I notice my chest feels tight and my jaw is clenched",
          outer: "When you said you'd be home by 6 and arrived at 8 without calling",
          under: "I'm afraid I don't matter enough for you to keep me informed",
          why: "Reliability and knowing I'm considered are how I feel valued",
          ask: "Can you text me when plans change, even if it's just a quick update?",
          checks: {
            nonMeanness: true,
            pillarsAligned: true,
            instructionsFollowed: [1, 5, 8]
          },
          curiousQuestions: [
            "What made it hard to call when plans changed?",
            "How can we make communication easier when things come up?"
          ]
        })
      } else {
        setTranslation({
          outer: "Partner arrived 2 hours later than mentioned",
          undercurrents: "Feeling unimportant, worried, possibly abandoned",
          whatMatters: "Being kept in the loop, feeling prioritized, trust",
          depthQuestions: [
            "What was happening for you when you realized you'd be late?",
            "What would help you communicate changes more easily?",
            "How did you imagine I was feeling while waiting?"
          ]
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const isTES = (trans: any): trans is TESTranslation => {
    return mode === 'TES' && trans && 'noticing' in trans
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-ter-gold">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-white hover:text-white/90">
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Link>
            <div className="flex items-center gap-2">
              <img src="/icon-192.png" alt="TER" className="w-8 h-8 rounded-lg opacity-90" />
              <h1 className="text-xl font-semibold text-white">Translation</h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-4">
          <p className="text-white/90 text-sm">Truth-Empowered Speaking & Listening</p>
        </div>
      </header>

      {/* Mode Selector */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <button
            onClick={() => { setMode('TES'); setTranslation(null); }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'TES' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            TES
          </button>
          <button
            onClick={() => { setMode('TEL'); setTranslation(null); }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'TEL' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            TEL
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <label className="block text-gray-700 font-medium mb-3">
              {mode === 'TES' ? 'What do you want to say?' : 'What did your partner say?'}
            </label>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'TES' 
                  ? "Type here... (or click mic to speak)"
                  : "Type or click mic to record..."
                }
                className="textarea pr-12"
                rows={4}
                disabled={isRecording || transcribing}
              />
              <button
                onClick={handleVoiceInput}
                disabled={transcribing}
                className={`absolute right-3 top-3 p-2 rounded-full transition-colors ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : transcribing
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isRecording ? 'Stop recording' : transcribing ? 'Transcribing...' : 'Voice input'}
              >
                {transcribing ? <Loader2 size={20} className="animate-spin" /> : <Mic size={20} />}
              </button>
            </div>
            
            {isRecording && (
              <div className="mt-2 text-sm text-red-600 flex items-center">
                <span className="animate-pulse mr-2">●</span>
                Recording... Click mic again to stop
              </div>
            )}
            
            {transcribing && (
              <div className="mt-2 text-sm text-blue-600 flex items-center">
                <Loader2 size={14} className="animate-spin mr-2" />
                Transcribing audio...
              </div>
            )}
            
            {mode === 'TES' && (
              <div className="flex gap-3 mt-3 text-sm">
                <button 
                  onClick={() => setShowChecks(!showChecks)}
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <CheckCircle size={16} className="mr-1" />
                  Non-Meanness ✓
                </button>
                <button className="text-gray-500 hover:text-gray-600">
                  Instruction check
                </button>
                <button className="text-gray-500 hover:text-gray-600">
                  Pillars check
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleTranslate}
            disabled={loading || !input.trim() || isRecording || transcribing}
            className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Translating...
              </>
            ) : (
              'Translate'
            )}
          </button>
        </div>
      </div>

      {/* Translation Results */}
      {translation && (
        <div className="container mx-auto px-4 mt-8 pb-8">
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">
                {mode === 'TES' ? 'Truth-Empowered Speaking (TES)' : 'Truth-Empowered Listening (TEL)'}
              </h2>

              {isTES(translation) ? (
                // TES Results
                <div className="space-y-4">
                  <div className="border-l-4 border-ter-blue pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-gray-600">Noticing (Inner)</div>
                      <button
                        onClick={() => speakText(translation.noticing)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Read aloud"
                      >
                        <Volume2 size={16} className={isSpeaking ? 'text-ter-blue animate-pulse' : 'text-gray-500'} />
                      </button>
                    </div>
                    <div className="text-gray-900">{translation.noticing}</div>
                  </div>

                  <div className="border-l-4 border-ter-gold pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-gray-600">Words (Outer)</div>
                      <button
                        onClick={() => speakText(translation.outer)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Read aloud"
                      >
                        <Volume2 size={16} className={isSpeaking ? 'text-ter-gold animate-pulse' : 'text-gray-500'} />
                      </button>
                    </div>
                    <div className="text-gray-900">{translation.outer}</div>
                  </div>

                  <div className="border-l-4 border-ter-coral pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-gray-600">Under (What I Fear)</div>
                      <button
                        onClick={() => speakText(translation.under)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Read aloud"
                      >
                        <Volume2 size={16} className={isSpeaking ? 'text-ter-coral animate-pulse' : 'text-gray-500'} />
                      </button>
                    </div>
                    <div className="text-gray-900">{translation.under}</div>
                  </div>

                  <div className="border-l-4 border-ter-olive pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-gray-600">Why (Need/Value)</div>
                      <button
                        onClick={() => speakText(translation.why)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Read aloud"
                      >
                        <Volume2 size={16} className={isSpeaking ? 'text-ter-olive animate-pulse' : 'text-gray-500'} />
                      </button>
                    </div>
                    <div className="text-gray-900">{translation.why}</div>
                  </div>

                  <div className="border-l-4 border-ter-lavender pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-gray-600">Ask (Clear & Kind)</div>
                      <button
                        onClick={() => speakText(translation.ask)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Read aloud"
                      >
                        <Volume2 size={16} className={isSpeaking ? 'text-ter-lavender animate-pulse' : 'text-gray-500'} />
                      </button>
                    </div>
                    <div className="text-gray-900">{translation.ask}</div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => {
                        const text = `Noticing: ${translation.noticing}\n\nWords: ${translation.outer}\n\nUnder: ${translation.under}\n\nWhy: ${translation.why}\n\nAsk: ${translation.ask}`
                        copyToClipboard(text, 'all')
                      }}
                      className="btn-secondary flex items-center"
                    >
                      {copiedField === 'all' ? (
                        <>
                          <CheckCircle size={16} className="mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="mr-2" />
                          Copy
                        </>
                      )}
                    </button>
                    <button className="btn-secondary">
                      Open in Mediator
                    </button>
                    {translation.curiousQuestions && (
                      <button className="btn-secondary">
                        Curious Questions ({translation.curiousQuestions.length})
                      </button>
                    )}
                  </div>

                  {translation.curiousQuestions && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Curious Questions to Deepen:
                      </div>
                      <ul className="space-y-2">
                        {translation.curiousQuestions.map((q, i) => (
                          <li key={i} className="text-gray-600 text-sm">
                            • {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                // TEL Results
                <div className="space-y-4">
                  <div className="border-l-4 border-ter-gold pl-4">
                    <div className="text-sm text-gray-600 mb-1">Words (Outer)</div>
                    <div className="text-gray-900">{(translation as TELTranslation).outer}</div>
                  </div>

                  <div className="border-l-4 border-ter-blue pl-4">
                    <div className="text-sm text-gray-600 mb-1">Undercurrents (Inner)</div>
                    <div className="text-gray-900">{(translation as TELTranslation).undercurrents}</div>
                  </div>

                  <div className="border-l-4 border-ter-olive pl-4">
                    <div className="text-sm text-gray-600 mb-1">What Matters (Values)</div>
                    <div className="text-gray-900">{(translation as TELTranslation).whatMatters}</div>
                  </div>

                  <div className="border-l-4 border-ter-lavender pl-4">
                    <div className="text-sm text-gray-600 mb-1">Depth Questions</div>
                    <ul className="space-y-2">
                      {(translation as TELTranslation).depthQuestions.map((q, i) => (
                        <li key={i} className="text-gray-900">
                          {i + 1}. {q}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(translation as TELTranslation).suggestedResponse && (
                    <div className="border-l-4 border-ter-pink pl-4 bg-ter-pink/10 p-4 rounded-r-lg">
                      <div className="text-sm text-gray-600 mb-2">Suggested Response</div>
                      <div className="text-gray-900 mb-2">{(translation as TELTranslation).suggestedResponse}</div>
                      {(translation as TELTranslation).responseDisclaimer && (
                        <div className="text-xs text-gray-500 italic">{(translation as TELTranslation).responseDisclaimer}</div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => {
                        const trans = translation as TELTranslation
                        const text = `Outer: ${trans.outer}\n\nUndercurrents: ${trans.undercurrents}\n\nWhat Matters: ${trans.whatMatters}\n\nDepth Questions:\n${trans.depthQuestions.map((q, i) => `${i+1}. ${q}`).join('\n')}`
                        copyToClipboard(text, 'all')
                      }}
                      className="btn-secondary flex items-center"
                    >
                      {copiedField === 'all' ? (
                        <>
                          <CheckCircle size={16} className="mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="mr-2" />
                          Copy
                        </>
                      )}
                    </button>
                    <button className="btn-secondary">
                      Try Another Way
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Try Another Translation */}
            <button 
              onClick={() => setTranslation(null)}
              className="w-full mt-4 text-gray-600 hover:text-gray-900 text-sm"
            >
              Try another translation →
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
