import Link from 'next/link'
import { MessageSquare, Mic, BookOpen, Heart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ter-blue/20 to-ter-lavender/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Truth Empowered Relationships
          </h1>
          <p className="text-gray-600">
            Transform reactive patterns into conscious connection
          </p>
        </header>

        {/* Main Tools Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Translator Card */}
          <Link href="/translator" className="block transform transition-transform hover:scale-105">
            <div className="bg-ter-gold rounded-2xl p-8 text-white h-full">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare size={40} />
                <span className="text-white/80 text-sm">TES / TEL</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Translator</h2>
              <p className="text-white/90">
                Transform reactive language into conscious communication
              </p>
              <div className="mt-6 text-sm text-white/80">
                • Truth Empowered Speaking<br />
                • Truth Empowered Listening
              </div>
            </div>
          </Link>

          {/* Mediator Card */}
          <Link href="/mediator" className="block transform transition-transform hover:scale-105">
            <div className="bg-ter-olive rounded-2xl p-8 text-white h-full">
              <div className="flex items-center justify-between mb-4">
                <Mic size={40} />
                <span className="text-white/80 text-sm">Beta</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Mediator</h2>
              <p className="text-white/90">
                Record & analyze conversations in real-time
              </p>
              <div className="mt-6 text-sm text-white/80">
                • 15-60 second recordings<br />
                • Get depth questions & games
              </div>
            </div>
          </Link>

          {/* Pillars Card */}
          <Link href="/pillars" className="block transform transition-transform hover:scale-105">
            <div className="bg-ter-taupe rounded-2xl p-8 text-white h-full">
              <div className="flex items-center justify-between mb-4">
                <BookOpen size={40} />
                <span className="text-white/80 text-sm">Reference</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Four Pillars</h2>
              <p className="text-white/90">
                The foundation of Truth Empowered Relationships
              </p>
              <div className="mt-6 text-sm text-white/80">
                • Freeness • Wholesomeness<br />
                • Non-Meanness • Fairness
              </div>
            </div>
          </Link>

          {/* Games Card */}
          <div className="block transform transition-transform opacity-50 cursor-not-allowed">
            <div className="bg-ter-pink rounded-2xl p-8 text-white h-full">
              <div className="flex items-center justify-between mb-4">
                <Heart size={40} />
                <span className="text-white/80 text-sm">Coming Soon</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Games</h2>
              <p className="text-white/90">
                Playful exercises to deepen connection
              </p>
              <div className="mt-6 text-sm text-white/80">
                • Internal Weather Report<br />
                • Pause • And What Else?
              </div>
            </div>
          </div>

        </div>

        {/* Demo Notice */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white/80 backdrop-blur rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">🚀 Demo Version</h3>
          <p className="text-gray-600 text-sm">
            This is a functional prototype of the Truth Empowered Relationships app. 
            The Translator and Mediator tools are fully working. To use them:
          </p>
          <ol className="mt-3 text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li>Copy the <code className="bg-gray-100 px-1 rounded">.env.local.example</code> file to <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
            <li>Add your OpenAI API key</li>
            <li>Run <code className="bg-gray-100 px-1 rounded">npm install && npm run dev</code></li>
          </ol>
        </div>

      </div>
    </div>
  )
}
