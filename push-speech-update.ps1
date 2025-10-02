# Push speech features to GitHub
Write-Host "🎤 Pushing speech features to GitHub..." -ForegroundColor Cyan

# Stage all changes
git add .

# Commit
git commit -m "Add voice input and text-to-speech to Translator"

# Push
git push origin main

Write-Host "✅ Speech features pushed! Vercel will auto-deploy in ~2 minutes" -ForegroundColor Green
Write-Host "🔗 Check deployment: https://vercel.com/johnohhh1/truth-empowered-relationships" -ForegroundColor Yellow
