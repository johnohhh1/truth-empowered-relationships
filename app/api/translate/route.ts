import { NextRequest, NextResponse } from 'next/server'
import { translateWithAssistant } from '@/src/lib/terAssistant'

export async function POST(request: NextRequest) {
  let mode: 'TES' | 'TEL' = 'TES'
  let input: string = ''

  try {
    const body = await request.json()
    mode = (body.mode === 'TEL' ? 'TEL' : 'TES')
    input = body.input || ''

    if (!process.env.OPENAI_API_KEY) {
      // Return mock data if no API key
      return NextResponse.json(getMockTranslation(mode, input))
    }

    // Use the assistant with vectorized TER book knowledge
    const result = await translateWithAssistant(mode, input)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Translation error:', error)
    // Return mock data on error
    return NextResponse.json(getMockTranslation(mode, input))
  }
}

function getMockTranslation(mode: string, input: string) {
  if (mode === 'TES') {
    return {
      noticing: "I notice my chest feels tight and my shoulders are tense",
      outer: "You made plans for Saturday without checking with me first",
      under: "I'm afraid I don't matter enough to be considered in decisions",
      why: "Being included in planning is how I feel valued and part of the team",
      ask: "Can we check with each other before making weekend plans?",
      checks: {
        nonMeanness: true,
        pillarsAligned: true,
        instructionsFollowed: [1, 5, 8]
      },
      curiousQuestions: [
        "What was happening for you when you made those plans?",
        "How can we both get our needs met this weekend?"
      ]
    }
  } else {
    return {
      outer: "Partner made weekend plans without discussing first",
      undercurrents: "Feeling excluded, unimportant, perhaps lonely",
      whatMatters: "Partnership, being considered, shared decision-making",
      depthQuestions: [
        "What does being included in planning mean to you?",
        "How do you imagine I experience sudden plan changes?",
        "What would ideal weekend planning look like for us?"
      ],
      suggestedResponse: "I hear that I made weekend plans without checking with you first, and it sounds like that left you feeling excluded and unimportant. Being considered in decisions is really important to you—it's how you feel valued as a partner. I want to understand better: what does being included in planning mean to you? How can we make sure we're both part of these decisions going forward?",
      responseDisclaimer: "Suggested response—adjust to sound like you"
    }
  }
}
