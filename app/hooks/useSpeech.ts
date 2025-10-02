import { useState, useRef, useCallback } from 'react'

export function useSpeech() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcribing, setTranscribing] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      return true
    } catch (error) {
      console.error('Error accessing microphone:', error)
      return false
    }
  }, [])

  // Stop recording and return blob
  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          resolve(blob)
        }
        
        mediaRecorderRef.current.stop()
        setIsRecording(false)
        
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      } else {
        resolve(new Blob())
      }
    })
  }, [isRecording])

  // Transcribe audio using Whisper API
  const transcribeAudio = useCallback(async (blob: Blob, mode: 'TES' | 'TEL' = 'TES'): Promise<string> => {
    setTranscribing(true)
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')
      formData.append('mode', mode)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      return data.text || ''
    } catch (error) {
      console.error('Transcription error:', error)
      
      // Fallback to browser's Web Speech API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        return new Promise((resolve) => {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
          const recognition = new SpeechRecognition()
          
          recognition.continuous = false
          recognition.interimResults = false
          recognition.lang = 'en-US'
          
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            resolve(transcript)
          }
          
          recognition.onerror = () => {
            resolve('')
          }
          
          recognition.start()
        })
      }
      
      return ''
    } finally {
      setTranscribing(false)
    }
  }, [])

  // Text-to-speech with OpenAI or fallback
  const speak = useCallback(async (text: string, voice: string = 'alloy') => {
    try {
      // Try OpenAI TTS first
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice })
      })

      if (response.headers.get('Content-Type')?.includes('audio')) {
        // Got audio from OpenAI
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        
        if (audioRef.current) {
          audioRef.current.pause()
        }
        
        audioRef.current = new Audio(url)
        audioRef.current.onplay = () => setIsPlaying(true)
        audioRef.current.onended = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(url)
        }
        
        await audioRef.current.play()
      } else {
        // Fallback to browser TTS
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel()
          
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.rate = 0.9
          utterance.pitch = 1
          utterance.volume = 1
          
          utterance.onstart = () => setIsPlaying(true)
          utterance.onend = () => setIsPlaying(false)
          
          window.speechSynthesis.speak(utterance)
        }
      }
    } catch (error) {
      console.error('TTS error:', error)
      
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        window.speechSynthesis.speak(utterance)
      }
    }
  }, [])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    
    setIsPlaying(false)
  }, [])

  return {
    isRecording,
    isPlaying,
    recordingTime,
    transcribing,
    startRecording,
    stopRecording,
    transcribeAudio,
    speak,
    stopSpeaking,
  }
}
