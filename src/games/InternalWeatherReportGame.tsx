'use client'

import { useState } from 'react'
import { Cloud, CloudRain, Sun, Wind, Zap, Snowflake, CloudDrizzle, Heart } from 'lucide-react'
import { GameComponentProps } from './BaggageClaimGame'

interface WeatherSelection {
  partner: 'you' | 'partner'
  weather: string
  notes?: string
}

const weatherOptions = [
  { icon: Sun, label: 'Sunny', color: 'text-yellow-500', description: 'Clear, warm, content' },
  { icon: Cloud, label: 'Partly Cloudy', color: 'text-gray-400', description: 'Mixed feelings, some uncertainty' },
  { icon: CloudDrizzle, label: 'Drizzly', color: 'text-blue-300', description: 'Light sadness, gentle melancholy' },
  { icon: CloudRain, label: 'Rainy', color: 'text-blue-500', description: 'Sadness, tears, grief' },
  { icon: Wind, label: 'Windy', color: 'text-teal-400', description: 'Restless, scattered, anxious' },
  { icon: Zap, label: 'Stormy', color: 'text-purple-500', description: 'Intense emotion, anger, turmoil' },
  { icon: Snowflake, label: 'Frozen', color: 'text-cyan-300', description: 'Numb, shut down, distant' },
]

export default function InternalWeatherReportGame({ title, instructions, onComplete }: GameComponentProps) {
  const [step, setStep] = useState<'intro' | 'your-turn' | 'partner-turn' | 'reflection'>('intro')
  const [yourWeather, setYourWeather] = useState<WeatherSelection | null>(null)
  const [partnerWeather, setPartnerWeather] = useState<WeatherSelection | null>(null)
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const handleWeatherSelect = (weather: string) => {
    setSelectedWeather(weather)
  }

  const handleSubmitWeather = () => {
    if (!selectedWeather) return

    if (step === 'your-turn') {
      setYourWeather({
        partner: 'you',
        weather: selectedWeather,
        notes: notes || undefined
      })
      setSelectedWeather(null)
      setNotes('')
      setStep('partner-turn')
    } else if (step === 'partner-turn') {
      setPartnerWeather({
        partner: 'partner',
        weather: selectedWeather,
        notes: notes || undefined
      })
      setStep('reflection')
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  if (step === 'intro') {
    return (
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-700 mb-4">
            A quick daily practice to share your emotional weather with each other.
          </p>

          <div className="bg-ter-blue/10 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">How to Play (2-3 min)</h3>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Each person picks a weather metaphor that matches their emotional state right now</li>
              <li>Share your weather without explaining or fixing</li>
              <li>Your partner witnesses without trying to change the weather</li>
              <li>No questions, no advice - just "I see you"</li>
            </ol>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium mb-1">💡 Key Principle</p>
            <p className="text-sm text-yellow-800">
              This isn't about fixing the weather - it's about witnessing each other.
              Sometimes being seen in your rain is more connecting than trying to make the sun come out.
            </p>
          </div>

          <button
            onClick={() => setStep('your-turn')}
            className="btn-primary w-full"
          >
            Start Weather Report
          </button>
        </div>
      </div>
    )
  }

  if (step === 'your-turn' || step === 'partner-turn') {
    const isYou = step === 'your-turn'
    return (
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isYou ? 'Your Weather' : "Partner's Weather"}
          </h3>
          <p className="text-gray-600 mb-6">
            {isYou
              ? 'What\'s your internal weather right now?'
              : 'What\'s your partner\'s internal weather right now?'}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {weatherOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedWeather === option.label
              return (
                <button
                  key={option.label}
                  onClick={() => handleWeatherSelect(option.label)}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    isSelected
                      ? 'border-ter-blue bg-ter-blue/10'
                      : 'border-gray-200 hover:border-ter-blue/50 bg-white'
                  }`}
                >
                  <Icon size={32} className={option.color} />
                  <span className="font-medium text-gray-900">{option.label}</span>
                  <span className="text-xs text-gray-600 text-center">{option.description}</span>
                </button>
              )
            })}
          </div>

          {selectedWeather && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optional: Add a brief note (What does this weather feel like in your body?)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., 'Heavy in my chest' or 'Tight in my shoulders'"
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ter-blue"
                rows={2}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => step === 'your-turn' ? setStep('intro') : setStep('your-turn')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleSubmitWeather}
              disabled={!selectedWeather}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {step === 'your-turn' ? "Partner's Turn" : 'See Results'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'reflection') {
    return (
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Weather Report Complete</h3>

          {/* Your Weather */}
          {yourWeather && (
            <div className="mb-6 p-4 bg-ter-blue/5 rounded-lg border border-ter-blue/20">
              <h4 className="font-semibold text-gray-900 mb-2">Your Weather</h4>
              <div className="flex items-center gap-3 mb-2">
                {weatherOptions.find(w => w.label === yourWeather.weather) && (() => {
                  const option = weatherOptions.find(w => w.label === yourWeather.weather)!
                  const Icon = option.icon
                  return <Icon size={24} className={option.color} />
                })()}
                <span className="text-lg font-medium text-gray-900">{yourWeather.weather}</span>
              </div>
              {yourWeather.notes && (
                <p className="text-sm text-gray-700 italic">"{yourWeather.notes}"</p>
              )}
            </div>
          )}

          {/* Partner's Weather */}
          {partnerWeather && (
            <div className="mb-6 p-4 bg-ter-olive/5 rounded-lg border border-ter-olive/20">
              <h4 className="font-semibold text-gray-900 mb-2">Partner's Weather</h4>
              <div className="flex items-center gap-3 mb-2">
                {weatherOptions.find(w => w.label === partnerWeather.weather) && (() => {
                  const option = weatherOptions.find(w => w.label === partnerWeather.weather)!
                  const Icon = option.icon
                  return <Icon size={24} className={option.color} />
                })()}
                <span className="text-lg font-medium text-gray-900">{partnerWeather.weather}</span>
              </div>
              {partnerWeather.notes && (
                <p className="text-sm text-gray-700 italic">"{partnerWeather.notes}"</p>
              )}
            </div>
          )}

          {/* Reflection */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2 mb-3">
              <Heart size={20} className="text-ter-pink mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Witnessing</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Take a moment to simply see each other's weather without trying to change it.
                </p>
                <p className="text-sm text-gray-700">
                  You might say: "I see you're {partnerWeather?.weather.toLowerCase()}. I'm here with you."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-ter-lavender/10 rounded-lg p-4 mb-6 border border-ter-lavender/30">
            <p className="text-sm text-gray-700 mb-2">
              <strong>💡 Remember:</strong> Weather changes. This isn't forever - it's just what's true right now.
            </p>
            <p className="text-sm text-gray-600">
              You can do this practice daily, or anytime one of you needs to be seen.
            </p>
          </div>

          <button
            onClick={handleComplete}
            className="btn-primary w-full"
          >
            Complete Practice
          </button>
        </div>
      </div>
    )
  }

  return null
}
