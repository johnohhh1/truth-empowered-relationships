import Link from 'next/link'
import { ArrowLeft, Shield, Heart, HandHeart, Scale } from 'lucide-react'

export default function PillarsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-ter-taupe">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-white hover:text-white/90">
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Link>
            <h1 className="text-xl font-semibold text-white">Four Pillars</h1>
            <div className="w-20"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-4">
          <p className="text-white/90 text-sm">The foundation of Truth Empowered Relationships</p>
        </div>
      </header>

      {/* Pillars Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Pillar 1: Freeness */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-ter-blue/20 rounded-lg">
                <Shield className="text-ter-blue" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">1. Freeness</h2>
                <p className="text-gray-700 mb-3">
                  The freedom to be yourself without judgment
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">In Practice:</p>
                    <p className="text-sm text-gray-600">
                      Express authentic emotions, uncomfortable truths, and deep fears without punishment or rejection
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Examples:</p>
                    <ul className="text-sm text-gray-600 space-y-1 mt-1">
                      <li>• Sharing unpopular opinions without being dismissed</li>
                      <li>• Crying without being told to "be strong"</li>
                      <li>• Admitting mistakes without shame</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg mt-3">
                    <p className="text-sm text-amber-900">
                      <span className="font-medium">The Under:</span> "I'm afraid if you see the real me, you'll leave"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Wholesomeness */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-ter-olive/20 rounded-lg">
                <Heart className="text-ter-olive" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">2. Wholesomeness</h2>
                <p className="text-gray-700 mb-3">
                  Genuine commitment to each other's wellbeing
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">In Practice:</p>
                    <p className="text-sm text-gray-600">
                      Actively support growth, healing, and happiness as if they were your own
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Examples:</p>
                    <ul className="text-sm text-gray-600 space-y-1 mt-1">
                      <li>• Celebrating victories enthusiastically</li>
                      <li>• Supporting through challenges without fixing</li>
                      <li>• Encouraging personal growth even if it's scary</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg mt-3">
                    <p className="text-sm text-amber-900">
                      <span className="font-medium">The Under:</span> "I'm afraid your growth means you'll outgrow me"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: Non-Meanness */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-ter-coral/20 rounded-lg">
                <HandHeart className="text-ter-coral" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">3. Non-Meanness</h2>
                <p className="text-gray-700 mb-3">
                  Never intentionally hurting each other
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">In Practice:</p>
                    <p className="text-sm text-gray-600">
                      Maintain respect even in conflict, choose kindness when triggered
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Examples:</p>
                    <ul className="text-sm text-gray-600 space-y-1 mt-1">
                      <li>• Pausing when angry instead of attacking</li>
                      <li>• Protecting dignity in public</li>
                      <li>• Avoiding known triggers deliberately</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg mt-3">
                    <p className="text-sm text-amber-900">
                      <span className="font-medium">The Under:</span> "I'm afraid if I don't hurt you first, you'll hurt me"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 4: Fairness */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-ter-gold/20 rounded-lg">
                <Scale className="text-ter-gold" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">4. Fairness</h2>
                <p className="text-gray-700 mb-3">
                  Equal respect and consideration for both partners
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">In Practice:</p>
                    <p className="text-sm text-gray-600">
                      Both needs matter equally, both voices heard, both boundaries respected
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Examples:</p>
                    <ul className="text-sm text-gray-600 space-y-1 mt-1">
                      <li>• Taking turns being heard</li>
                      <li>• Equal say in decisions</li>
                      <li>• Shared emotional labor</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg mt-3">
                    <p className="text-sm text-amber-900">
                      <span className="font-medium">The Under:</span> "I'm afraid my needs don't matter as much as yours"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ten Instructions Preview */}
          <div className="card bg-gradient-to-r from-ter-lavender/10 to-ter-blue/10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">The Ten Instructions</h2>
            <p className="text-gray-700 mb-4">
              Psychological safety rules that support the Four Pillars:
            </p>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. Always speak your truth consciously</li>
              <li>2. Practice elevation awareness</li>
              <li>3. Embrace the power of apology</li>
              <li>4. Embrace the power of forgiveness</li>
              <li>5. Maintain mutual care and respect</li>
              <li>6. Create emotional safety</li>
              <li>7. Stay curious and neutral when listening</li>
              <li>8. Own your emotions and reactions</li>
              <li>9. Use clarifying questions</li>
              <li>10. Honor boundaries and needs</li>
            </ol>
          </div>

          {/* Key Reminder */}
          <div className="p-4 bg-ter-gold/10 rounded-lg">
            <p className="text-center text-gray-800 font-medium">
              "The goal isn't comfort, it's truth and connection"
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
