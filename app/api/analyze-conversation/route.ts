import { NextRequest, NextResponse } from 'next/server'
import { analyzeMediatorSession } from '@/src/lib/terAssistant'

export async function POST(request: NextRequest) {
  try {
    const { transcript, speaker, duration } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      // Return mock analysis if no API key
      return NextResponse.json(getMockAnalysis())
    }

    // Use the assistant with vectorized TER book knowledge
    const result = await analyzeMediatorSession(transcript, speaker, duration)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(getMockAnalysis())
  }
}

function getMockAnalysis() {
  return {
    telSummary: {
      outer: "Partner shared concerns about communication patterns and feeling disconnected",
      undercurrents: "Fear of not mattering, worry about growing apart, loneliness even when together. The Under: fear of abandonment or inadequacy.",
      whatMatters: "Being truly seen and heard, emotional safety, genuine connection, reassurance of being chosen"
    },
    depthQuestions: [
      "Would you share what it feels like in your body when you sense I'm not fully present?",
      "What helps you know that you matter to me, even when we're struggling?",
      "How can I show up in a way that would help you feel safe to share what's tender?"
    ],
    suggestedGame: {
      name: "Internal Weather Report",
      duration: "2-3 min",
      description: "Share your emotional state using weather metaphors - no fixing, just witnessing",
      rationale: "Starting with a simple emotional check-in can help both partners feel seen without the pressure of solving anything"
    }
  }
}
