import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

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

  return { intent: null, gameId: null }
}

function getMockResponse(userText?: string | null) {
  const intent = detectIntentFromText(userText)
  if (intent.intent === 'start_game') {
    return {
      reply: 'Opening the Baggage Claim practice so you can sort stories, impacts, and needs together.',
      ...intent
    }
  }

  return {
    reply: 'I hear you. Would you like a reflection, a grounding prompt, or to start a practice like Baggage Claim?',
    ...intent
  }
}

function buildSystemPrompt() {
  return `You are Aria, a compassionate Truth Empowered Relationships assistant. You listen deeply, reflect concisely, and suggest embodied practices when useful. If the user asks to "play" or "start" a specific game, acknowledge it and end with a gentle invitation to begin. Keep responses under 120 words.`
}

async function runAssistant(messages: ChatMessage[]) {
  const assistantId = process.env.OPENAI_ARIA_ASSISTANT_ID || process.env.OPENAI_ASSISTANT_ID
  if (!assistantId) {
    return null
  }

  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: assistantId,
      thread: {
        messages: messages.map(message => ({
          role: message.role,
          content: message.content
        }))
      }
    })

    const finalRun = await openai.beta.threads.runs.poll(run.thread_id, run.id, { pollIntervalMs: 500 })

    if (finalRun.status !== 'completed') {
      return null
    }

    const threadHistory = await openai.beta.threads.messages.list(run.thread_id, {
      order: 'desc',
      limit: 10
    })

    const assistantMessage = threadHistory.data.find(entry => entry.role === 'assistant')
    if (!assistantMessage) {
      return null
    }

    const reply = (assistantMessage.content || [])
      .map((part: any) => {
        if (part.type === 'text') {
          return part.text?.value ?? ''
        }
        return ''
      })
      .filter(Boolean)
      .join('\n')
      .trim()

    return reply || null
  } catch (error) {
    console.error('Assistant run error', error)
    return null
  }
}

async function runChatCompletion(messages: ChatMessage[]) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      ...messages
    ],
    temperature: 0.6
  })

  return (
    completion.choices[0]?.message?.content?.trim() ||
    'I am here with you. Would you like to try a practice together?'
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
          .filter((message: any) => message?.content)
          .map((message: any) => ({
            role: message.role === 'assistant' ? 'assistant' : 'user',
            content: String(message.content)
          }))
      : []

    const lastUserMessage = [...messages].reverse().find(message => message.role === 'user')?.content
    const intent = detectIntentFromText(lastUserMessage)

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(getMockResponse(lastUserMessage))
    }

    const assistantReply = await runAssistant(messages)
    const reply = assistantReply ?? (await runChatCompletion(messages))

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
