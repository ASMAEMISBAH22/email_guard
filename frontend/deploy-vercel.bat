@echo off
REM Email Guardian Frontend - Vercel Deployment Script (Windows)
REM This script helps deploy the React frontend to Vercel

echo 🚀 Email Guardian Frontend - Vercel Deployment
echo ==============================================

REM Check if we're in the frontend directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the frontend directory
    echo    cd frontend ^&^& deploy-vercel.bat
    pause
    exit /b 1
)

if not exist "src\App.js" (
    echo ❌ Error: Please run this script from the frontend directory
    echo    cd frontend ^&^& deploy-vercel.bat
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Build the project
echo 🔨 Building the project...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix the errors and try again.
    pause
    exit /b 1
)

echo ✅ Build successful!

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
echo.
echo 📋 Deployment Information:
echo    - Backend URL: https://05d64819-55b5-413a-a230-392814dd1908-00-3a3sjoj9agigo.spock.replit.dev
echo    - Environment Variable: REACT_APP_API_URL is set in vercel.json
echo.

vercel --prod

echo.
echo 🎉 Deployment complete!
echo.
echo 📝 Next steps:
echo    1. Test your deployed frontend
echo    2. Try the 'Demo Analysis' feature (no API key required)
echo    3. Generate an API key and test protected features
echo    4. Check that scan history works correctly
echo.
echo 🔗 Your frontend should now be accessible at your Vercel URL
pause 