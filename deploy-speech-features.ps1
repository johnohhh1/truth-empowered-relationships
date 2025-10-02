#!/usr/bin/env pwsh
# Navigate to app directory
Set-Location "C:\Users\John\Downloads\ter-app\ter-app"

# Check current status
Write-Host "📊 Current git status:" -ForegroundColor Cyan
git status --short

Write-Host "`n🔧 Staging all changes..." -ForegroundColor Yellow
git add .

Write-Host "`n💾 Committing changes..." -ForegroundColor Green
git commit -m "Add voice input and text-to-speech features to Translator

- Added useSpeech hook for speech recognition and TTS
- Added microphone button for voice input in Translator
- Added speaker icons for read-aloud on all translation results
- Created API endpoints for Whisper transcription and OpenAI TTS
- Integrated speech features with existing Translator UI"

Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Magenta
git push origin main

Write-Host "`n✅ Done! Check Vercel dashboard for deployment status:" -ForegroundColor Green
Write-Host "   https://vercel.com/johnohhh1/truth-empowered-relationships`n" -ForegroundColor Blue
