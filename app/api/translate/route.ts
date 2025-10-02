import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { mode, input } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      // Return mock data if no API key
      return NextResponse.json(getMockTranslation(mode, input))
    }

    const systemPrompt = mode === 'TES' 
      ? getTESSystemPrompt() 
      : getTELSystemPrompt()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json(result)

  } catch (error) {
    console.error('Translation error:', error)
    // Return mock data on error
    return NextResponse.json(getMockTranslation('TES', ''))
  }
}

function getTESSystemPrompt() {
  return `You are a Truth Empowered Speaking translator. Transform reactive language into conscious communication.

FRAMEWORK:
- NOTICING (Inner): Internal body sensations and emotions
- OUTER (Words): Observable facts only (what a camera would record)  
- UNDER: Deepest fear or vulnerability (abandonment, inadequacy, unworthiness)
- WHY: Core need or value driving the emotion
- ASK: Clear, kind, specific request

Return ONLY valid JSON:
{
  "noticing": "I notice [body sensation and emotion]",
  "outer": "[Observable fact without interpretation]",
  "under": "I'm afraid [deepest fear]",
  "why": "[Core need/value] is how I [feel valued/safe/loved]",
  "ask": "Can [specific doable request]?",
  "checks": {
    "nonMeanness": true,
    "pillarsAligned": true,
    "instructionsFollowed": [1, 5, 8]
  },
  "curiousQuestions": [
    "[Question to understand their perspective]",
    "[Question to find mutual solution]"
  ]
}`
}

function getTELSystemPrompt() {
  return `You are a Truth Empowered Listening coach. Help someone understand what their partner shared.

FRAMEWORK:
- OUTER: What they actually said (facts)
- UNDERCURRENTS: What they might be feeling beneath
- WHAT MATTERS: Core values or needs at stake  
- DEPTH QUESTIONS: Curious questions to deepen understanding

Return ONLY valid JSON:
{
  "outer": "[Key facts from what they said]",
  "undercurrents": "[Possible feelings beneath the words]",
  "whatMatters": "[Core values/needs: connection, respect, safety, etc.]",
  "depthQuestions": [
    "[Open-ended curious question 1]",
    "[Open-ended curious question 2]",
    "[Open-ended curious question 3]"
  ]
}`
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
      ]
    }
  }
}
