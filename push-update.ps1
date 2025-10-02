# TER App - Push Speech Features Update
Write-Host "`n🚀 Pushing Speech Features to GitHub" -ForegroundColor Green
Write-Host "====================================`n" -ForegroundColor Green

# Navigate to the app directory
Set-Location "C:\Users\John\Downloads\ter-app\ter-app"

# Configure git
git config user.email "john@truthempowered.com"
git config user.name "John"

# Add the new files
Write-Host "📁 Adding new API endpoints..." -ForegroundColor Yellow
git add app/api/transcribe/route.ts
git add app/api/text-to-speech/route.ts
git add app/api/analyze-conversation/route.ts
git add app/hooks/useSpeech.ts

# Commit
Write-Host "`n💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Add speech-to-text and text-to-speech API endpoints

- Added Whisper transcription endpoint
- Added OpenAI TTS endpoint  
- Added conversation analysis endpoint
- Added reusable useSpeech hook"

# Push
Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ Done! Vercel will auto-deploy in ~2 minutes" -ForegroundColor Green
Write-Host "Check: https://truth-empowered-relationships.vercel.app" -ForegroundColor Cyan
