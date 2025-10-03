import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Your assistant with vectorized TER book
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'asst_G8kVmjn1axL9RHvD620YzfRe'
const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID || 'vs_68d36322de9c8191b8846d6b47922e61'

interface AssistantRequest {
  mode: 'translate-tes' | 'translate-tel' | 'mediator' | 'voice-chat' | 'game-suggester'
  input: string
  additionalContext?: string
}

/**
 * Call the TER Assistant with vectorized book knowledge
 * This is more efficient than repeating TER framework in every prompt
 */
export async function callTERAssistant(request: AssistantRequest): Promise<string> {
  try {
    // Create a thread for this conversation
    const thread = await openai.beta.threads.create()

    // Build context-aware message based on mode
    let fullPrompt = `[MODE: ${request.mode}]\n\n`

    if (request.additionalContext) {
      fullPrompt += `Context: ${request.additionalContext}\n\n`
    }

    fullPrompt += request.input

    // Add message to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: fullPrompt
    })

    // Run the assistant (has access to vectorized TER book)
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: ASSISTANT_ID
    })

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id)
      const assistantMessage = messages.data.find(m => m.role === 'assistant')

      if (assistantMessage && assistantMessage.content[0]?.type === 'text') {
        return assistantMessage.content[0].text.value
      }
    }

    throw new Error(`Assistant run failed with status: ${run.status}`)
  } catch (error) {
    console.error('TER Assistant error:', error)
    throw error
  }
}

/**
 * Structured request for translation (TES/TEL)
 */
export async function translateWithAssistant(mode: 'TES' | 'TEL', input: string) {
  const modeKey = mode === 'TES' ? 'translate-tes' : 'translate-tel'

  const prompt = mode === 'TES'
    ? `Translate this reactive statement into Truth Empowered Speaking (TES) format:

INPUT: "${input}"

Use your knowledge of the TER book to create a detailed, natural translation. Each field should be a complete, conversational sentence or two - not just short phrases.

Return ONLY valid JSON with this structure:
{
  "noticing": "What body sensations and emotions am I experiencing? Be specific and detailed, like 'I notice a tightness spreading across my chest, my jaw is clenched, and I'm feeling a mix of frustration and hurt'",
  "outer": "What are the observable facts without interpretation? Be concrete and specific about what happened.",
  "under": "What's the deepest fear beneath this? Express it fully, like 'I'm afraid that my needs don't matter to you' or 'I'm scared that I'm not a priority in your life'",
  "why": "What core need or value is at stake? Explain it naturally, like 'Being considered and included in decisions is how I feel valued and connected in our partnership'",
  "ask": "What's a specific, doable request? Make it clear and actionable.",
  "checks": {
    "nonMeanness": true,
    "pillarsAligned": true,
    "instructionsFollowed": [1, 5, 8]
  },
  "curiousQuestions": [
    "A question to understand their perspective",
    "A question to find mutual solution"
  ]
}`
    : `Analyze what this person is expressing using Truth Empowered Listening (TEL):

INPUT: "${input}"

Use your TER book knowledge to provide detailed, empathetic analysis. Be thorough and natural - this is about deeply understanding someone, not filling in a template.

Return ONLY valid JSON with this structure:
{
  "outer": "What are the key facts of what they said? Summarize the observable events or statements they mentioned.",
  "undercurrents": "What feelings might be beneath their words? Consider the full emotional landscape - hurt, fear, longing, anger, sadness. Be specific and empathetic.",
  "whatMatters": "What core values or needs are at stake for them? Examples: connection, respect, safety, autonomy, being heard, feeling valued. Explain what's really important to them here.",
  "depthQuestions": [
    "An open-ended, curious question to understand their experience deeper",
    "A question to explore their needs or values",
    "A question to help move toward connection or resolution"
  ],
  "suggestedResponse": "A natural, conversational 3-5 sentence response that: 1) acknowledges what was heard (outer), 2) shows understanding of feelings (undercurrents), 3) validates what matters to them, 4) includes at least one curious question. Sound empathetic and genuinely caring, not formulaic or robotic.",
  "responseDisclaimer": "Suggested response—adjust to sound like you"
}`

  const response = await callTERAssistant({
    mode: modeKey,
    input: prompt
  })

  // Parse JSON from response
  return JSON.parse(response)
}

/**
 * Structured request for conversation analysis (Mediator)
 */
export async function analyzeMediatorSession(transcript: string, speaker: string, duration: number) {
  const prompt = `Analyze this ${duration}-second conversation segment using Truth Empowered Listening (TEL):

SPEAKER: ${speaker}
TRANSCRIPT: "${transcript}"

Provide:
1. TEL Summary (Outer, Undercurrents, What Matters)
2. Three depth questions
3. ONE suggested game from the TER library based on emotional intensity and themes

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

  const response = await callTERAssistant({
    mode: 'mediator',
    input: prompt
  })

  return JSON.parse(response)
}

/**
 * Voice chat with Aria (conversational)
 */
export async function chatWithAria(messages: Array<{ role: 'user' | 'assistant', content: string }>) {
  const conversationContext = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n')

  const lastMessage = messages[messages.length - 1]?.content || ''

  const prompt = `You are Aria, a compassionate Truth Empowered Relationships voice companion.

CONVERSATION SO FAR:
${conversationContext}

Respond naturally to the user's latest message. Keep responses under 120 words. If they ask about a specific game or practice, briefly explain it using your knowledge of the TER book. Suggest games when contextually appropriate.`

  const response = await callTERAssistant({
    mode: 'voice-chat',
    input: prompt,
    additionalContext: `Latest message: ${lastMessage}`
  })

  return response
}
