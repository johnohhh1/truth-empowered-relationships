import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const mode = formData.get('mode') as string

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // If no API key, return mock transcription
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        text: mode === 'TES' 
          ? "I feel frustrated when you don't listen to me" 
          : "You never help with anything around the house" 
      })
    }

    // Convert File to proper format for OpenAI
    const bytes = await audioFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create a File-like object that OpenAI SDK expects
    const file = new File([buffer], 'audio.webm', { type: 'audio/webm' })

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en',
      prompt: mode === 'TES' 
        ? 'Transcribe this emotional expression about a relationship issue.'
        : 'Transcribe what someone said to their partner.',
    })

    return NextResponse.json({ text: transcription.text })

  } catch (error) {
    console.error('Transcription error:', error)
    
    // Fallback response
    return NextResponse.json({ 
      text: "I need to talk about something that's been bothering me",
      error: 'Transcription failed, using fallback' 
    })
  }
}
