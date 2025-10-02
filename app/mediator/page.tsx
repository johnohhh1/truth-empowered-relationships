'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mic, Square, Play, Loader2, ChevronRight, Clock } from 'lucide-react'

interface TELSummary {
  outer: string
  undercurrents: string
  whatMatters: string
}

interface MediatorAnalysis {
  transcript: string
  telSummary: TELSummary
  depthQuestions: string[]
  suggestedGame: {
    name: string
    duration: string
    description: string
  }
}

export default function MediatorPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysis, setAnalysis] = useState<MediatorAnalysis | null>(null)
  const [speaker, setSpeaker] = useState<'you' | 'partner'>('you')
  const [recordingTime, setRecordingTime] = useState(0)
  const [showConsent, setShowConsent] = useState(true)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 59) {
            stopRecording()
            return 60
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setAnalysis(null)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please allow microphone access to use the Mediator')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleAnalyze = async () => {
    if (!audioBlob) return

    setIsProcessing(true)
    try {
      // In a real app, this would upload the audio and get analysis
      // For demo, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock analysis result
      setAnalysis({
        transcript: "When you walked out, my chest tightened and I told myself I don't matter. I keep replaying last week and thought, 'Here we go again.'",
        telSummary: {
          outer: "I felt dismissed when plans changed.",
          undercurrents: "fear of not mattering / being deprioritized.",
          whatMatters: "needs reliability and reassurance of being chosen."
        },
        depthQuestions: [
          "Would you share what felt most tender in that moment?",
          "Is there a way I could offer reassurance that would really land?",
          "What meaning did you give me leaving the room just then?"
        ],
        suggestedGame: {
          name: "Internal Weather Report",
          duration: "2 min each",
          description: "Share your emotional state using weather metaphors"
        }
      })
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-ter-olive">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-white hover:text-white/90">
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Link>
            <h1 className="text-xl font-semibold text-white">Mediator (Beta)</h1>
            <div className="w-20"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-4">
          <p className="text-white/90 text-sm">
            {analysis ? `Segment analyzed • ${recordingTime}s` : 'Push to transcribe a turn (15-60s)'}
          </p>
        </div>
      </header>

      {/* Consent Notice */}
      {showConsent && !analysis && (
        <div className="container mx-auto px-4 mt-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4 text-sm text-gray-600">
              Both of you consent to transcribe this segment. 
              <button 
                onClick={() => setShowConsent(false)}
                className="ml-2 text-gray-500 underline"
              >
                Change in Settings.
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recording Section */}
      {!analysis && (
        <div className="container mx-auto px-4 mt-8">
          <div className="max-w-2xl mx-auto">
            <div className="card">
              {/* Recording Button */}
              <div className="flex flex-col items-center py-8">
                <button
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  disabled={isProcessing}
                  className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                    isRecording 
                      ? 'bg-red-500 scale-110 recording-pulse' 
                      : 'bg-white border-4 border-ter-olive hover:scale-105'
                  }`}
                >
                  {isRecording ? (
                    <Square size={40} className="text-white" />
                  ) : (
                    <Mic size={40} className="text-ter-olive" />
                  )}
                </button>

                <p className="mt-6 text-gray-600 font-medium">
                  {isRecording ? 'Release to stop' : 'Hold to record'} • Release to analyze
                </p>

                {isRecording && (
                  <div className="mt-4 text-2xl font-mono text-gray-900">
                    {formatTime(recordingTime)} / 1:00
                  </div>
                )}

                {/* Speaker Selection */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSpeaker('you')}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      speaker === 'you' 
                        ? 'bg-ter-olive text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    You speaking
                  </button>
                  <button
                    onClick={() => setSpeaker('partner')}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      speaker === 'partner' 
                        ? 'bg-ter-olive text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Partner speaking
                  </button>
                </div>

                {/* Audio Preview */}
                {audioUrl && !isRecording && (
                  <div className="mt-6 w-full">
                    <audio controls src={audioUrl} className="w-full" />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleAnalyze}
                        disabled={isProcessing}
                        className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Analyzing...
                          </>
                        ) : (
                          'Analyze'
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setAudioBlob(null)
                          setAudioUrl(null)
                          setRecordingTime(0)
                        }}
                        className="btn-secondary"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Processing State */}
            {isProcessing && (
              <div className="card mt-4">
                <div className="text-center py-8">
                  <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                  <p className="font-medium text-gray-900 mb-2">Analyzing your moment...</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• Transcribing audio</p>
                    <p>• Understanding emotions</p>
                    <p>• Suggesting next steps</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="container mx-auto px-4 mt-6 pb-8">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Transcript */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">
                {speaker === 'you' ? 'You said' : 'Partner said'}
              </h3>
              <p className="text-gray-700 italic">"{analysis.transcript}"</p>
            </div>

            {/* TEL Summary */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Truth-Empowered Listening (TEL) Summary
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Words (Outer):</span>
                  <p className="text-gray-900 mt-1">"{analysis.telSummary.outer}"</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Undercurrent (Inner):</span>
                  <p className="text-gray-900 mt-1">{analysis.telSummary.undercurrents}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Why (Value):</span>
                  <p className="text-gray-900 mt-1">{analysis.telSummary.whatMatters}</p>
                </div>
              </div>
            </div>

            {/* Depth Questions */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">
                Depth Questions (pick one)
              </h3>
              <ul className="space-y-3">
                {analysis.depthQuestions.map((q, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span className="text-gray-700">{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Game */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Suggested Game</h3>
              <div className="flex items-center justify-between p-4 bg-ter-blue/10 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{analysis.suggestedGame.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {analysis.suggestedGame.duration} • {analysis.suggestedGame.description}
                  </p>
                </div>
                <button className="btn-secondary text-sm">
                  Open Game
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link href="/translator" className="flex-1">
                <button className="w-full btn-secondary">
                  Translate my reply
                </button>
              </Link>
              <button 
                onClick={() => {
                  setAnalysis(null)
                  setAudioBlob(null)
                  setAudioUrl(null)
                  setRecordingTime(0)
                }}
                className="flex-1 btn-primary"
              >
                Record next turn
              </button>
            </div>

            {/* Tip */}
            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p className="font-medium mb-1">💡 Tip:</p>
              <p>Pause after 30-45s. We'll show a TEL summary + 2 depth questions.</p>
              <p className="mt-2 text-gray-500">
                Repair tools (Translation & Mediator) are always available.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
