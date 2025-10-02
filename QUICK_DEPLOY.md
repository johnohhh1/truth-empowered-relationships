# Quick Deploy Guide

## What's Ready
✅ Voice input (microphone button)
✅ Text-to-speech (speaker icons)  
✅ All API endpoints
✅ Mobile compatible

## Deploy Now
1. Double-click `deploy.bat` in this folder
   OR
2. Run these commands:
```
cd C:\Users\John\Downloads\ter-app\ter-app
git add .
git commit -m "Add speech features"
git push origin main
```

## After Deploy
- Wait 2-3 minutes
- Go to https://vercel.com/johnohhh1/truth-empowered-relationships
- Test microphone button in Translator
- Test speaker icons on translation results

## Need Better Quality?
Add to Vercel environment variables:
```
OPENAI_API_KEY=sk-your-key-here
```

## Files Added
- app/hooks/useSpeech.ts
- app/api/transcribe/route.ts
- app/api/text-to-speech/route.ts
- app/translator/page.tsx (updated)

Done! 🎉
