import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { audioBlob, speaker } = body

    // For now, return mock data since we need Whisper API for transcription
    // TODO: Implement real transcription with OpenAI Whisper

    const mockAnalysis = {
      transcript: "Mock transcription - OpenAI Whisper integration needed",
      telSummary: {
        outer: "Partner expressed frustration about a situation",
        undercurrents: "Feeling unheard, possibly hurt or disconnected",
        whatMatters: "Being understood and having their perspective valued"
      },
      depthQuestions: [
        "What was most important for you in this moment?",
        "How did you experience that interaction?",
        "What would help you feel more connected?"
      ],
      suggestedGame: {
        name: "Internal Weather Report",
        duration: "2-3 min",
        description: "Share your emotional state using weather metaphors"
      }
    }

    return NextResponse.json(mockAnalysis)
  } catch (error) {
    console.error('Mediator API error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}
