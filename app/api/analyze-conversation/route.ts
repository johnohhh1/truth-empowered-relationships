import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { transcript, speaker, duration } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      // Return mock analysis if no API key
      return NextResponse.json(getMockAnalysis())
    }

    const systemPrompt = `You are a Truth Empowered Listening (TEL) analyzer. Analyze this conversation segment and provide:
    
1. TEL Summary with:
   - Outer: What was actually said (facts)
   - Undercurrents: The emotions beneath the words
   - What Matters: Core values or needs at stake

2. Three depth questions to help deepen understanding

3. Suggest ONE appropriate game from:
   - Internal Weather Report (2 min): For emotional awareness
   - Pause (1-2 min): For de-escalation
   - And What Else? (10-20 min): For clearing resentments
   - Closeness Counter (30-60 min): For reconnection
   - Bomb Squad (45 min): For recurring conflicts

Return ONLY valid JSON:
{
  "telSummary": {
    "outer": "...",
    "undercurrents": "...",
    "whatMatters": "..."
  },
  "depthQuestions": ["...", "...", "..."],
  "suggestedGame": {
    "name": "...",
    "duration": "...",
    "description": "...",
    "rationale": "..."
  }
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${speaker === 'partner' ? 'Partner' : 'Speaker'} said: "${transcript}" (Duration: ${duration} seconds)` }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json(result)

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(getMockAnalysis())
  }
}

function getMockAnalysis() {
  return {
    telSummary: {
      outer: "Partner expressed frustration about feeling unheard",
      undercurrents: "Feeling dismissed, unimportant, possibly lonely",
      whatMatters: "Being seen, validated, and prioritized in the relationship"
    },
    depthQuestions: [
      "What specific moments help you feel truly heard?",
      "How do you know when I'm really listening to you?",
      "What would feeling prioritized look like in daily life?"
    ],
    suggestedGame: {
      name: "And What Else?",
      duration: "10-20 min",
      description: "Release layers of unspoken resentment",
      rationale: "There seem to be accumulated feelings that need expression"
    }
  }
}
