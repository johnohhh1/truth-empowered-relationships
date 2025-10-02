@echo off
cd /d "C:\Users\John\Downloads\ter-app\ter-app"

echo ==================================
echo  Deploying Speech Features to GitHub
echo ==================================
echo.

echo [1/3] Staging changes...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Git add failed
    pause
    exit /b 1
)

echo [2/3] Committing...
git commit -m "Add voice input and text-to-speech features to Translator"
if %errorlevel% neq 0 (
    echo ERROR: Git commit failed (maybe no changes?)
    pause
    exit /b 1
)

echo [3/3] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Git push failed
    pause
    exit /b 1
)

echo.
echo ==================================
echo  SUCCESS! Deployment Complete
echo ==================================
echo.
echo Vercel will auto-deploy in 2-3 minutes
echo Check: https://vercel.com/johnohhh1/truth-empowered-relationships
echo.

pause
