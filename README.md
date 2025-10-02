# Truth Empowered Relationships App

A functional web application for the Truth Empowered Relationships framework, featuring AI-powered translation tools and conversation analysis.

![TER App Demo](demo-screenshot.png)

## 🚀 Features

### ✅ Working Features

1. **Translator (TES/TEL)** 
   - Truth Empowered Speaking: Transform reactive language into conscious communication
   - Truth Empowered Listening: Understand what your partner is really saying
   - AI-powered translations with OpenAI integration
   - 🎤 **Voice Input**: Speak instead of type with speech-to-text
   - 🔊 **Read Aloud**: Hear translations spoken with text-to-speech
   - Copy-to-clipboard functionality

2. **Mediator (Beta)**
   - Record 15-60 second conversation segments
   - Automatic transcription and analysis
   - TEL summaries with depth questions
   - Game suggestions based on conversation patterns

3. **Four Pillars Reference**
   - Complete guide to Freeness, Wholesomeness, Non-Meanness, and Fairness
   - Examples and "The Under" for each pillar
   - Ten Instructions overview

### 🔜 Coming Soon
- Games library (Internal Weather Report, Pause, And What Else?, etc.)
- User accounts and partner pairing
- Progress tracking through 7 levels
- Comprehension checks
- Mobile app versions

## 📱 Demo Access

### Quick Start (No Setup)
View the live demo at: [Your Vercel URL will go here after deployment]

### Local Development Setup

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd ter-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-api-key-here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open the app**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

### Translator
1. Click on the **Translator** card from the home screen
2. Choose between TES (Truth Empowered Speaking) or TEL (Truth Empowered Listening)
3. For TES: Enter what you want to say (reactive language)
   - **OR** click the 🎤 microphone button to speak your message
4. For TEL: Enter what your partner said
   - **OR** click the 🎤 microphone button to record them
5. Click **Translate** to get the conscious communication version
6. Click 🔊 speaker icons to hear each translation section spoken aloud
7. Copy individual sections or the entire translation

### Mediator
1. Click on the **Mediator** card from the home screen
2. Select who's speaking (You or Partner)
3. **Hold the record button** to record (15-60 seconds)
4. Release to stop recording
5. Click **Analyze** to process the recording
6. Review the TEL summary, depth questions, and suggested game

### Four Pillars
- Reference guide always available
- Review the foundation of Truth Empowered Relationships
- Understand "The Under" - the deeper fears beneath each pillar

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4
- **Audio**: Web Audio API
- **Deployment**: Vercel
- **Language**: TypeScript

## 🌟 Key Components

### Translation Engine
- Uses GPT-4 to translate reactive language
- Follows Truth Empowered Speaking structure
- Includes validation checks (Non-Meanness, Pillars, Instructions)

### Audio Processing
- Browser-based recording (no server upload needed for demo)
- Mock transcription for demo (Whisper API ready for production)
- Contextual analysis based on conversation patterns

### Responsive Design
- Mobile-first approach
- PWA-ready for app-like experience
- Touch-optimized for recording

## 📝 Environment Variables

```bash
# Required for AI features
OPENAI_API_KEY=your_openai_api_key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📖 Project Structure

```
ter-app/
├── app/
│   ├── page.tsx              # Home page with navigation
│   ├── translator/
│   │   └── page.tsx          # TES/TEL translator
│   ├── mediator/
│   │   └── page.tsx          # Recording & analysis
│   ├── pillars/
│   │   └── page.tsx          # Four Pillars reference
│   ├── api/
│   │   └── translate/
│   │       └── route.ts      # Translation API endpoint
│   ├── globals.css           # Global styles
│   └── layout.tsx            # Root layout
├── public/                   # Static assets
├── package.json             # Dependencies
└── README.md               # This file
```

## 🔒 Privacy & Security

- No user data is stored in the demo version
- Audio recordings are processed locally
- OpenAI API calls are made server-side to protect API keys
- All data is ephemeral (cleared on page refresh)

## 🤝 Contributing

This is a prototype/demo. For the full production version, consider:

1. Adding user authentication
2. Implementing real audio transcription (Whisper API)
3. Adding database for progress tracking
4. Creating native mobile apps
5. Implementing the full games library
6. Adding partner pairing and synchronization

## 📚 Resources

- [Truth Empowered Relationships Website](https://truthempowered.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

## 📄 License

This demo is for educational purposes. The Truth Empowered Relationships framework is proprietary to Marshall Zweig and Heather Mason.

## 💡 Notes for Development

### Why This Approach?

1. **Speed**: Built in hours, not months
2. **Cost**: ~$50/month vs $50,000+ for native apps
3. **Iteration**: Deploy updates instantly
4. **Control**: Own your data and infrastructure
5. **Modern**: Uses cutting-edge web technologies

### Next Steps for Production

1. **Authentication**: Add NextAuth for user accounts
2. **Database**: PostgreSQL with Prisma for data persistence
3. **Real Transcription**: Integrate Whisper API
4. **Payment**: Stripe for subscriptions
5. **Analytics**: Track usage and engagement
6. **Testing**: Add comprehensive test suite

## 🐛 Known Issues

- Audio recording requires HTTPS in production (works on localhost)
- Mock data is returned if OpenAI API key is not configured
- Mediator analysis is simulated in demo mode

## 📧 Support

For questions about the app structure, create an issue in the repository.
For questions about Truth Empowered Relationships, visit the official website.

---

**Built with ❤️ using the Truth Empowered Relationships framework**
