import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { analyzeMediatorSession } from '@/src/lib/terAssistant'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { audioBlob, speaker, duration } = body

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    // Convert base64 to buffer
    const base64Data = audioBlob.split(',')[1]
    const audioBuffer = Buffer.from(base64Data, 'base64')

    // Create a File object for Whisper
    const audioFile = new File([audioBuffer], 'recording.webm', { type: 'audio/webm' })

    // Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en'
    })

    const transcript = transcription.text

    // Analyze with TER Assistant
    const analysis = await analyzeMediatorSession(transcript, speaker, duration)

    return NextResponse.json({
      transcript,
      ...analysis
    })
  } catch (error) {
    console.error('Mediator API error:', error)

    // Return mock data as fallback
    return NextResponse.json({
      transcript: "Transcription unavailable - check API configuration",
      telSummary: {
        outer: "Recorded conversation segment",
        undercurrents: "Unable to analyze without transcription",
        whatMatters: "Connection and understanding"
      },
      depthQuestions: [
        "What was most important in this moment?",
        "How did you experience this?",
        "What would help you feel more connected?"
      ],
      suggestedGame: {
        name: "Internal Weather Report",
        duration: "2-3 min",
        description: "Share your emotional state"
      }
    })
  }
}
