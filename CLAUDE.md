# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Truth Empowered Relationships (TER) web application - a Next.js 14 app that helps couples improve their relationships through AI-powered translation tools, conversation analysis, and interactive relationship games.

**Live App**: https://truth-empowered-relationships.vercel.app/
**Repository**: https://github.com/johnohhh1/truth-empowered-relationships

---

## 🚨 CURRENT PRIORITIES - READ THIS FIRST

The app is functional but needs enhancement in several key areas. **Work through these tasks in priority order:**

### Priority 1: Mediator Mode - Production Ready ⭐
**Status**: Currently in beta with generic fallback responses
**Goal**: Make production-ready with TER-specific guidance

**Required Changes** (`app/mediator/page.tsx`, `app/api/mediator/route.ts`):
- Remove beta flag/warnings from UI
- Replace generic mock responses with TER-aware AI using Mediator persona
- Integrate with database:
  - Store sessions in `mediator_sessions` table
  - Retrieve past sessions for context-aware responses
  - Track usage analytics
- Implement proper TEL (Truth Empowered Listening) output structure:
  - **OUTER**: What was said (observable facts)
  - **UNDERCURRENTS**: Feelings beneath the words
  - **WHAT MATTERS**: Core values at stake
  - **DEPTH QUESTIONS**: 2-3 curious, non-judgmental questions
- Add intelligent game suggestions based on transcript patterns
- Implement proper error handling with actionable messages

**System Prompt**: Use the Mediator persona from reference files (see Reference Documents section)

### Priority 2: Chat Assistant Color Change 🎨
**Status**: Currently uses white background
**Goal**: Visually distinct with brand color

**Required Changes** (`src/voice/VoiceChat.tsx`, styling):
- Change background from white to **Olive (#B8C77C)** - the Mediator brand color
- Ensure WCAG AA text contrast standards
- Update message bubbles:
  - User messages: Light surface (#F7F4EF)
  - Assistant (Aria) messages: White with olive accent border
- Add subtle shadows for depth and polish

### Priority 3: Complete Games System Implementation 🎮
**Status**: Only Baggage Claim exists
**Goal**: Full library of 8+ relationship games with level gating

**Games to Implement** (see `truth_empowered_complete_knowledge.md` for full details):

**Level 1 Games (Beginner):**
1. **Internal Weather Report (IWR)** - 2-3 min, daily emotional check-in
2. **Pause** - 1-2 min, conflict de-escalation tool
3. **Pillar Talk** - 5-10 min, check-in on Four Pillars (Freeness, Wholesomeness, Non-Meanness, Fairness)

**Level 2 Games (Intermediate):**
4. **And What Else?** - 10-20 min, release resentments through inquiry
5. **Closeness Counter** - 30-60 min, physical distance reflects emotional distance

**Level 3+ Games (Advanced):**
6. **Switch** - 10-15 min, argue partner's perspective
7. **Seven Nights of Truth** - 7 days × 5 min, progressive vulnerability building
8. **Bomb Squad** - 45 min exactly, defuse recurring relationship fights

**Implementation Requirements** (`src/games/`):
- Create game components implementing `GameComponentProps` interface
- Build game detail screens with:
  - Clear objective statement
  - Step-by-step "How to Play" instructions
  - Built-in timer (for timed games)
  - Safety notes (especially for advanced games)
  - Post-game debrief questions
- Add to `gamesCatalog` in `GameSelector.tsx`
- Implement level gating (lock games above user's current level)
- Create `game_sessions` database table entries on start/complete
- Build intelligent game suggestion algorithm considering:
  - User's current level
  - Recent mediator/translator session themes
  - Time available (filter by duration)
  - Recent game history (avoid repetition)
  - Current emotional state (if available)

### Priority 4: Database Integration 💾
**Status**: Supabase connected but not fully integrated
**Goal**: Persist all user data

**Tables to Implement/Verify**:
- `users` - User profiles and preferences
- `couples` - Partner pairing and shared progress
- `section_progress` - Training section completion (both partners)
- `translator_sessions` - TES/TEL translation history
- `mediator_sessions` - Conversation recordings and analysis
- `journal_entries` - User reflections with privacy controls
- `game_sessions` - Game completions with feedback
- `comprehension_checks` - Quiz results for section gating

**Integration Points**:
- `src/lib/supabaseClient.ts` - Client initialization
- Every feature should save to database AND local storage (offline fallback)
- Implement sync on reconnection

### Priority 5: AI Assistant Improvements 🤖
**Status**: Generic responses
**Goal**: Context-aware, TER-specific guidance

**Use Personas** (from `truth_power_personas.json`):
- **Mediator**: For mediator mode and conflict guidance
- **Elevation Coach**: For emotional regulation
- **Vulnerability Guide**: For deep sharing support
- **Pattern Analyst**: For recurring issue identification
- **Game Suggester**: For contextual game recommendations

**Context-Aware Requirements**:
- Check user's current level (don't reference advanced concepts for beginners)
- Reference recent translator/mediator sessions for personalized responses
- Use TER-specific terminology: Outer, Inner, Under, Elevation, Four Pillars, etc.
- Suggest appropriate games based on detected patterns
- Maintain conversation context across sessions

### Priority 6: Polish & UX Improvements ✨

**Progress Indicators**:
- Show both partners' progress clearly (couple view)
- Visual streak counter with flame icon 🔥
- Level completion celebration animations
- Section completion badges

**Notifications**:
- ✅ "Comprehension check ready!" (after 24-hour settle timer)
- ✅ "Next section unlocked! 🎉" (when both partners pass)
- ✅ Daily practice reminder (user-set time)
- ❌ NO partner pressure notifications (never "Your partner is waiting")

**Loading States** (replace spinners with informative messages):
- Translator: "Translating your feelings..." (~3s)
- Mediator: Show processing stages with progress bar
- Comprehension grading: "Evaluating your understanding..."
- Game loading: "Setting up [Game Name]..."

**Error Handling** (replace generic errors):
- Network errors: "Can't connect. Check your internet and try again."
- OpenAI errors: "Translation service temporarily unavailable. Try the manual framework in your journal."
- Audio errors: "Couldn't record audio. Check microphone permissions in Settings."
- Database errors: "Couldn't sync. Your data is saved locally and will sync when connection returns."

---

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS with custom TER color palette
- **AI**: OpenAI GPT-4 for translations and analysis
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Audio**: Web Audio API (MediaRecorder, Web Speech API)

### Key Directories

```
ter-app/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── translate/      # OpenAI translation endpoint
│   │   ├── mediator/       # Mediator analysis endpoint (TO BUILD)
│   │   └── voice-chat/     # AI assistant endpoint
│   ├── translator/         # TES/TEL translation UI
│   ├── mediator/           # Audio recording & analysis
│   ├── pillars/            # Four Pillars reference
│   ├── hooks/              # React hooks (useSpeech.ts)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (imports App.tsx)
├── src/
│   ├── games/              # Game components (BaggageClaimGame, GameSelector)
│   ├── voice/              # Voice chat AI assistant (VoiceChat.tsx)
│   └── lib/                # Utilities (Supabase client)
├── App.tsx                 # Main app component (home screen)
└── tailwind.config.js      # Custom TER color palette
```

### Path Aliases
- `@/*` - Resolves to project root (configured in tsconfig.json)

## Reference Documents

**IMPORTANT**: These documents contain the complete TER framework, game instructions, AI personas, and product requirements. Reference them when implementing features:

- `truth_empowered_complete_knowledge.md` - Complete TER framework, all games, tools, and methodology
- `truth_power_personas.json` - AI assistant personas with system prompts for each mode
- `truth_empowered_relationships_prd.md` - Full product requirements and user flows
- `PRD.md` - Technical implementation specifications

**Where to Find Them**: Check project root or `/docs` directory

## Core Features

### 1. Translator (TES/TEL)
**Location**: `app/translator/page.tsx`, `app/api/translate/route.ts`
**Status**: ✅ Working, needs database integration

- **TES (Truth Empowered Speaking)**: Translates reactive language into conscious communication
  - Structure: NOTICING (inner) → OUTER (words) → UNDER (fear) → WHY (value) → ASK (request)
- **TEL (Truth Empowered Listening)**: Helps understand what partner is expressing
  - Structure: OUTER → UNDERCURRENTS → WHAT MATTERS → DEPTH QUESTIONS

**How it works**:
1. Client component collects input (text or voice)
2. POST to `/api/translate` with mode ('TES' or 'TEL') and input
3. Server uses OpenAI GPT-4 with structured JSON output
4. Returns translation with validation checks
5. Client displays with color-coded sections (blue, gold, coral, olive, lavender)

**Voice Integration**: Uses `useSpeech` hook for:
- Voice input: Record → transcribe → populate textarea
- Text-to-speech: Click speaker icon to hear translations

**Database TODO**:
- Save each translation to `translator_sessions` table
- Include: user_id, mode, input_text, output_json, created_at
- Load recent translations in UI

### 2. Mediator (Beta → Production)
**Location**: `app/mediator/page.tsx`, `app/api/mediator/route.ts` (TO BUILD)
**Status**: ⚠️ Beta with mock data - NEEDS WORK (Priority 1)

**Current Implementation**:
- Records 15-60 second audio segments
- Mock transcription and analysis
- Generic TEL summary
- Generic depth questions

**Required Implementation**:
- Real OpenAI Whisper transcription
- TER-aware AI analysis using Mediator persona
- Pattern detection (recurring themes, emotional states)
- Intelligent game suggestions
- Database persistence
- Context from previous sessions

**System Prompt Pattern** (use Mediator persona):
```typescript
const systemPrompt = `You are a skilled relationship mediator trained in Truth Empowered Relationships (TER).
Analyze this conversation segment using TEL (Truth Empowered Listening):

OUTER: What was actually said (facts only)
UNDERCURRENTS: Emotions and fears beneath the words
WHAT MATTERS: Core values and needs at stake
DEPTH QUESTIONS: 2-3 curious, open-ended questions to deepen understanding

Also suggest an appropriate relationship game from the library based on themes detected.

Return JSON: { outer, undercurrents, whatMatters, depthQuestions: [], suggestedGame: { name, reason } }`
```

### 3. Voice Features
**Location**: `app/hooks/useSpeech.ts`
**Status**: ✅ Working

Custom hook providing:
- `startRecording()` / `stopRecording()` - MediaRecorder API
- `transcribeAudio(blob)` - Speech-to-text (mock in demo, OpenAI Whisper ready)
- `speak(text)` / `stopSpeaking()` - Web Speech API (text-to-speech)
- State management for recording, transcribing, speaking

### 4. Games System
**Location**: `src/games/GameSelector.tsx`, `src/games/BaggageClaimGame.tsx`
**Status**: ⚠️ Only 1 of 8 games implemented (Priority 3)

**Current Implementation**:
- GameSelector with level gating
- Local storage + Supabase sync for progress
- Baggage Claim game only

**Required Implementation**: See Priority 3 above for full game list and requirements

**Game Component Interface**:
```typescript
interface GameComponentProps {
  title: string
  level: GameLevel  // 'beginner' | 'intermediate' | 'advanced'
  instructions: string
  onComplete: () => void
}
```

### 5. Voice Chat Assistant (Aria)
**Location**: `src/voice/VoiceChat.tsx`, `app/api/voice-chat/route.ts`
**Status**: ⚠️ Needs color change and persona integration (Priority 2 & 5)

**Current Features**:
- Voice-activated conversation
- Can launch games on request
- Basic OpenAI integration

**Required Changes**:
- Change background to Olive (#B8C77C)
- Use context-aware personas from `truth_power_personas.json`
- Reference user's level and recent sessions
- Suggest games based on conversation patterns

## AI Integration Patterns

### OpenAI Translation Endpoint
**File**: `app/api/translate/route.ts`

```typescript
// Pattern: Structured JSON responses
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",  // or "gpt-4" for better quality
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: input }
  ],
  temperature: 0.7,
  response_format: { type: "json_object" }  // Enforces valid JSON
})
```

**Key Points**:
- System prompts define exact JSON structure in prompt
- Falls back to mock data if API key missing or error occurs
- Always returns valid JSON matching interface types
- Temperature 0.7 for balance of consistency and creativity
- Use lower temperature (0.3-0.5) for more consistent, rule-based outputs
- Use higher temperature (0.8-0.9) for more creative, exploratory responses

### Persona System Prompts
**Reference**: `truth_power_personas.json`

Each AI mode (Mediator, Elevation Coach, etc.) has a dedicated persona with:
- Role definition
- Communication style
- TER framework knowledge
- Specific response patterns
- Example interactions

**Implementation Pattern**:
```typescript
import personas from '@/truth_power_personas.json'

const systemPrompt = personas.mediator.system_prompt
// Include user context:
const contextPrompt = `User is at Level ${userLevel}. Recent topics: ${recentThemes.join(', ')}`

const messages = [
  { role: "system", content: `${systemPrompt}\n\n${contextPrompt}` },
  ...conversationHistory,
  { role: "user", content: userMessage }
]
```

### Mock Data Strategy
- All features have fallback mock data for development without API keys
- Enables full UI testing without OpenAI costs
- Production checks `process.env.OPENAI_API_KEY` before real calls
- Mock data should be realistic and follow TER framework

## Custom Color System

**File**: `tailwind.config.js`

TER brand colors used semantically throughout app:

```javascript
colors: {
  'ter-gold': '#F5C95D',      // Translator (TES/TEL)
  'ter-olive': '#B8C77C',     // Mediator, Voice Chat
  'ter-blue': '#A7CCD9',      // Training sections
  'ter-coral': '#E07A5F',     // Live events, "Under" emotions
  'ter-taupe': '#8D725D',     // Progress tracking
  'ter-pink': '#F4B8C1',      // Sessions, active states
  'ter-lavender': '#C5B9D6',  // Journal, "Ask" sections
  'ter-dark': '#2A2927',      // Dark backgrounds
}
```

**Background Colors**:
- `#F7F4EF` - Light background (warm off-white)
- `#1C1E20` - Primary text (near-black)

**Usage Pattern**: Colors map to feature types and emotional states, not just aesthetics.
- Gold = Translation/Speaking
- Olive = Mediation/Listening
- Blue = Learning/Training
- Coral = Intensity/Conflict
- Pink = Connection/Intimacy

## Database Integration

**File**: `src/lib/supabaseClient.ts`
**Status**: ⚠️ Client initialized but not fully integrated (Priority 4)

### Environment Variables Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Database Tables (verify these exist in Supabase):

```sql
-- Users and couples
users (id, email, name, current_level, created_at)
couples (id, user1_id, user2_id, invite_code, paired_at)

-- Progress tracking
section_progress (id, user_id, section_id, completed, comprehension_score, completed_at)
game_sessions (id, user_id, game_id, duration_minutes, completed, feedback, created_at)

-- Content storage
translator_sessions (id, user_id, mode, input_text, output_json, created_at)
mediator_sessions (id, user_id, audio_url, transcript, tel_analysis, suggested_game, created_at)
journal_entries (id, user_id, content, is_shared_with_partner, created_at)
comprehension_checks (id, user_id, section_id, questions_json, answers_json, score, passed, created_at)
```

### Integration Pattern:
```typescript
import { getSupabaseClient } from '@/src/lib/supabaseClient'

// Save data
const client = getSupabaseClient()
if (client) {
  const { data, error } = await client
    .from('translator_sessions')
    .insert({
      user_id: userId,
      mode: 'TES',
      input_text: input,
      output_json: translation,
      created_at: new Date().toISOString()
    })

  if (error) console.error('Database error:', error)
}

// Fallback to localStorage if Supabase unavailable
if (!client || error) {
  localStorage.setItem('translator_sessions', JSON.stringify(sessions))
}
```

## Environment Variables

Create `.env.local` in project root:

```bash
# Required for AI features
OPENAI_API_KEY=sk-your-api-key-here

# Required for database features
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Never commit `.env.local`. Use `.env.local.example` for templates.

## Component Patterns

### Client Components
All interactive pages use `'use client'` directive:
- `app/translator/page.tsx` - Form inputs, state management
- `app/mediator/page.tsx` - Audio recording, MediaRecorder
- `src/games/GameSelector.tsx` - Game state, progress tracking
- `src/voice/VoiceChat.tsx` - Real-time voice interaction

### API Routes
Server-side only, handle sensitive operations:
- `app/api/translate/route.ts` - OpenAI API calls (keeps API key secret)
- `app/api/mediator/route.ts` - TO BUILD
- `app/api/voice-chat/route.ts` - AI assistant with persona system

### Shared Hooks
- `app/hooks/useSpeech.ts` - Audio recording, transcription, TTS (reusable across features)

## Audio Features

### Recording Pattern
```typescript
// 1. Request microphone permission
const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

// 2. Create MediaRecorder
const mediaRecorder = new MediaRecorder(stream)

// 3. Collect chunks
mediaRecorder.ondataavailable = (event) => {
  chunks.push(event.data)
}

// 4. Create blob on stop
mediaRecorder.onstop = () => {
  const blob = new Blob(chunks, { type: 'audio/webm' })
  // Send to OpenAI Whisper for transcription
}
```

### Text-to-Speech Pattern
```typescript
// Web Speech API (browser-native)
const utterance = new SpeechSynthesisUtterance(text)
utterance.rate = 0.9  // Slightly slower for clarity
utterance.pitch = 1.0
window.speechSynthesis.speak(utterance)

// Alternative: OpenAI TTS API for better quality
const audioResponse = await openai.audio.speech.create({
  model: "tts-1",
  voice: "nova",  // warm, empathetic voice
  input: text
})
```

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automatically on push to main branch

**Production URL**: https://truth-empowered-relationships.vercel.app/

### Environment-Specific Behavior
- Development: Shows helpful errors, allows mock data
- Production: Hides sensitive errors, requires real API keys for full features

## Important Notes

### Browser Compatibility
- **Audio Recording**: Requires HTTPS in production (works on localhost without)
- **Web Speech API**: Best support in Chrome/Edge
- **MediaRecorder**: Supported in all modern browsers

### Performance Considerations
- OpenAI API calls typically 2-5 seconds
- Audio transcription (Whisper) 3-10 seconds depending on length
- Game components lazy-loaded where possible
- Use streaming responses for long AI outputs

### Error Handling Philosophy
- User-facing errors are friendly and actionable (no technical jargon)
- Technical errors logged to console for debugging
- All features have graceful fallbacks (mock data or offline mode)
- Never show "Error 500" or raw error messages to users

### Key Features Checklist

Verify these core features are working:
- [ ] Pairing system (invite codes for couples)
- [ ] 24-hour settle timer after both partners complete section
- [ ] Comprehension checks (both must pass ≥80% to unlock next section)
- [ ] Journal with privacy toggle (share with partner or keep private)
- [ ] Translator TES mode (reactive → conscious speaking)
- [ ] Translator TEL mode (understand what partner means)
- [ ] Mediator with real transcription and analysis
- [ ] Game suggestions contextually relevant to recent conversations
- [ ] Progress tracking synced between partners
- [ ] Four Pillars reference easily accessible from any screen
- [ ] Ten Instructions reference easily accessible

## Common Development Tasks

### Adding a New Game
1. Create component in `src/games/NewGame.tsx`
2. Implement `GameComponentProps` interface
3. Add full game details from `truth_empowered_complete_knowledge.md`:
   - Objective (what's the point?)
   - How to Play (step-by-step instructions)
   - Safety notes (especially for intense games)
   - Debrief questions
4. Add to `gamesCatalog` in `GameSelector.tsx`:
   ```typescript
   {
     id: 'game-id',
     title: 'Game Name',
     level: 'beginner' | 'intermediate' | 'advanced',
     duration: 'X min',
     description: 'Brief description',
     instructions: 'Full instructions',
     component: GameComponent
   }
   ```
5. Test level gating works correctly

### Adding a New AI Persona Mode
1. Define persona in `truth_power_personas.json` (or use existing)
2. Create API endpoint in `app/api/[mode]/route.ts`
3. Load persona system prompt
4. Add user context (level, recent topics)
5. Implement structured JSON response
6. Add UI component for the mode
7. Test with various inputs and edge cases

### Extending Voice Features
1. Modify `useSpeech.ts` hook for new capabilities
2. Ensure error handling for permission denials
3. Test on multiple browsers (speech APIs vary)
4. Consider fallback to text input if voice fails

### Integrating with Database
1. Verify table exists in Supabase
2. Create TypeScript interface matching table schema
3. Implement save function with error handling
4. Add localStorage fallback
5. Implement sync on reconnection
6. Test offline → online transition

## Testing Strategy

Currently no automated tests. Manual testing focuses on:
- Translation accuracy with various emotional inputs
- Audio recording in different browsers
- Game flow and progress persistence
- Error states (no API key, network failure, etc.)
- Mobile responsiveness
- Database sync (online/offline transitions)

**Future Testing Needs**:
- Unit tests for utility functions
- Integration tests for AI endpoints
- E2E tests for critical user flows
- Accessibility testing (WCAG AA compliance)

## Success Criteria for Current Priorities

### Mediator Mode Success:
- ✅ No beta warnings shown
- ✅ Provides TER-specific guidance (not generic therapy talk)
- ✅ Suggests relevant games based on conversation
- ✅ Stores sessions in database
- ✅ Uses past sessions for context
- ✅ Error messages are helpful and actionable

### Games System Success:
- ✅ All 8 core games playable
- ✅ Level gating works (can't play advanced games as beginner)
- ✅ Clear instructions and timers
- ✅ Progress saves to database
- ✅ Game suggestions are contextually relevant

### Chat Assistant Success:
- ✅ Olive background (#B8C77C) looks polished
- ✅ Uses appropriate persona for context
- ✅ References user's level correctly
- ✅ Suggests games based on conversation patterns
- ✅ Maintains conversation context

### Database Integration Success:
- ✅ All features save to Supabase
- ✅ Offline mode works with localStorage
- ✅ Syncs when connection returns
- ✅ No data loss during interruptions

---

## Future Architecture Considerations

- User authentication system (Supabase Auth recommended)
- Real-time partner synchronization (Supabase real-time subscriptions)
- Offline mode with service workers and sync
- Native mobile apps (React Native or Expo)
- Comprehensive test suite (Jest, Playwright, Cypress)
- Analytics and usage tracking
- Push notifications for reminders
- In-app purchases for premium features
- Video/audio couple sessions with WebRTC
