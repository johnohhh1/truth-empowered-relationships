@echo off
echo ===================================
echo Running TypeScript Type Check...
echo ===================================
call npx tsc --noEmit

echo.
echo ===================================
echo Running ESLint...
echo ===================================
call npm run lint

echo.
echo ===================================
echo Running Build Test...
echo ===================================
call npm run build

echo.
echo ===================================
echo All checks complete!
echo ===================================
pause
