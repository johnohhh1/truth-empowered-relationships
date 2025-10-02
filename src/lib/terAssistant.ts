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

Return ONLY valid JSON with this exact structure:
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
    : `Analyze what this person is expressing using Truth Empowered Listening (TEL):

INPUT: "${input}"

Return ONLY valid JSON with this exact structure:
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
