'use client'

import { useState } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'

interface MediatorTutorialProps {
  onClose: () => void
}

const tutorialSteps = [
  {
    title: "Welcome to Mediator",
    content: "Mediator helps you understand what's being said beneath the surface during important conversations.",
    icon: "🎯"
  },
  {
    title: "How It Works",
    content: "Record 15-60 second segments of your conversation. We'll analyze each turn using Truth Empowered Listening (TEL).",
    icon: "🎙️"
  },
  {
    title: "What You'll Get",
    content: "For each segment, you'll receive:\n• What was said (Outer)\n• Feelings beneath the words (Undercurrents)\n• Core values at stake (What Matters)\n• Curious questions to deepen connection",
    icon: "💡"
  },
  {
    title: "Tap to Record",
    content: "Simply tap the microphone to start recording. Tap again to stop and analyze. The recording auto-stops at 60 seconds.",
    icon: "⏺️"
  },
  {
    title: "Best Practices",
    content: "• Take turns recording (you, then partner)\n• Pause after 30-45 seconds for deeper analysis\n• Use suggested games when emotions run high\n• Remember: both partners consent to transcription",
    icon: "✨"
  }
]

export default function MediatorTutorial({ onClose }: MediatorTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = tutorialSteps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">{step.icon}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h2>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">{step.content}</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-ter-olive'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 btn-secondary flex items-center justify-center"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 btn-primary flex items-center justify-center"
          >
            {currentStep < tutorialSteps.length - 1 ? (
              <>
                Next
                <ChevronRight size={20} className="ml-1" />
              </>
            ) : (
              'Get Started'
            )}
          </button>
        </div>

        {/* Skip option */}
        {currentStep < tutorialSteps.length - 1 && (
          <button
            onClick={onClose}
            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip tutorial
          </button>
        )}
      </div>
    </div>
  )
}
