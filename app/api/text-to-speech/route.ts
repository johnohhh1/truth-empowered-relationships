import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'alloy' } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    // If no API key, use browser's built-in TTS
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        fallback: true,
        message: 'Using browser text-to-speech' 
      })
    }

    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as any, // Options: alloy, echo, fable, onyx, nova, shimmer
      input: text,
      speed: 0.95, // Slightly slower for clarity
    })

    // Convert the response to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer())

    // Return the audio file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json({ 
      error: 'Text-to-speech failed',
      fallback: true 
    })
  }
}

export async function GET(request: NextRequest) {
  // Return available voices
  return NextResponse.json({
    voices: [
      { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
      { id: 'echo', name: 'Echo', description: 'Warm and conversational' },
      { id: 'fable', name: 'Fable', description: 'Expressive and dynamic' },
      { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
      { id: 'nova', name: 'Nova', description: 'Friendly and upbeat' },
      { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle' },
    ]
  })
}
