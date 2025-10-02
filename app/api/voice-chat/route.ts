import { NextRequest, NextResponse } from 'next/server'
import { chatWithAria } from '@/src/lib/terAssistant'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface VoiceIntent {
  intent: 'start_game' | null
  gameId: string | null
}

function detectIntentFromText(text?: string | null): VoiceIntent {
  if (!text) {
    return { intent: null, gameId: null }
  }

  const normalized = text.toLowerCase()

  if (normalized.includes('baggage')) {
    return { intent: 'start_game', gameId: 'baggage-claim' }
  }
  if (normalized.includes('weather report') || normalized.includes('iwr')) {
    return { intent: 'start_game', gameId: 'internal-weather-report' }
  }
  if (normalized.includes('pause')) {
    return { intent: 'start_game', gameId: 'pause' }
  }
  if (normalized.includes('pillar talk')) {
    return { intent: 'start_game', gameId: 'pillar-talk' }
  }

  return { intent: null, gameId: null }
}

function getMockResponse(userText?: string | null) {
  const intent = detectIntentFromText(userText)
  if (intent.intent === 'start_game') {
    return {
      reply: `Opening the ${intent.gameId?.replace('-', ' ')} practice so you can work through it together.`,
      ...intent
    }
  }

  return {
    reply: 'I hear you. Would you like a reflection, a grounding prompt, or to start a practice like Internal Weather Report?',
    ...intent
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages.filter((message: any) => message?.content).map((message: any) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: String(message.content)
      }))
      : []

    const lastUserMessage = [...messages].reverse().find(message => message.role === 'user')?.content
    const intent = detectIntentFromText(lastUserMessage)

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(getMockResponse(lastUserMessage))
    }

    // Use the assistant with vectorized TER book knowledge
    const reply = await chatWithAria(messages)

    return NextResponse.json({
      reply,
      intent: intent.intent,
      gameId: intent.gameId
    })
  } catch (error) {
    console.error('Voice chat error', error)
    return NextResponse.json(getMockResponse(''), { status: 200 })
  }
}
